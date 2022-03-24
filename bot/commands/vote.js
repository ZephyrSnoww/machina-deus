import { SlashCommandBuilder } from "@discordjs/builders";
import { createEmbed } from "../helpers/createEmbed";
import users from "../data/users.json";
import roles from "../data/roles.json";

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
        // Get interaction options
        const voteTopic = interaction.options.getString("topic");
        const voteIsAnonymous = interaction.options.getBoolean("anonymous") || false;

        // Get the users data
        let userData = users.get(`${interaction.user.id}`);
        let canDoCommand = false;

        if (userData) {
            
        }

        // Create an embed
        let embed = createEmbed({
            title: `A vote ${voteIsAnonymous ? "" : `by ${interaction.user.username}`}`,
            description: `${voteTopic}?`,
            author: voteIsAnonymous ? null : interaction.user
        });

        // Send the embed, either as a reply or not
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
