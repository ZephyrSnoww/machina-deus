const { MessageEmbed } = require("discord.js");

module.exports = {
    createDefaultEmbed(title, description) {
        const _embed = new MessageEmbed()
            .setColor("#909090")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        return _embed;
    }
};