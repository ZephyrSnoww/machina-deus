const { createDefaultEmbed } = require("./defaults");

module.exports = {
    async validateSubcommands(client, message, data) {
        const input = message.content.split(" ");

        if (input.length < 2) {
            let valid_subcommands = [];

            data.subcommands.forEach(subcommand => {
                valid_subcommands.push(`**${client.config.prefix}${data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", valid_subcommands.join("\n"));

            message.reply({ embeds: [embed] });
            return false;
        }
    }
}