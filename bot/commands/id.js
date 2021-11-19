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
            let validSubcommands = [];

            this.data.subcommands.forEach((subcommand) => {
                validSubcommands.push(`**${client.config.prefix}${this.data.name} ${subcommand.name}** ${subcommand.arguments} - ${subcommand.description}`);
            });

            const embed = createDefaultEmbed("400 Bad Request", "You must include a subcommand.");
            embed.addField("Valid Subcommands", validSubcommands.join("\n"));

            return message.reply({ embeds: [embed] });
        }

        const subcommand = input[1];

        if (subcommand === "create") {
            const ids = {
                name: null,
                race: null,
                dob: null,
                height: null,
                weight: null,
            };

            let embed = createDefaultEmbed(`Createing an ID for ${message.author.username}`, "Enter desired name.");
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