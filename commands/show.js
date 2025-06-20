const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("Show today's standup prompt (DM only)"),

  async execute(interaction) {
    if (interaction.channel.type !== 1) {
      return interaction.reply({
        content: "📪 Please use this command in a **DM with the bot**.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const prompt =
      `📝 **Today's Questions**\n` +
      `1. What did you do yesterday?\n` +
      `2. What will you do today?\n` +
      `3. Any blockers?`;

    await interaction.reply({
      content: prompt,
      flags: MessageFlags.Ephemeral,
    });
  },
};
