import { SlashCommandBuilder } from "@discordjs/builders";
import { createEmbed } from "../helpers/createEmbed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Start a generic vote.")
        .addStringOption(option => option
            .setName("topic")
            .setDescription("The topic of the vote")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("anonymous")
            .setDescription("Whether the vote author should be kept anonymous.")
            .setRequired(false)),

    async execute(interaction) {
        const voteTopic = interaction.options.getString("topic");
        const voteIsAnonymous = interaction.options.getBoolean("anonymous") || false;

        let embed = createEmbed({
            title: `A vote ${voteIsAnonymous ? "" : `by ${interaction.user.username}`}`,
            description: `${voteTopic}?`,
            author: voteIsAnonymous ? null : interaction.user
        });

        if (voteIsAnonymous) {
            interaction.channel.send({
                embeds: [ embed ]
            });
        }
        else {
            interaction.reply({
                embeds: [ embed ]
            });
        }

        return console.info(`${(voteIsAnonymous) ? ("A user") : (interaction.user.username)} started a vote`);
    }
}
