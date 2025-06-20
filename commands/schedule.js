const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");
const schedule = require("node-cron");
const { updateScheduler } = require("../utils/scheduler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Set the daily standup time (24h format)")
    .addIntegerOption((option) =>
      option
        .setName("hour")
        .setDescription("Hour of the day (0–23)")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("minute").setDescription("Minute (0–59)").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const hour = interaction.options.getInteger("hour");
    const minute = interaction.options.getInteger("minute");

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return interaction.reply({
        content: "❌ Invalid time. Use a 24-hour clock format.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const cronTime = `${minute} ${hour} * * *`;

    try {
      updateScheduler(cronTime, interaction.client);
      await interaction.reply({
        content: `✅ Daily standup rescheduled to ${hour
          .toString()
          .padStart(2, "0")}:${minute.toString().padStart(2, "0")}!`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Failed to update the scheduler.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
