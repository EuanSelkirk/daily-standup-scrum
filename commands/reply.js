// commands/reply.js
const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const Standup = require("../models/standup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reply")
    .setDescription("Send your standup reply")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your standup response")
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const input = interaction.options.getString("message");

    const standup = await Standup.findOne({ members: userId });

    if (!standup) {
      return interaction.reply({
        content: "❌ You are not part of any standup.",
        flags: MessageFlags.Ephemeral,
      });
    }

    standup.responses.set(userId, input);
    await standup.save();

    const embed = new EmbedBuilder()
      .setTitle("✅ Standup Response Recorded!")
      .setColor("#00ff99")
      .addFields(
        {
          name: "Prompt",
          value:
            "**What did you do yesterday?**\n**What will you do today?**\n**Any blockers?**",
        },
        {
          name: "Your Response",
          value: input,
        }
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
