const { Client, GatewayIntentBits } = require("discord.js");
const { Veyra } = require("@veyradev/sdk");
require("dotenv").config();

const veyra = new Veyra({ token: process.env.VEYRA_API_KEY });
const PROJECT_ID = process.env.VEYRA_PROJECT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    try {
      await veyra.heartbeats.send(PROJECT_ID);
    } catch (err) {
      console.error("Failed to send heartbeat to Veyra:", err);
    }
  }, 60 * 1000);

  await veyra.events.create({
    level: "info",
    source: "Bot-Core",
    environment: "production",
    message: `Bot successfully started and connected to Discord as ${client.user.tag}`
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await veyra.events.create({
      level: "debug",
      source: "Command-Handler",
      message: `User ${interaction.user.tag} ran command: /${interaction.commandName}`,
      metadata: { userId: interaction.user.id }
    });
    await interaction.reply("Command executed successfully!");
  } catch (error) {
    await veyra.events.create({
      level: "error",
      source: "Command-Handler",
      message: `Failed to execute /${interaction.commandName}: ${error.message}`
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
