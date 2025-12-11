# deploy-proto

Start the Next.js development server and open the prototype viewer in the browser.

## Instructions

When the user runs `/deploy-proto`, you should:

1. **Check if the dev server is running** on port 3000
   - Use `Test-NetConnection` or check if port 3000 is listening
   - If running, skip to step 3

2. **Start the dev server** if not running:
   - Run `npm run dev` in the background or a new terminal
   - Wait a few seconds for the server to initialize

3. **Open the prototype viewer** in the default browser:
   - Navigate to `http://localhost:3000/prototypes`
   - Use PowerShell: `Start-Process "http://localhost:3000/prototypes"`
   - Or use the browser MCP tools if available

4. **Provide feedback** to the user:
   - Confirm the server status
   - Provide the URL that was opened
   - Mention that the page will auto-refresh on code changes

## Quick Command

You can use this PowerShell command sequence:
```powershell
# Check if server is running, start if needed, then open browser
$port = 3000
$url = "http://localhost:$port/prototypes"
$isRunning = (Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded

if (-not $isRunning) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    Start-Sleep -Seconds 5
}

Start-Process $url
```

This command will be available in chat with /deploy-proto
