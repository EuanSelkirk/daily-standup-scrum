const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Standup = require("../models/standup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("am")
    .setDescription("Add a member to the standup")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add to the standup")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const guildId = interaction.guildId;

    if (!guildId) {
      return interaction.reply({
        content: "❌ This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
    }

    let standup = await Standup.findOne({ guildId });
    if (!standup) {
      return interaction.reply({
        content: "❌ No standup data found for this server.",
        flags: MessageFlags.Ephemeral,
      });
    }

    if (standup.members.includes(user.id)) {
      return interaction.reply({
        content: "⚠️ This user is already part of the standup.",
        flags: MessageFlags.Ephemeral,
      });
    }

    standup.members.push(user.id);
    await standup.save();

    return interaction.reply({
      content: `✅ Added <@${user.id}> to the standup.`,
    });
  },
};
