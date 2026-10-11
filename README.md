# JavaScript (CommonJS) Examples for Veyra

This folder contains standard Node.js (JavaScript) examples demonstrating how to integrate the `@veyradev/sdk` into your applications without TypeScript.

## 📂 Available Examples

1. **`discord-bot.js`**: A Discord.js v14 bot that tracks command usage, logs fatal crashes, and sends a heartbeat ping every 60 seconds.
2. **`express-api.js`**: An Express.js backend that uses Veyra as global middleware to log all HTTP requests and catch 500 Internal Server errors.

## 🚀 How to run

1. Install the required dependencies:
   ```bash
   npm install @veyradev/sdk dotenv discord.js express
   ```
2. Create a `.env` file in this directory with your Veyra credentials:
   ```env
   # Your Veyra API Connection
   VEYRA_API_KEY=veyra_your_api_key_here
   VEYRA_PROJECT_ID=your_project_id_here
   VEYRA_BASE_URL=[https://api.strixhost.xyz](https://api.strixhost.xyz)

   # Only needed if running the bot example
   DISCORD_TOKEN=your_discord_bot_token 
   ```
3. Run the example using Node:
   ```bash
   node discord-bot.js
   ```
