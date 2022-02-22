import { SlashCommandBuilder } from "@discordjs/builders";
import { createEmbed } from "../helpers/createEmbed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Make sure I'm alive."),

    async execute(interaction) {
        interaction.reply({
            embeds: [
                createEmbed({
                    title: "Pong",
                    description: "Here I am, and here you are.",
                    author: interaction.user
                })
            ]
        });

        return console.info(`${interaction.user.username} pinged Machina Deus`);
    }
}
