#!/usr/bin/env node

const net = require('net');
const { exec, spawn } = require('child_process');
const readline = require('readline');

/**
 * Check if a port is in use
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is in use
 */
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(true);
    });
  });
}

/**
 * Find process using a specific port
 * @param {number} port - Port number
 * @returns {Promise<string|null>} - Process ID or null
 */
function findProcessOnPort(port) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        
        const lines = stdout.split('\n').filter(line => line.includes(`${port} `));
        if (lines.length > 0) {
          const parts = lines[0].trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          resolve(pid);
        } else {
          resolve(null);
        }
      });
    } else {
      exec(`lsof -ti:${port}`, (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }
        
        const pid = stdout.trim();
        resolve(pid || null);
      });
    }
  });
}

/**
 * Kill process by PID
 * @param {string} pid - Process ID
 * @returns {Promise<boolean>} - Success status
 */
function killProcess(pid) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const killCommand = isWindows ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;
    
    exec(killCommand, (error) => {
      resolve(!error);
    });
  });
}

/**
 * Prompt user for confirmation
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>} - User's response
 */
function askUser(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Handle port conflict and optionally start command
 * @param {number} port - Port number to check
 * @param {string} appName - Name of the application (for display)
 * @param {string} command - Command to run after resolving conflict (optional)
 * @param {string[]} args - Arguments for the command (optional)
 * @param {object} options - Spawn options (optional)
 */
async function handlePortConflict(port, appName, command = null, args = [], options = {}) {
  const portInUse = await isPortInUse(port);
  
  if (!portInUse) {
    console.log(`✅ Port ${port} is available for ${appName}`);
    
    if (command) {
      console.log(`🚀 Starting ${appName}...`);
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });
      
      child.on('error', (error) => {
        console.error(`❌ Failed to start ${appName}:`, error.message);
        process.exit(1);
      });
      
      return child;
    }
    return null;
  }
  
  console.log(`⚠️  Port ${port} is already in use!`);
  
  const pid = await findProcessOnPort(port);
  if (!pid) {
    console.log(`❌ Could not identify the process using port ${port}`);
    process.exit(1);
  }
  
  console.log(`📍 Process ${pid} is using port ${port}`);
  
  const shouldKill = await askUser(
    `❓ Do you want to terminate the process using port ${port} and start ${appName}? (y/N): `
  );
  
  if (!shouldKill) {
    console.log(`🚫 User declined to terminate existing process. Exiting...`);
    process.exit(0);
  }
  
  console.log(`🔄 Terminating process ${pid}...`);
  const killed = await killProcess(pid);
  
  if (!killed) {
    console.log(`❌ Failed to terminate process ${pid}`);
    process.exit(1);
  }
  
  console.log(`✅ Successfully terminated process ${pid}`);
  
  // Wait a moment for the port to be released
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verify port is now available
  const stillInUse = await isPortInUse(port);
  if (stillInUse) {
    console.log(`❌ Port ${port} is still in use after terminating the process`);
    process.exit(1);
  }
  
  if (command) {
    console.log(`🚀 Starting ${appName} on port ${port}...`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });
    
    child.on('error', (error) => {
      console.error(`❌ Failed to start ${appName}:`, error.message);
      process.exit(1);
    });
    
    return child;
  }
  
  return null;
}

module.exports = {
  isPortInUse,
  findProcessOnPort,
  killProcess,
  askUser,
  handlePortConflict
};

// Allow running as standalone script
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node port-handler.js <port> <appName> [command] [args...]');
    process.exit(1);
  }
  
  const port = parseInt(args[0]);
  const appName = args[1];
  const command = args[2] || null;
  const commandArgs = args.slice(3) || [];
  
  handlePortConflict(port, appName, command, commandArgs);
}