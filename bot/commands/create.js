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
        // Grab the users input message
        const input = message.content.split(" ");

        // If the input only has the command in it
        if (input.length < 2) {
            // Grab all subcommands
            let valid_subcommands = [];

            this.data.subcommands.forEach(subcommand => {
                valid_subcommands.push(`**${client.config.prefix}${this.data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            // Create an embed
            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", valid_subcommands.join("\n"));

            // Give the user an error
            return message.reply({ embeds: [embed] });
        }

        // Get the subcommand the user did
        const subcommand = input[1];

        // If the input only had a command and subcommand
        if (input.length < 3) {
            // Create an error embed and send it to the user
            const embed = createDefaultEmbed("400 Bad Request", `You must include a name for the ${subcommand.replace("-", " ")}.`);
            return message.reply({ embeds: [embed] });
        }

        // Grab the name the user gave
        const name = input[2];

        // If the user is creating an emoji
        if (subcommand == "emoji") {
            // If an image wasnt given
            if (input.length < 4) {
                // If the message has no attachments
                if (message.attachments.size == 0) {
                    // Create an error embed and send it to the user
                    const embed = createDefaultEmbed("400 Bad Request", `You must include an image for the emoji, either as an attachment or as a URL.`);
                    return message.reply({ embeds: [embed] });
                }

                // Grab the url of the attached image
                const image_url = message.attachments[0].url;
            }
            // Otherwise, just give the url they gave
            else {
                const image_url = input[3];
            }
        }

        // If the user is creating a role
        if (subcommand == "role") {
            // If a color wasnt given, just set color to null
            if (input.length < 4) {
                const color = null;
            }
            // Otherwise, grab the color they gave
            else {
                const color = input[3];
            }
        }

        const embed = createDefaultEmbed(`${message.author.username} wants to create a ${subcommand}`, `**Name:** ${name}`);
        message.reply({ embeds: [embed] });
        console.info(`${message.author.username} started a vote to create a${subcommand.startsWith("e") ? "n" : ""} ${subcommand}.`);
    }
}