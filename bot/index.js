import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9"
import { Client, Collection, Intents } from "discord.js";
import fs from "fs";

import config from "../config.json";

// ==================== Basic bot setup ====================
// Create new discord client
const client = new Client({ intents: Object.values(Intents.FLAGS) });

// ========== Fetching commands ==========
// Get all command files
let commandFiles = fs.readdirSync("./bot/commands")
    .filter((file) => file.endsWith(".js"));

// Put all commands into a collection
client.commands = new Collection();
let commandData = [];

for (let file of commandFiles) {
    import command from `./commands/${file}`;
    client.commands.set(command.data.name, command);
    commandData.push(command.data.toJSON());
}

// ==================== Events ====================
// ========== When ready ==========
client.once("ready", () => {
    console.info("Machina Deus online");

    // Grab the client ID and make a new discord REST interface
    const clientID = client.user.id;
    const rest = new REST({ version: "9" }).setToken(config.token);

    (async () => {
        try {
            // Give discord our command data to register commands
            await rest.put(
                Routes.applicationGuildCommands(clientID, config.guildID),
                {
                    body: commandData
                }
            );

            // Log success
            console.info("Successfully registered application commands");
        } catch (error) {
            // Log failure
            if (error) { console.error(error); }
        }
    })();
});

// ========== Command interactions ==========
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) { return; }

    // Get the commands data
    let command = client.commands.get(interaction.commandName);

    // Make sure the command exists
    if (!command) { return; }

    // Try to execute the command
    try {
        await command.execute(interaction);
    }
    // If we get an error
    catch (error) {
        // Log it and tell the user something happened
        if (error) { console.error(error); }
        await interaction.reply({
            content: "Something broke when I tried to do that command."
        });
    }
});

// ==================== Log in ====================
client.login(config.token);