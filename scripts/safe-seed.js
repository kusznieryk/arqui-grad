const fs = require('fs');
const path = require('path');

// Create a safe seed script that handles production environment
async function safeSeed() {
  // Check if we're in a build environment (like Vercel)
  if (process.env.VERCEL || process.env.CI) {
    console.log('⏭️  Skipping database seeding in build environment');
    return;
  }

  // Check if DATABASE_URL exists and is not empty
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  No DATABASE_URL found, skipping seeding');
    return;
  }

  // Only run seeding if we have a proper database connection
  try {
    console.log('🌱 Starting database seeding...');
    const { spawn } = require('child_process');
    const seedProcess = spawn('node', ['scripts/seed-exercises.js'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    seedProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Database seeding completed successfully');
      } else {
        console.log('⚠️  Database seeding failed, continuing with build...');
      }
    });

    seedProcess.on('error', (error) => {
      console.log('⚠️  Could not run seeding:', error.message);
    });
  } catch (error) {
    console.log('⚠️  Seeding error:', error.message);
  }
}

safeSeed();