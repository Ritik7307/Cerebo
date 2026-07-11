"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "./user";
import { revalidatePath } from "next/cache";
import YouTubeSR from "youtube-sr";

export async function addPlaylist(url: string, category?: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  try {
    // Extract playlist ID if the user pastes a watch URL with a list parameter
    let targetUrl = url;
    try {
      const parsedUrl = new URL(url);
      const listId = parsedUrl.searchParams.get("list");
      if (listId) {
        targetUrl = `https://www.youtube.com/playlist?list=${listId}`;
      }
    } catch {
      // Ignore invalid URL formatting, let youtube-sr handle the error
    }

    // Check URL types
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    const isSingleVideo = isYoutube && ((url.includes('watch?v=') && !url.includes('list=')) || url.includes('youtu.be/'));

    let playlistInfo;
    let title = "Unknown Playlist";
    let channel: string | null = null;
    let videos: any[] = [];

    if (!isYoutube) {
      title = new URL(targetUrl).hostname;
      videos = [{
        title: "External Resource",
        id: targetUrl, // store full URL as ID
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", // generic learning thumbnail
        durationFormatted: null
      }];
    } else if (isSingleVideo) {
      try {
        const videoInfo = await YouTubeSR.getVideo(url);
        if (videoInfo && videoInfo.id) {
          title = videoInfo.title || "Unknown Video";
          channel = videoInfo.channel?.name || null;
          videos = [{
            title: videoInfo.title || "Unknown Video",
            id: videoInfo.id,
            thumbnail: videoInfo.thumbnail?.url || `https://i.ytimg.com/vi/${videoInfo.id}/hqdefault.jpg`,
            durationFormatted: videoInfo.durationFormatted || null,
          }];
        }
      } catch (e) {
        // Fallback for single video parsing
        const vIdMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
        if (vIdMatch) {
          const vId = vIdMatch[1];
          title = "YouTube Video";
          videos = [{
            title,
            id: vId,
            thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
            durationFormatted: null
          }];
        }
      }
      
      if (videos.length === 0) {
         throw new Error("Could not fetch video. Please check the URL.");
      }
    } else {
      // Parse the playlist URL using youtube-sr
      try {
        playlistInfo = await YouTubeSR.getPlaylist(targetUrl);
      } catch (e: unknown) {
        console.warn("youtube-sr failed, falling back to RSS:", e);
      }

      if (playlistInfo && playlistInfo.videos && playlistInfo.videos.length > 0) {
        title = playlistInfo.title || "Unknown Playlist";
        channel = playlistInfo.channel?.name || null;
        videos = playlistInfo.videos.map(v => ({
          title: v.title || "Unknown Video",
          id: v.id || "",
          thumbnail: v.thumbnail?.url || null,
          durationFormatted: v.durationFormatted || null,
        }));
      } else {
        // Robust Fallback: Check for official YouTube API Key first
      const listIdMatch = targetUrl.match(/list=([a-zA-Z0-9_-]+)/);
      if (!listIdMatch) throw new Error("Could not extract Playlist ID from URL.");
      const listId = listIdMatch[1];
      const apiKey = process.env.YOUTUBE_API_KEY;

      if (apiKey) {
        // Use Official YouTube Data API (Fetches ALL videos with pagination)
        console.log("Using YouTube Data API v3...");
        
        // Fetch Playlist Metadata (Title, Channel)
        const metaRes = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${listId}&key=${apiKey}`);
        const metaData = await metaRes.json();
        if (metaData.items && metaData.items.length > 0) {
          title = metaData.items[0].snippet.title;
          channel = metaData.items[0].snippet.channelTitle;
        }

        // Fetch All Videos in Playlist
        let nextPageToken = "";
        do {
          const pageTokenParam = nextPageToken ? `&pageToken=${nextPageToken}` : "";
          const pageRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${listId}&maxResults=50${pageTokenParam}&key=${apiKey}`);
          const pageData = await pageRes.json();
          
          if (pageData.items) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pageData.items.forEach((item: any) => {
              if (item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video") {
                videos.push({
                  title: item.snippet.title,
                  id: item.snippet.resourceId.videoId,
                  thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
                  durationFormatted: null,
                });
              }
            });
          }
          nextPageToken = pageData.nextPageToken || "";
        } while (nextPageToken);

      } else {
        // Fallback to RSS Feed (Limited to 15 videos, no API key required)
        console.log("No API Key found, falling back to RSS...");
        const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${listId}`);
        if (!rssRes.ok) throw new Error("Failed to fetch playlist via RSS.");
        const xml = await rssRes.text();

        // Extract Playlist Title
        const titleMatch = xml.match(/<title>(.*?)<\/title>/);
        if (titleMatch) title = titleMatch[1];

        // Extract Channel Name
        const authorMatch = xml.match(/<author><name>(.*?)<\/name>/);
        if (authorMatch) channel = authorMatch[1];

        // Extract Videos
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;
        while ((match = entryRegex.exec(xml)) !== null) {
          const entryHtml = match[1];
          const vTitleMatch = entryHtml.match(/<title>(.*?)<\/title>/);
          const vIdMatch = entryHtml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
          if (vTitleMatch && vIdMatch) {
            videos.push({
              title: vTitleMatch[1],
              id: vIdMatch[1],
              thumbnail: `https://i.ytimg.com/vi/${vIdMatch[1]}/hqdefault.jpg`,
              durationFormatted: null,
            });
          }
        }
      }

      if (videos.length === 0) {
        throw new Error("Could not fetch playlist videos. Please check the URL or API Key.");
      }
    }
  }

    // Create the playlist in DB
    const playlist = await prisma.playlist.create({
      data: {
        userId: user.id,
        title: title,
        url: targetUrl,
        channel: channel,
        thumbnail: videos[0]?.thumbnail || null,
        category: category || null,
        items: {
          create: videos.map((video, index) => ({
            title: video.title,
            videoId: video.id,
            sequence: index,
            thumbnail: video.thumbnail,
            duration: video.durationFormatted,
          }))
        }
      }
    });

    // Return success
    revalidatePath("/playlists");
    return { success: true, playlistId: playlist.id };
  } catch (error: unknown) {
    console.error("Error adding playlist:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage || "Failed to add playlist" };
  }
}

export async function getPlaylists() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  return await prisma.playlist.findMany({
    where: { userId: user.id },
    include: {
      items: {
        orderBy: { sequence: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getPlaylistById(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  return await prisma.playlist.findFirst({
    where: { id, userId: user.id },
    include: {
      items: {
        orderBy: { sequence: 'asc' }
      }
    }
  });
}

export async function togglePlaylistItem(itemId: string, isCompleted: boolean) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership before updating
  const item = await prisma.playlistItem.findUnique({
    where: { id: itemId },
    include: { playlist: true }
  });

  if (!item || item.playlist.userId !== user.id) {
    throw new Error("Item not found or unauthorized");
  }

  await prisma.playlistItem.update({
    where: { id: itemId },
    data: { isCompleted }
  });

  revalidatePath(`/playlists/${item.playlistId}`);
  revalidatePath(`/playlists`);
}

export async function deletePlaylist(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.playlist.deleteMany({
    where: { id, userId: user.id }
  });

  revalidatePath("/playlists");
}
