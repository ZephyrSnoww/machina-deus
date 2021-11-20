const { createDefaultEmbed } = require("../helpers/defaults");

module.exports = {
    data: {
        name: "create",
        description: "Create something.",
        arguments: [
            {
                name: "subcommand",
                required: true
            },
            {
                name: "name",
                required: true
            },
            {
                name: "extras",
                required: false
            }
        ],
        subcommands: [
            {
                name: "channel",
                description: "Create a channel.",
                arguments: [
                    {
                        name: "name",
                        required: true
                    }
                ]
            },
            {
                name: "voice-channel",
                description: "Create a voice channel.",
                arguments: [
                    {
                        name: "name",
                        required: true
                    }
                ]
            },
            {
                name: "emoji",
                description: "Create an emoji. Must attach an image or provide a URL.",
                arguments: [
                    {
                        name: "name",
                        required: true
                    },
                    {
                        name: "image url",
                        required: false
                    }
                ]
            },
            {
                name: "role",
                description: "Create a role.",
                arguments: [
                    {
                        name: "name",
                        required: true
                    },
                    {
                        name: "color",
                        required: false
                    }
                ]
            },
            {
                name: "category",
                description: "Create a category.",
                arguments: [
                    {
                        name: "name",
                        required: true
                    }
                ]
            }
        ]
    },

    async execute(client, message) {
        // Grab the users input message
        const input = message.content.split(" ");

        // If the input only has the command in it
        if (input.length < 2) {
            // Grab all subcommands
            let validSubcommands = [];

            this.data.subcommands.forEach((subcommand) => {
                validSubcommands.push(`**${client.config.prefix}${this.data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            // Create an embed
            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", validSubcommands.join("\n"));

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
        if (subcommand === "emoji") {
            // If an image wasnt given
            if (input.length < 4) {
                // If the message has no attachments
                if (message.attachments.size === 0) {
                    // Create an error embed and send it to the user
                    const embed = createDefaultEmbed("400 Bad Request", "You must include an image for the emoji, either as an attachment or as a URL.");
                    return message.reply({ embeds: [embed] });
                }

                // Grab the url of the attached image
                const imageURL = message.attachments[0].url;
            }
            // Otherwise, just give the url they gave
            else {
                const imageURL = input[3];
            }
        }

        // If the user is creating a role
        if (subcommand === "role") {
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
};