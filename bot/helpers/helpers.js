const defaults = require("./defaults");

module.exports = {
    async validateSubcommands(client, message, data) {
        const input = message.content.split(" ");
        let validSubcommands = [];
        let validSubcommandNames = [];

        data.subcommands.forEach((subcommand) => {
            let arguments = [];
            subcommand.arguments.forEach((argument) => {
                if (argument.required) {
                    arguments.push(`<${argument.name}>`);
                }
                else {
                    arguments.push(`[${argument.name}]`);
                }
            });

            validSubcommands.push(`**${client.config.prefix}${data.name} ${subcommand.name}** ${arguments.join(" ")} - ${subcommand.description}`);
            validSubcommandNames.push(subcommand.name);
        });

        // If they didnt give a subcommand
        if (input.length < 2) {
            const embed = defaults.createErrorEmbed("400", "You must include a subcommand.", "subcommand", validSubcommands);
            message.reply({ embeds: [embed] });
            return false;
        }

        const subcommand = input[1];

        // If they gave an invalid subcommand
        if (!validSubcommandNames.includes(subcommand)) {
            const embed = defaults.createErrorEmbed("400", "You must include a valid subcommand.", "subcommand", validSubcommands);
            message.reply({ embeds: [embed] });
            return false;
        }

        return true;
    }
};