# @veyradev/sdk

The official TypeScript SDK for **Veyra** — a lightweight, self-hosted developer infrastructure platform for monitoring Node.js applications, tracking Discord bots, and managing SaaS incidents.

[![npm version](https://badgen.net/npm/v/@veyradev/sdk)](https://www.npmjs.com/package/@veyradev/sdk) [![License: MIT](https://badgen.net/npm/license/@veyradev/sdk)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
npm install @veyradev/sdk
```

## 🚀 Quick Start (For Apps & Bots)

Integrating telemetry into your application takes just a few lines of code. Use the API Key generated from your Veyra dashboard to authenticate your bot or backend service.

```typescript
import { Veyra } from "@veyradev/sdk";

// Initialize with your Project's API Key
const veyra = new Veyra({
  token: "veyra_your_api_key_here",
  baseUrl: "[https://api.strixhost.xyz](https://api.strixhost.xyz)" 
});

// Log a structured event
await veyra.events.create({
  level: "error",
  message: "Database connection failed",
  source: "DatabaseManager",
  environment: "production",
  metadata: { retries: 3 }
});

// Send an uptime heartbeat ping
await veyra.heartbeats.send("your_project_id_here");
```

---

## 🛠️ Management SDK (For Dashboards & Automation)

The Veyra SDK also supports full SaaS account management. You can use it to register user accounts, provision projects, and generate API keys programmatically using JWT authentication.

### 1. Authenticate & Create a Project
```typescript
import { Veyra } from "@veyradev/sdk";

const veyra = new Veyra();

// 1. Register or Login to your developer account
const auth = await veyra.auth.login("dev@example.com", "supersecure123");

// 2. Set the JWT token for future management requests
veyra.setToken(auth.token);

// 3. Create a new monitoring project
const projectData = await veyra.projects.create({
  name: "My Discord Bot",
  environment: "production",
  heartbeatInterval: 60000 // Expect a ping every 60 seconds
});

const projectId = projectData.project.id;
```

### 2. Provision API Keys & Webhooks
```typescript
// Attach a Discord Webhook for automated downtime alerts
await veyra.projects.update(projectId, {
  webhookUrl: "[https://discord.com/api/webhooks/](https://discord.com/api/webhooks/)...",
  alertsEnabled: true
});

// Generate a secure API key for this project
const keyData = await veyra.projects.keys.create(projectId, "Production Key");

console.log("Your raw API Token:", keyData.key.token); 
// Note: Store this safely! The raw token is only returned once.
```

---

## 📈 Pro Features (Uptime & Log Export)

Veyra automatically tracks incidents and calculates SLA Uptime. You can fetch these metrics or export raw data at any time.

```typescript
// Fetch 30-Day SLA Uptime stats
const uptime = await veyra.projects.uptime(projectId);
console.log(`Current SLA: ${uptime.uptimeSLA}`);
console.log(`Total Downtime: ${uptime.downtimeSeconds} seconds`);
console.log(`Total Incidents: ${uptime.totalIncidents}`);

// Export all logs as a CSV file
const csvData = await veyra.projects.exportCsv(projectId);
fs.writeFileSync("./veyra_logs.csv", csvData);
```

---

## 📚 Complete API Reference

### Account & Auth
- `veyra.auth.register(email, password)`
- `veyra.auth.login(email, password)`
- `veyra.setToken(token)` - Update the active JWT or API Key.

### Project Management *(Requires JWT)*
- `veyra.projects.list()` - List all projects owned by the user.
- `veyra.projects.create(data)` - Create a new project.
- `veyra.projects.get(projectId)` - Fetch project details.
- `veyra.projects.update(projectId, data)` - Update settings (webhooks, intervals).
- `veyra.projects.delete(projectId)` - Permanently delete a project.
- `veyra.projects.uptime(projectId)` - Get 30-day uptime SLA calculations.
- `veyra.projects.exportCsv(projectId)` - Download all project events as a CSV string.

### API Keys *(Requires JWT)*
- `veyra.projects.keys.list(projectId)` - List all keys (returns secure hashes/prefixes).
- `veyra.projects.keys.create(projectId, name)` - Generate a new key.
- `veyra.projects.keys.revoke(projectId, keyId)` - Delete a key.

### Telemetry *(Requires API Key)*
- `veyra.events.create(payload)` - Ingest a new log event.
- `veyra.events.list(queryFilters)` - Query recent events.
- `veyra.events.metrics()` - Get event counts grouped by severity level.
- `veyra.heartbeats.send(projectId)` - Ping the heartbeat monitor.
- `veyra.incidents.create(payload)` - Manually open an incident.
- `veyra.incidents.resolve(incidentId)` - Mark an incident as resolved.

## 💡 Code Examples

We provide fully working, production-ready examples for different environments. Click below to see the code:

[![TypeScript Examples](https://img.shields.io/badge/TypeScript-Examples-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/rootSTARYYY/veyrasdk/tree/examplesTS)
[![JavaScript Examples](https://img.shields.io/badge/JavaScript-Examples-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/rootSTARYYY/veyrasdk/tree/examplesJS)
[![Pure API Examples](https://img.shields.io/badge/Pure_API-(No_SDK)-20BEFF?style=for-the-badge&logo=cURL&logoColor=white)](https://github.com/rootSTARYYY/veyrasdk/tree/pureapi)

## License
MIT
