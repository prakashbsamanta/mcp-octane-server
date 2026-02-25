# OpenText ALM Octane MCP Server

A Model Context Protocol (MCP) server for OpenText ALM Octane. This server enables LLMs (like Claude, GitHub Copilot) to seamlessly execute queries, fetch defects, create work items, and interact with the Octane API directly through text instructions.

## 🚀 Quick Start (NPX)

You can run this MCP server directly via `npx` without needing to clone the repository.
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

---

## � NPM Publishing and Usage

This project is configured to be seamlessly packaged and published to the NPM registry. Publishing the package makes it universally accessible and installable via `npm` or runnable anywhere directly via `npx` (as shown in the Quick Start).

### 1. Publishing to NPM

If you are an administrator and want to publish your own custom version of this package to NPM:

1. **Login to NPM** (You only need to do this once):
   ```bash
   npm login
   ```
2. **Build the latest definitions**: Ensure the project compiles down to the `dist` folder:
   ```bash
   npm run build
   ```
3. **Publish**: 
   ```bash
   npm publish
   ```
   *(Ensure your `version` in `package.json` is incrementally updated before subsequent publishes).*

### 2. Global Installation via NPM

Once published (or when grabbing it from a public registry), users can install it globally on their system:

```bash
npm install -g mcp-octane-server
```

After global installation, you can run the server directly from anywhere using the executable name mapped in the package `bin`:

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

* **Tools:** `search_defects`, `get_defect_details`, `create_defect`, `update_story_status`, `get_my_work`.
* **Prompts:** `triage_assistance` (Analyzes defect data using the LLM and suggests 3 root causes from provided context).

---

## 🏗️ Local Development

1. Clone this repository.
2. Run `npm install`.
3. Create a `.env` file referencing `.env.example`.
4. Run `npm run build` to compile the app.
5. Use `npm run start` to spin up the local build, or test live using `npm run dev`.
