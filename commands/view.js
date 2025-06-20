const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Standup = require("../models/standup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view")
    .setDescription("View your current standup response (DM only)"),

  async execute(interaction) {
    if (interaction.channel.type !== 1) {
      return interaction.reply({
        content: "📪 Please use this command in a **DM with the bot**.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const userId = interaction.user.id;
    const standups = await Standup.find();

    for (const standup of standups) {
      if (standup.responses.has(userId)) {
        const response = standup.responses.get(userId);
        return interaction.reply({
          content: `📄 Here's your saved response:\n\n${response}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    return interaction.reply({
      content:
        "❌ You don't have a saved response yet. Try using `/reply` first!",
      flags: MessageFlags.Ephemeral,
    });
  },
};
