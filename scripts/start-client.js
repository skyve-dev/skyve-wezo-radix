#!/usr/bin/env node

const { handlePortConflict } = require('./port-handler');
const path = require('path');

async function startClient() {
  const PORT = process.env.VITE_PORT || 5173;
  const clientPath = path.join(__dirname, '../client');
  
  console.log('🔧 Checking client port availability...');
  
  await handlePortConflict(
    PORT,
    'Client',
    'npm',
    ['run', 'dev'],
    { 
      cwd: clientPath,
      env: { 
        ...process.env, 
        VITE_PORT: PORT 
      }
    }
  );
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Client shutdown requested...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Client shutdown requested...');
  process.exit(0);
});

startClient().catch((error) => {
  console.error('❌ Error starting client:', error.message);
  process.exit(1);
});