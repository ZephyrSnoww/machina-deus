module.exports = {
    data: {
        name: "ping",
        description: "Ping Machina Deus.",
        arguments: []
    },

    async execute(client, message) {
        await message.reply("Pong.");
        console.info(`${message.author.username} pinged Machina Deus.`);
    }
};