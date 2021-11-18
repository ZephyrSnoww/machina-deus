const { createDefaultEmbed } = require("../helpers/defaults");

module.exports = {
    data: {
        name: "id",
        arguments: "",
        description: "Your server ID.",
        subcommands: [
            {
                name: "create",
                arguments: "",
                description: "Create your ID."
            },
            {
                name: "edit",
                arguments: "",
                description: "Update your ID."
            },
            {
                name: "delete",
                arguments: "",
                description: "Delete your ID."
            }
        ]
    },

    async execute(client, message) {
        const input = message.content.split(" ");

        if (input.length < 2) {
            let valid_subcommands = [];

            this.data.subcommands.forEach(subcommand => {
                valid_subcommands.push(`**${client.config.prefix}${this.data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", valid_subcommands.join("\n"));

            return message.reply({ embeds: [embed] });
        }

        const subcommand = input[1];

        if (subcommand == "create") {
            let embed = createDefaultEmbed(`Createing an ID for ${message.author.username}`, `Enter desired name.`);
            let reply = await message.reply({ embeds: [embed] });
        }
    }
}