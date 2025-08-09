#!/usr/bin/env node

const { handlePortConflict } = require('./port-handler');
const path = require('path');

async function startServer() {
  const PORT = process.env.PORT || 3001;
  const serverPath = path.join(__dirname, '../server');
  
  console.log('🔧 Checking server port availability...');
  
  await handlePortConflict(
    PORT,
    'Server',
    'npm',
    ['run', 'dev'],
    { cwd: serverPath }
  );
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutdown requested...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server shutdown requested...');
  process.exit(0);
});

startServer().catch((error) => {
  console.error('❌ Error starting server:', error.message);
  process.exit(1);
});