const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Standup = require("../models/standup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rm")
    .setDescription("Remove a user from the standup")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to remove").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    try {
      const standup = await Standup.findOne({
        guildId: interaction.guildId ?? "dm",
      });

      if (!standup || !standup.members.includes(user.id)) {
        return interaction.reply({
          content: `🚫 ${user.username} is not part of the standup.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      standup.members = standup.members.filter((id) => id !== user.id);
      await standup.save();

      return interaction.reply({
        content: `🗑️ Removed ${user.username} from the standup.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: `❌ Failed to remove user.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
