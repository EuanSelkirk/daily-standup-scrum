const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all available commands"),

  async execute(interaction) {
    const commands = interaction.client.commands;

    const commandList = commands
      .filter((cmd) => cmd.data)
      .map((cmd) => {
        const name = `/${cmd.data.name}`;
        const description = cmd.data.description || "*No description*";
        return `• **${name}** – ${description}`;
      })
      .join("\n");

    await interaction.reply({
      content: `📖 **Here are my available commands:**\n\n${commandList}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
