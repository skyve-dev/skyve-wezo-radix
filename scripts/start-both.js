#!/usr/bin/env node

const { spawn } = require('child_process');
const { handlePortConflict } = require('./port-handler');
const path = require('path');

async function startBoth() {
  const SERVER_PORT = process.env.PORT || 3001;
  const CLIENT_PORT = process.env.VITE_PORT || 5173;
  
  console.log('🔧 Checking server port availability...');
  
  // Check server port first
  await handlePortConflict(SERVER_PORT, 'Server');
  
  console.log('🔧 Checking client port availability...');
  
  // Check client port
  await handlePortConflict(CLIENT_PORT, 'Client');
  
  console.log('✅ Both ports are available. Starting applications...');
  
  // Start both applications using concurrently
  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..')
  });
  
  child.on('error', (error) => {
    console.error('❌ Failed to start applications:', error.message);
    process.exit(1);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down applications...');
    child.kill('SIGINT');
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down applications...');
    child.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  });
}

startBoth().catch((error) => {
  console.error('❌ Error starting applications:', error.message);
  process.exit(1);
});