module.exports = {
    data: {
        name: "ping",
        arguments: "",
        description: "Ping Machina Deus."
    },

    async execute(client, message) {
        await message.reply("Pong.");
        console.info(`${message.author.username} pinged Machina Deus.`);
    }
};