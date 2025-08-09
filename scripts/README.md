# Port Conflict Handler Scripts

This directory contains Node.js scripts that handle port conflicts gracefully for both server and client applications.

## Files

- **`port-handler.js`** - Core utility for detecting and handling port conflicts
- **`start-server.js`** - Server startup script with port conflict handling
- **`start-client.js`** - Client startup script with port conflict handling  
- **`start-both.js`** - Combined script for starting both server and client with port conflict handling

## Usage

### From Root Directory

```bash
# Start both server and client with port conflict handling
npm run dev:safe

# Start only server with port conflict handling
npm run dev:server:safe

# Start only client with port conflict handling  
npm run dev:client:safe

# Check if specific ports are available
npm run port:check <port> <appName>
```

### Direct Script Usage

```bash
# Check and handle port conflict for server (port 3001)
node scripts/start-server.js

# Check and handle port conflict for client (port 5173)
node scripts/start-client.js

# Check and handle port conflicts for both applications
node scripts/start-both.js

# Manual port checking
node scripts/port-handler.js 3001 "My App"
node scripts/port-handler.js 5173 "My Client"
```

## Features

- **Port Conflict Detection**: Automatically detects if requested ports are in use
- **Process Identification**: Identifies which process is using a conflicted port
- **User Confirmation**: Prompts user before terminating existing processes
- **Graceful Termination**: Safely kills existing processes using the port
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Auto-Restart**: Automatically starts your application after resolving conflicts

## How It Works

1. **Port Check**: Scripts check if the required port is available
2. **Conflict Detection**: If port is in use, identifies the process using it
3. **User Prompt**: Asks user whether to terminate the existing process
4. **Process Termination**: If user confirms, terminates the conflicting process
5. **Application Start**: Starts the requested application on the now-available port
6. **Graceful Exit**: If user declines, exits without making changes

## Environment Variables

- **`PORT`** - Server port (default: 3001)
- **`VITE_PORT`** - Client port (default: 5173)

## Error Handling

The scripts include comprehensive error handling:

- Port availability validation
- Process identification failures
- Process termination failures  
- Application startup failures
- Graceful shutdown on SIGINT/SIGTERM

## Examples

### Starting Development Environment

```bash
# This will:
# 1. Check if port 3001 is available for server
# 2. Check if port 5173 is available for client  
# 3. Prompt to kill conflicting processes if needed
# 4. Start both applications
npm run dev:safe
```

### Manual Port Management

```bash
# Check if port 8080 is available for "My Custom App"
node scripts/port-handler.js 8080 "My Custom App"

# Check port and run custom command if available
node scripts/port-handler.js 3000 "Express Server" node server.js
```

## Integration

These scripts can be easily integrated into any Node.js project:

1. Copy the `scripts/` directory to your project
2. Add the npm scripts to your `package.json`
3. Install required dependencies (none beyond Node.js built-ins)
4. Use `npm run dev:safe` instead of `npm run dev`