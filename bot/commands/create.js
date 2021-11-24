const defaults = require("../helpers/defaults");
const helpers = require("../helpers/helpers");

module.exports = {
    data: {
        name: "create",
        description: "Create something.",
        arguments: [
            {
                name: "subcommand",
                subcommands: [
                    {
                        name: "channel",
                        description: "Create a channel.",
                        arguments: [
                            {
                                name: "name",
                                required: true,
                                type: "string"
                            }
                        ]
                    },
                    {
                        name: "voice-channel",
                        description: "Create a voice channel.",
                        arguments: [
                            {
                                name: "name",
                                required: true,
                                type: "string"
                            }
                        ]
                    },
                    {
                        name: "emoji",
                        description: "Create an emoji. Must attach an image or provide a URL.",
                        arguments: [
                            {
                                name: "name",
                                required: true,
                                type: "string"
                            },
                            {
                                name: "image url",
                                required: false,
                                type: "url"
                            }
                        ]
                    },
                    {
                        name: "role",
                        description: "Create a role.",
                        arguments: [
                            {
                                name: "name",
                                required: true,
                                type: "string"
                            },
                            {
                                name: "color",
                                required: false,
                                type: "hex"
                            }
                        ]
                    },
                    {
                        name: "category",
                        description: "Create a category.",
                        arguments: [
                            {
                                name: "name",
                                required: true,
                                type: "string"
                            }
                        ]
                    }
                ]
            }
        ]
    },

    async execute(client, message) {
        const validCommand = await helpers.validateCommand(client, message, this.data);
        if (!validCommand) { return; }
        
        const input = message.content.split(" ");
        const subcommand = input[1];
        const name = input[2];

        const embed = defaults.createDefaultEmbed(`${message.author.username} wants to create a ${subcommand}`, `**Name:** ${name}`);
        message.reply({ embeds: [embed] });
        console.info(`${message.author.username} started a vote to create a${subcommand.startsWith("e") ? "n" : ""} ${subcommand}.`);
    }
};