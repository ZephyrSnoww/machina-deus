const defaults = require("../helpers/defaults");
const helpers = require("../helpers/helpers");

module.exports = {
    data: {
        name: "id",
        description: "Your server ID.",
        arguments: [
            {
                name: "subcommand",
                subcommands: [
                    {
                        name: "create",
                        description: "Create your ID.",
                        arguments: []
                    },
                    {
                        name: "edit",
                        description: "Update your ID.",
                        arguments: []
                    },
                    {
                        name: "delete",
                        description: "Delete your ID.",
                        arguments: []
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

        if (subcommand === "create") {
            const ids = {
                name: null,
                race: null,
                dob: null,
                height: null,
                weight: null,
            };

            let embed = defaults.createDefaultEmbed(`Createing an ID for ${message.author.username}`, "Enter desired name.");
            let reply = await message.reply({ embeds: [embed] });
            const filter = (m) => m.author.id === message.author.id;
            const collector = reply.channel.createMessageCollector(filter, {
                time: 60000,
            });
            collector.on("collect", async (msg) => {
                
            });
        }
    }
};