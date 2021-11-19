const { createDefaultEmbed } = require("../helpers/defaults");

module.exports = {
    data: {
        name: "help",
        arguments: "",
        description: "List all Machina Deus commands."
    },

    async execute(client, message) {
        const commands = client.commands;
        const prefix = client.config.prefix;

        let output = [];

        commands.forEach((command, commandName) => {
            output.push(`**${prefix}${commandName}** ${command.data.arguments} - ${command.data.description}`);
        });

        const embed = createDefaultEmbed("Machine Deus Commands", output.join("\n"));

        console.info(`${message.author.username} listed commands.`);
        message.reply({ embeds: [embed] });
    }
};