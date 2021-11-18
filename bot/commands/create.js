const { createDefaultEmbed } = require("../helpers/defaults");

module.exports = {
    data: {
        name: "create",
        arguments: "<subcommand> <name> [<extras>]",
        description: "Create something.",
        subcommands: [
            {
                name: "channel",
                arguments: "<name>",
                description: "Create a channel.",
                async execute(message, name) {

                }
            },
            {
                name: "voice-channel",
                arguments: "<name>",
                description: "Create a voice channel."
            },
            {
                name: "emoji",
                arguments: "<name> [<image url>]",
                description: "Create an emoji. Must attach an image or provide a URL."
            },
            {
                name: "role",
                arguments: "<name> [<color>]",
                description: "Create a role."
            },
            {
                name: "category",
                arguments: "<name>",
                description: "Create a category."
            }
        ]
    },

    async execute(client, message) {
        const input = message.content.substring(client.config.prefix.length).split(" ");

        if (input.length < 2) {
            let valid_subcommands = [];

            this.data.subcommands.forEach(subcommand => {
                valid_subcommands.push(`**${client.config.prefix}${this.data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", valid_subcommands.join("\n"));

            return message.reply({ embeds: [embed] });
        }

        if (input.length < 3) {
            const embed = createDefaultEmbed("400 Bad Request", `You must include a <name> for the ${subcommand,replace("-", " ")}.`);
            return message.reply({ embeds: [embed] });
        }

        const command = input[0];
        const subcommand = input[1];
        const name = input[2];

        if (subcommand == "emoji") {
            if (input.length < 4) {
                const image_url = message.attachments[0].url;
            }
            else {
                const image_url = input[3];
            }
        }

        const embed = createDefaultEmbed(`${message.author.username} wants to create a ${subcommand}`, `**Name:** ${name}`);
        message.reply({ embeds: [embed] });
        console.info(`${message.author.username} started a vote to create a${subcommand.startsWith("e") ? "n" : ""} ${subcommand}.`);
    }
}