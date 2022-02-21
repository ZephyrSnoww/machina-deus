import { MessageEmbed } from "discord.js";

function createEmbed({
    title,
    description,
    color = 0x0,
    url = null,
    author = null,
    thumbnail = null,
    fields = [],
    image = null,
    footer = null,
    timestamp = true
}) {
    // Make the embed
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setURL(url)
        .setThumbnail(thumbnail)
        .setImage(image);

    if (timestamp) {
        embed.setTimestamp();
    }
    
    // Set author if one is given
    if (author) {
        if (typeof(author) === "object") {
            embed.setAuthor(author.username, author.avatarURL());
        }
        else {
            embed.setAuthor(author[0], author[1]);
        }
    }

    // Set fields if any are given
    if (fields.length !== 0) {
        for (let i = 0; i < fields.length; i++) {
            embed.addField(
                fields[i].name,
                fields[i].value,
                fields[i].inline === undefined ? false : fields[i].inline
            );
        }
    }

    // Set footer if one is given
    if (footer) {
        embed.setFooter(footer.text, footer.image);
    }

    return embed;
}

export { createEmbed };