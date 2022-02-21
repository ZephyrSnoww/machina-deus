const defaults = require("../helpers/defaults");

module.exports = {
    data: {
        name: "help",
        description: "List all Machina Deus commands.",
        arguments: []
    },

    async execute(client, message) {
        const commands = client.commands;
        const prefix = client.config.prefix;

        let output = [];

        commands.forEach((command, commandName) => {
            let arguments = [];
            command.data.arguments.forEach((argument) => {
                if (argument.required || argument.name === "subcommand") {
                    arguments.push(`<${argument.name}>`);
                }
                else {
                    arguments.push(`[${argument.name}]`);
                }
            });

            output.push(`**${prefix}${commandName}** ${arguments.join(" ")} - ${command.data.description}`);
        });

        const embed = defaults.createDefaultEmbed("Machine Deus Commands", output.join("\n"));

        console.info(`${message.author.username} listed commands.`);
        message.reply({ embeds: [embed] });
    }
};