const defaults = require("./defaults");

module.exports = {
    async validateCommand(client, message, data, subcommand=false) {
        const input = message.content.toLowerCase().split(" ");
        
        // Variables for argument validation
        let validArgumentStrings = [];
        let validArgumentNames = [];
        let validArgumentText = [];

        // Variables for error throwing
        let valid = true;
        let errorMessage = "";
        let validOptionsType = "";
        let validOptions = null;

        // For each argument in the command
        for (let i = 0; i < data.arguments.length; i++) {
            let argument = data.arguments[i];

            // If the argument is a subcommand
            if (argument.name === "subcommand") {
                let validSubcommandStrings = [];
                let validSubcommandNames = [];

                // Iterate through all valid subcommands
                argument.subcommands.forEach((subcommand) => {
                    validArgumentStrings = [];
                    validArgumentNames = [];

                    // // Iterate through all of the subcommands arguments
                    subcommand.arguments.forEach((subcommandArgument) => {
                        // Add the argument to the help array
                        if (subcommandArgument.required) {
                            validArgumentStrings.push(`<${subcommandArgument.name}>`);
                        }
                        else {
                            validArgumentStrings.push(`[${subcommandArgument.name}]`);
                        }
                    });
                    
                    // Add the subcommand help string and name
                    validSubcommandStrings.push(`**${client.config.prefix}${data.name} ${subcommand.name}** ${validArgumentStrings.join(" ")} - ${subcommand.description}`);
                    validSubcommandNames.push(subcommand.name);
                });

                // If they didnt give any subcommand, error
                if (input.length === 1) {
                    valid = false;
                    errorMessage = "You must include a subcommand.";
                    validOptionsType = "Subcommands";
                    validOptions = validSubcommandStrings;
                    break;
                }

                // If they didnt give a valid subcommand, error
                if (!validSubcommandNames.includes(input[1])) {
                    valid = false;
                    errorMessage = "You must include a valid subcommand.";
                    validOptionsType = "Subcommands";
                    validOptions = validSubcommandStrings;
                    break;
                }

                // Grab the subcommands data
                let subcommandObject = argument.subcommands.filter(subcommand => subcommand.name === input[1])[0];

                // Do this function but on the subcommand instead of the root command
                return await this.validateCommand(client, message, subcommandObject, true);
            }

            // If the argument is... an argument
            // Add it to the list of arguments
            if (argument.required) {
                validArgumentStrings.push(`<${argument.name}>`);
            }
            else {
                validArgumentStrings.push(`[${argument.name}]`);
            }

            validArgumentNames.push(argument.name);

            // Validate the argument
            if (argument.required) {
                if (i >= (input.length - (subcommand ? 2 : 1))) {
                    valid = false;
                    errorMessage = `You must include the \`${argument.name}\` argument.`;
                    break;
                }
            }

            // Validate argument types
            // If its a string, itll almost always just be fine
            if (argument.type === "string") {
                continue;
            }
            // If its an int, try to convert it - error if the conversion fails
            else if (argument.type === "int" && input[i + (subcommand ? 2 : 1)]) {
                if (Number(input[i + (subcommand ? 2 : 1)]) === NaN) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be an integer.`;
                    break;
                }
            }
            // If its a url, check for "http" at the beginning of the string - error if its not there
            else if (argument.type === "url" && input[i + (subcommand ? 2 : 1)]) {
                if (!input[i + (subcommand ? 2 : 1)].startsWith("http")) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a URL.`;
                    break;
                }
            }
            // If its a hex
            else if (argument.type === "hex" && input[i + (subcommand ? 2 : 1)]) {
                let color;

                // Check for a hashtag at the beginning of the string (remove it if it exists)
                if (input[i + (subcommand ? 2 : 1)].startsWith("#")) {
                    color = input[i + (subcommand ? 2 : 1)].substring(1);
                }
                else {
                    color = input[i + (subcommand ? 2 : 1)];
                }

                // Check if its the correct length (6) and can be converted into a number via 0x000000 formatting - error if either is false
                if (!(color.length === 6 && !isNaN(Number("0x" + color)))) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a hex color code.`;
                    break;
                }
            }
            // If its an emoji
            else if (argument.type === "emoji" && input[i + (subcommand ? 2 : 1)]) {
                const unicodeEmojiMatch = /\p{Extended_Pictographic}/u;
                const discordEmojiMatch = /<:(\S+):(\d+)>/;

                if (!(unicodeEmojiMatch.test(input[i + (subcommand ? 2 : 1)]) || discordEmojiMatch.test(input[i + (subcommand ? 2 : 1)]))) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be an emoji.`;
                    break;
                }
            }
            // If its a time
            else if (argument.type === "time" && input[i + (subcommand ? 2 : 1)]) {
                const validTimeOptions = [
                    "1 (1 hour)",
                    "12 (12 hours)",
                    "00:12 (12 minutes)",
                    "12:34 (12 hours, 34 minutes)",
                    "12:34:56 (12 hours, 34 minutes, 56 seconds)",
                    "00:00:12 (12 seconds)"
                ];

                const argumentInput =  input[i + (subcommand ? 2 : 1)];
                const splitInput = argumentInput.split(":");

                if (splitInput.length === 1) {
                    if (isNaN(Number(splitInput[0]))) {
                        valid = false;
                        errorMessage = `The \`${argument.name}\` argument must be a valid time.`;
                        validOptionsType = "Time Formats";
                        validOptions = validTimeOptions;
                        break;
                    }
                }

                if (splitInput.length > 3) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a valid time.`;
                    validOptionsType = "Time Formats";
                    validOptions = validTimeOptions;
                    break;
                }

                for (let x = 0; x < splitInput.length; x++) {
                    let number = splitInput[x];
                    if (isNaN(Number(number))) {
                        valid = false;
                        errorMessage = `The \`${argument.name}\` argument must be a valid time.`;
                        validOptionsType = "Time Formats";
                        validOptions = validTimeOptions;
                        break;
                    }
                }

                if (!valid) {
                    break;
                }
            }
            // If its a user
            else if (argument.type === "user" && input[i + (subcommand ? 2 : 1)]) {
                if (!/<@!(\d+)>/.test(input[i + (subcommand ? 2 : 1)])) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a user, in the form of a mention.`;
                    break;
                }
            }
            // If its a channel
            else if (argument.type === "channel" && input[i + (subcommand ? 2 : 1)]) {
                if (!/<#(\d+)>/.test(input[i + (subcommand ? 2 : 1)])) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a channel, in the form of a mention.`;
                    break;
                }
            }
            // If its a voice channel
            else if (argument.type === "voice channel" && input[i + (subcommand ? 2 : 1)]) {
                const voiceChannels = message.guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE");
                if (voiceChannels.filter(channel => channel.name.toLowerCase() === input[i + (subcommand ? 2 : 1)].replace("-", " ")).size === 0) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a voice channel name, with "-" instead of spaces.`;
                    break;
                }
            }
            // If its a role
            else if (argument.type === "role" && input[i + (subcommand ? 2 : 1)]) {
                if (!/<@&(\d+)>/.test(input[i + (subcommand ? 2 : 1)])) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a role, in the form of a mention.`;
                    break;
                }
            }
        };

        // If the command is invalid, give an error and return false
        if (!valid) {
            const embed = defaults.createErrorEmbed("400", errorMessage, validOptionsType, validOptions);
            message.reply({ embeds: [embed] });
            return false;
        }

        // Otherwise (command is valid) return true
        return true;
    }
};