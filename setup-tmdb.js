#!/usr/bin/env node

/**
 * TMDB Setup Script
 * Helps users configure the TMDB API integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎬 TMDB API Setup for CinemaReview\n');

console.log('This script will help you set up the TMDB API integration.');
console.log('You can get a free API key from: https://www.themoviedb.org/settings/api\n');

rl.question('Enter your TMDB API key: ', (apiKey) => {
  if (!apiKey.trim()) {
    console.log('❌ API key is required. Please run the script again.');
    rl.close();
    return;
  }

  // Create .env.local file
  const envContent = `# TMDB API Configuration
VITE_TMDB_API_KEY=${apiKey.trim()}
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=CinemaReview
`;

  const envPath = path.join(__dirname, '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created successfully!');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run dev');
    console.log('3. Open: http://localhost:5173');
    
    console.log('\n📚 Documentation:');
    console.log('- TMDB Integration Guide: ./TMDB_INTEGRATION.md');
    console.log('- Main README: ./README.md');
    
    console.log('\n🎉 Setup complete! Enjoy exploring movies!');
    
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
    console.log('\nPlease create the file manually with the following content:');
    console.log('\n' + envContent);
  }
  
  rl.close();
});
