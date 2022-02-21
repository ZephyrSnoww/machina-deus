const { MessageEmbed } = require("discord.js");

module.exports = {
    data: {
        errorTypes: {
            200: "200 OK",
            400: "400 Bad Request",
            403: "403 Forbidden",
            404: "404 Not Found",
            500: "500 Internal Server Error"
        }
    },

    createDefaultEmbed(title, description) {
        const _embed = new MessageEmbed()
            .setColor("#909090")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        return _embed;
    },

    createErrorEmbed(error, description, optionType="Subcommands", validOptions=null) {
        if (!(Object.keys(this.data.errorTypes).includes(error))) {
            throw Error("A valid error value must be given");
        }

        const _embed = this.createDefaultEmbed(this.data.errorTypes[error], description);

        if (validOptions) {
            _embed.addField(`Valid ${optionType}`, validOptions.join("\n"));
        }

        return _embed;
    }
};