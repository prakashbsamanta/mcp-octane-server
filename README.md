# OpenText ALM Octane MCP Server

A Model Context Protocol (MCP) server for OpenText ALM Octane. This server enables LLMs (like Claude, GitHub Copilot) to seamlessly execute queries, fetch defects, create work items, and interact with the Octane API directly through text instructions.

## 🚀 Quick Start (NPX)

This package is published on the public NPM registry. The easiest way to run this MCP server is directly via `npx` (which will download and execute the latest version on the fly), without needing to clone the repository or install anything globally.

Simply provide your ALM Octane credentials as environment variables:

```bash
npx -y mcp-octane-server \
  OCTANE_URL="https://almoctane-europe.saas.microfocus.com" \
  OCTANE_SHARED_SPACE_ID="1001" \
  OCTANE_WORKSPACE_ID="1002" \
  OCTANE_CLIENT_ID="your-client-id" \
  OCTANE_CLIENT_SECRET="your-client-secret"
```

---

## ⚙️ Configuration Variables

The following environment variables are strictly required to start the server:

| Variable | Description |
|---|---|
| `OCTANE_URL` | Base Server URL of your Octane Instance. (e.g., `https://almoctane-europe.saas.microfocus.com`) |
| `OCTANE_SHARED_SPACE_ID` | Numeric or String Identifier for the Shared Space. |
| `OCTANE_WORKSPACE_ID` | Numeric or String Identifier for the Workspace within the Shared Space. |
| `OCTANE_CLIENT_ID` | Your API Access Client ID created in Octane settings. |
| `OCTANE_CLIENT_SECRET` | Your API Access Client Secret corresponding to the Client ID. |

---

## 🛠️ IDE & Client Setup

### Claude Desktop
Add the following configuration to your `mcpServers` settings in the Claude configuration file `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "octane": {
      "command": "npx",
      "args": ["-y", "mcp-octane-server"],
      "env": {
        "OCTANE_URL": "https://almoctane-europe.saas.microfocus.com",
        "OCTANE_SHARED_SPACE_ID": "1001",
        "OCTANE_WORKSPACE_ID": "1002",
        "OCTANE_CLIENT_ID": "your-client-id",
        "OCTANE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### Visual Studio Code (MCP Extension)
Create or append to the `.vscode/settings.json` file in your workspace:

```json
{
  "mcp.servers": {
    "octane": {
      "command": "npx",
      "args": ["-y", "mcp-octane-server"],
      "env": {
        "OCTANE_URL": "https://almoctane-europe.saas.microfocus.com",
        "OCTANE_SHARED_SPACE_ID": "1001",
        "OCTANE_WORKSPACE_ID": "1002",
        "OCTANE_CLIENT_ID": "your-client-id",
        "OCTANE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

*Note: Using `npx -y mcp-octane-server` in your IDE configuration is recommended as it ensures your client always fetches the latest version of the server from NPM upon startup. If you prefer to install it globally (`npm i -g mcp-octane-server`), you can replace the command array with simply `mcp-octane`.*
---

## 📦 Global Installation

If you intend to run the server frequently from your terminal outside of an IDE, you can install it globally on your system:

```bash
npm install -g mcp-octane-server
```

After global installation, you can run the server using the compiled executable name directly from anywhere:

```bash
mcp-octane \
  OCTANE_URL="https://almoctane-europe.saas.microfocus.com" \
  OCTANE_SHARED_SPACE_ID="1001" \
  OCTANE_WORKSPACE_ID="1002" \
  OCTANE_CLIENT_ID="your-client-id" \
  OCTANE_CLIENT_SECRET="your-client-secret"
```

---

## �🐳 Docker Usage

You can also run the server via a pre-built Docker image.
To run the server ensuring proper network resolution and passing standard input/output:

```bash
docker run -i --rm \
  -e OCTANE_URL="https://almoctane-europe.saas.microfocus.com" \
  -e OCTANE_SHARED_SPACE_ID="1001" \
  -e OCTANE_WORKSPACE_ID="1002" \
  -e OCTANE_CLIENT_ID="your-client-id" \
  -e OCTANE_CLIENT_SECRET="your-client-secret" \
  mcp-octane-server
```

---

## 🧠 Available Tools & Prompts

* **Tools:** `search_all`, `get_defect_details`, `create_defect`, `update_defect`, `create_story`, `update_story_status`, `get_manual_test`, `get_suite_runs`, `get_run_history`, `get_my_work`.
* **Prompts:** `triage_assistance` (Analyzes defect data using the LLM and suggests 3 root causes from provided context).

---

## 🏗️ Local Development

1. Clone this repository.
2. Run `npm install`.
3. Create a `.env` file referencing `.env.example`.
4. Run `npm run build` to compile the app.
5. Use `npm run start` to spin up the local build, or test live using `npm run dev`.
