import { Client, GatewayIntentBits } from "discord.js";
import { Veyra } from "@veyradev/sdk";
import "dotenv/config";

// 1. Initialize Veyra using the API Key (Not the JWT)
const veyra = new Veyra({ token: process.env.VEYRA_API_KEY });
const PROJECT_ID = process.env.VEYRA_PROJECT_ID!;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user?.tag}!`);

  // 2. Start the Heartbeat Monitor (Pings Veyra every 60 seconds)
  setInterval(async () => {
    try {
      await veyra.heartbeats.send(PROJECT_ID);
    } catch (err) {
      console.error("Failed to send heartbeat to Veyra:", err);
    }
  }, 60 * 1000);

  // 3. Log a successful startup event
  await veyra.events.create({
    level: "info",
    source: "Bot-Core",
    environment: "production",
    message: `Bot successfully started and connected to Discord as ${client.user?.tag}`
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    // 4. Log command usage for analytics
    await veyra.events.create({
      level: "debug",
      source: "Command-Handler",
      message: `User ${interaction.user.tag} ran command: /${interaction.commandName}`,
      metadata: { userId: interaction.user.id, channelId: interaction.channelId }
    });

    await interaction.reply("Command executed successfully!");
  } catch (error: any) {
    // 5. Log command failures automatically
    await veyra.events.create({
      level: "error",
      source: "Command-Handler",
      message: `Failed to execute /${interaction.commandName}: ${error.message}`
    });
  }
});

// 6. Catch fatal process crashes
process.on("unhandledRejection", async (error: Error) => {
  await veyra.events.create({
    level: "fatal",
    source: "Process",
    message: `Unhandled Promise Rejection: ${error.message}`
  });
  process.exit(1);
});

client.login(process.env.DISCORD_TOKEN);
