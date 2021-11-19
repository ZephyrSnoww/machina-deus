const { createDefaultEmbed } = require("./defaults");

module.exports = {
    async validateSubcommands(client, message, data) {
        const input = message.content.split(" ");

        if (input.length < 2) {
            let validSubcommands = [];

            data.subcommands.forEach((subcommand) => {
                validSubcommands.push(`**${client.config.prefix}${data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", validSubcommands.join("\n"));

            message.reply({ embeds: [embed] });
            return false;
        }
    }
};