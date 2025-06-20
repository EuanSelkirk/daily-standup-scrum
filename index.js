require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");

const mongoose = require("mongoose");
const { startDailyStandup } = require("./utils/scheduler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.data?.name || command.name, command);
}

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  startDailyStandup(client);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("Oops! Something went wrong.");
  }
});

client.on("interactionCreate", async (interaction) => {
  // Only handle slash (chat input) commands
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(
      `❌ Error executing command "${interaction.commandName}":`,
      err
    );

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ There was an error while executing this command.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      const { MessageFlags } = require("discord.js");

      await interaction.reply({
        content: "❌ There was an error executing this command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("📦 Connected to MongoDB");
    client.login(process.env.DISCORD_TOKEN);
  })
  .catch((err) => console.error("MongoDB connection error", err));
