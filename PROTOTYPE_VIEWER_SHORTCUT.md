# Prototype Viewer Quick Launch

This document provides instructions for creating shortcuts to quickly launch the prototype viewer.

## Option 1: PowerShell Script (Recommended)

The `open-prototypes.ps1` script automatically checks if the dev server is running and opens the prototype viewer.

### Usage:
```powershell
.\open-prototypes.ps1
```

### To create a shortcut:
1. Right-click on `open-prototypes.ps1` → **Create shortcut**
2. Right-click the shortcut → **Properties**
3. In the **Target** field, prepend:
   ```
   powershell.exe -ExecutionPolicy Bypass -File "
   ```
   And append:
   ```
   "
   ```
   Full example:
   ```
   powershell.exe -ExecutionPolicy Bypass -File "D:\Cursor\shadcntest2\open-prototypes.ps1"
   ```
4. Optionally change the icon or add a keyboard shortcut in the **Shortcut** tab

## Option 2: Batch File (Simpler)

The `open-prototypes.bat` file is simpler but less robust.

### Usage:
Double-click `open-prototypes.bat` or run:
```cmd
open-prototypes.bat
```

### To create a shortcut:
1. Right-click on `open-prototypes.bat` → **Create shortcut**
2. Optionally pin to taskbar or add keyboard shortcut

## Option 3: Direct Command (For Advanced Users)

### PowerShell one-liner:
```powershell
if (Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded) { Start-Process "http://localhost:3000/prototypes" } else { Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"; Start-Sleep -Seconds 5; Start-Process "http://localhost:3000/prototypes" }
```

### Command Prompt:
```cmd
start http://localhost:3000/prototypes
```
(Assumes dev server is already running)

## Option 4: NPM Script (Add to package.json)

You can add this script to your `package.json`:

```json
"scripts": {
  "prototypes": "start http://localhost:3000/prototypes && npm run dev"
}
```

Then run: `npm run prototypes`

## Recommended Setup

1. **For daily use**: Use Option 1 (PowerShell script) with a desktop shortcut
2. **For quick access**: Pin the shortcut to your taskbar
3. **For keyboard shortcut**: 
   - Right-click shortcut → Properties → Shortcut tab
   - Set a keyboard shortcut (e.g., `Ctrl+Alt+P`)

## Notes

- The PowerShell script checks if port 3000 is in use before starting a new server
- The batch file starts the server in a new window (you'll need to close it manually)
- If the dev server is already running, both scripts will just open the browser
- The prototype viewer is available at: `http://localhost:3000/prototypes`

