import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tables = [
  'User',
  'DSAProgress',
  'Internship',
  'FocusSession',
  'Habit',
  'Event',
  'ResumeVersion',
  'Playlist',
  'PlaylistItem',
  'AIRoadmap',
  'Project',
  'RoadmapProgress',
  'AICompanyGuide'
];

async function main() {
  console.log('Enabling Row Level Security on public tables...');
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS enabled for ${table}`);
    } catch (e) {
      console.error(`❌ Failed for ${table}:`, e);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
