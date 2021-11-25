const defaults = require("../helpers/defaults");
const helpers = require("../helpers/helpers");

module.exports = {
    data: {
        name: "test",
        description: "Dev test command.",
        arguments: [
            {
                name: "role",
                required: false,
                type: "role"
            }
        ]
    },

    async execute(client, message) {
        const validCommand = await helpers.validateCommand(client, message, this.data);
        if (!validCommand) { return; }
        
        const input = message.content.split(" ");

        const embed = defaults.createDefaultEmbed(`${message.author.username} did something`, `This is a placeholder command.`);
        message.reply({ embeds: [embed] });
        console.info(`${message.author.username} did something.`);
    }
};