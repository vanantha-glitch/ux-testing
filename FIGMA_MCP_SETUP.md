# Figma MCP Setup Guide for Cursor

## Method 1: Using Figma Developer MCP (API Token) - RECOMMENDED

1. **Open Cursor Settings:**
   - Press `Ctrl+,` to open Settings
   - Or go to `File` → `Preferences` → `Settings`

2. **Navigate to MCP Settings:**
   - Go to `Settings` → `Features` → `MCP`
   - Or use Command Palette (`Ctrl+Shift+P`) and search for "MCP: Configure Servers"
   - This will open the MCP configuration file (usually `mcp.json`)

3. **Add Figma MCP Server Configuration:**
   
   Add this configuration to your `mcp.json` file:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY_HERE",
        "--stdio"
      ]
    }
  }
}
```

4. **Save the configuration** and restart Cursor.

5. **Verify the connection:**
   - The Figma MCP server should appear in your MCP servers list
   - You should be able to access Figma designs through Cursor

## Alternative: Using Figma Desktop MCP

If you prefer using the Figma Desktop app integration:
- Make sure Figma Desktop is installed and running
- Open your design file in Figma Desktop
- The Desktop MCP will automatically connect (no API token needed)

## Troubleshooting

- **If the server doesn't start:** Make sure Node.js and npm are installed
- **If you get authentication errors:** Verify your Figma API token is valid
- **If MCP doesn't appear:** Check Cursor's MCP settings are enabled

## Your Figma API Token
```
YOUR_FIGMA_API_KEY_HERE
```
Note: Replace with your actual Figma API token. Get one from https://www.figma.com/developers/api#access-tokens

