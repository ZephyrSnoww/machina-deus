const { Client, Intents, Collection } = require("discord.js");

const fs = require("fs");

let config = require("../config.json");
const defaults = require("./helpers/defaults");

// ==================================================
// Create new discord client
// ==================================================
const client = new Client({ intents: Object.values(Intents.FLAGS) });

// ==================================================
// Get all command files
// Make a new commands collection
// ==================================================
let commandFiles = fs.readdirSync("./bot/commands").filter((file) => file.endsWith(".js"));
client.commands = new Collection();
client.config = config;

// ==================================================
// Iterate through command files
// Add them to the commands collection
// ==================================================
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// ==================================================
// Once the bot is logged into D*scord
// ==================================================
client.once("ready", () => {
    console.info("Machina Deus online.");
});

// ==================================================
// Handling commands
// ==================================================
client.on("messageCreate", async (message) => {
    // If the message doesn't start with the bots prefix, do nothing
    if (!message.content.startsWith(config.prefix)) { return; }

    const input = message.content.substring(config.prefix.length);
    const commandString = input.split(" ")[0];
    const command = client.commands.get(commandString);

    // If they're reloading the bot
    if (commandString === "reload") {
        // Reload config
        config = require("../config.json");
        client.config = config;

        // Reload commands
        commandFiles = fs.readdirSync("./bot/commands").filter((file) => file.endsWith(".js"));
        client.commands = new Collection();

        for (const file of commandFiles) {
            delete require.cache[require.resolve(`./commands/${file}`)];
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
        }

        // Reply
        console.info(`${message.author.username} reloaded Machina Deus.`);
        return message.reply("Config and commands reloaded successfully.");
    }

    // If the command doesn't exist, do nothing
    if (!command) { return; }

    try {
        // Try to execute the command
        await command.execute(client, message);
    } catch (error) {
        // Error if the command errors
        console.error(error);
        const embed = defaults.createErrorEmbed("500", "There was an error executing this command.")
        return message.reply({ embeds: [embed] });
    }
});

// ==================================================
// Log into the bot
// ==================================================
client.login(config.token);