const defaults = require("../helpers/defaults");

module.exports = {
    data: {
        name: "vote",
        description: "Create a simple vote.",
        arguments: [
            {
                name: "description",
                required: true,
                type: "string"
            }
        ]
    },

    async execute(client, message) {
        const embed = defaults.createDefaultEmbed(
            `${message.author.username} Started a Vote`,
            message.content.substring(client.config.prefix.length + this.data.name.length)
        );

        const reply = await message.reply({ embeds: [embed] });

        await reply.react("yes:910737740377759774");
        await reply.react("no:910737778386534460");

        console.info(`${message.author.username} started a simple vote.`);
    }
};