# @veyradev/sdk

The official TypeScript SDK for **Veyra** — a lightweight, self-hosted developer infrastructure platform for monitoring Node.js applications, tracking Discord bots, and managing SaaS incidents.

[![npm version](https://badgen.net/npm/v/@veyradev/sdk)](https://www.npmjs.com/package/@veyradev/sdk) [![License: MIT](https://badgen.net/npm/license/@veyradev/sdk)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
npm install @veyradev/sdk
🚀 Quick Start (For Apps & Bots)
If you have already generated an API Key from your Veyra dashboard, integrating telemetry into your app takes 3 lines of code.

TypeScript
import { Veyra } from "@veyradev/sdk";

// Initialize with your Project API Key
const veyra = new Veyra({
  token: "veyra_your_api_key_here",
  baseUrl: "[https://api.your-veyra-domain.com](https://api.your-veyra-domain.com)" // Optional: Omit for localhost:3001
});

// Log an event
await veyra.events.create({
  level: "error",
  message: "Database connection failed",
  source: "DatabaseManager"
});

// Send an uptime heartbeat ping
await veyra.heartbeats.send("your_project_id_here");
🛠️ Management SDK (For Dashboards & Automation)
The Veyra SDK also supports full SaaS account management. You can use it to register accounts, provision projects, and generate API keys programmatically.

1. Authenticate & Create a Project
TypeScript
import { Veyra } from "@veyradev/sdk";

const veyra = new Veyra();

// 1. Login to your developer account
const auth = await veyra.auth.login("dev@example.com", "supersecure123");

// 2. Set the JWT token for future requests
veyra.setToken(auth.token);

// 3. Create a new monitoring project
const projectData = await veyra.projects.create({
  name: "My Discord Bot",
  environment: "production"
});

const projectId = projectData.project.id;
2. Provision API Keys & Webhooks
TypeScript
// Attach a Discord Webhook for automated downtime alerts
await veyra.projects.update(projectId, {
  webhookUrl: "[https://discord.com/api/webhooks/](https://discord.com/api/webhooks/)...",
  alertsEnabled: true
});

// Generate a secure API key for this project
const keyData = await veyra.projects.keys.create(projectId, "Production Key");
console.log("Your raw API Token:", keyData.key.token); // Store this safely!
📈 Pro Features (Uptime & Log Export)
Veyra automatically tracks incidents and calculates SLA Uptime.

TypeScript
// Fetch 30-Day SLA Uptime stats
const uptime = await veyra.projects.uptime(projectId);
console.log(`Current SLA: ${uptime.uptimeSLA}`);
console.log(`Total Downtime: ${uptime.downtimeSeconds} seconds`);

// Export all logs as a CSV file
const csvData = await veyra.projects.exportCsv(projectId);
fs.writeFileSync("./veyra_logs.csv", csvData);
📚 API Reference
Account & Auth
veyra.auth.register(email, password)

veyra.auth.login(email, password)

Project Management (Requires JWT)
veyra.projects.list()

veyra.projects.create(data)

veyra.projects.update(projectId, data)

veyra.projects.delete(projectId)

veyra.projects.uptime(projectId)

veyra.projects.exportCsv(projectId)

API Keys
veyra.projects.keys.list(projectId)

veyra.projects.keys.create(projectId, name)

veyra.projects.keys.revoke(projectId, keyId)

Telemetry (Requires API Key)
veyra.events.create(payload)

veyra.events.list(queryFilters)

veyra.events.metrics()

veyra.heartbeats.send(projectId)

veyra.incidents.create(payload)

veyra.incidents.resolve(incidentId)

License
MIT
