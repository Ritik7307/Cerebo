let audioCtx = null;
let gainNode = null;
let sources = new WeakMap();
let currentMultiplier = 1;

function initAudio(mediaElement) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = currentMultiplier;
    gainNode.connect(audioCtx.destination);
  }
  
  if (!sources.has(mediaElement)) {
    try {
      // Create source
      const source = audioCtx.createMediaElementSource(mediaElement);
      // Re-route audio through gainNode
      source.connect(gainNode);
      sources.set(mediaElement, source);
    } catch (e) {
      console.log("Volume Booster: Could not connect to media element. (CORS issue or already connected)", e);
    }
  }
}

function scanForMedia() {
  document.querySelectorAll('video, audio').forEach(initAudio);
}

// Initial scan
scanForMedia();

// Listen for dynamically added elements
const observer = new MutationObserver((mutations) => {
  let addedNodes = false;
  for (const m of mutations) {
    if (m.addedNodes.length > 0) {
      addedNodes = true;
      break;
    }
  }
  if (addedNodes) scanForMedia();
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SET_VOLUME') {
    currentMultiplier = request.value;
    if (gainNode) {
      gainNode.gain.value = currentMultiplier;
    }
    scanForMedia();
    sendResponse({ success: true });
  }
});
