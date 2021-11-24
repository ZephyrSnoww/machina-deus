const defaults = require("./defaults");

module.exports = {
    async validateSubcommands(client, message, data) {
        const input = message.content.toLowerCase().split(" ");
        let validSubcommands = [];
        let validSubcommandNames = [];

        data.subcommands.forEach((subcommand) => {
            let arguments = [];
            subcommand.arguments.forEach((argument) => {
                if (argument.required) {
                    arguments.push(`<${argument.name}>`);
                }
                else {
                    arguments.push(`[${argument.name}]`);
                }
            });

            validSubcommands.push(`**${client.config.prefix}${data.name} ${subcommand.name}** ${arguments.join(" ")} - ${subcommand.description}`);
            validSubcommandNames.push(subcommand.name);
        });

        // If they didnt give a subcommand
        if (input.length < 2) {
            const embed = defaults.createErrorEmbed("400", "You must include a subcommand.", "subcommand", validSubcommands);
            message.reply({ embeds: [embed] });
            return false;
        }

        const subcommand = input[1];

        // If they gave an invalid subcommand
        if (!validSubcommandNames.includes(subcommand)) {
            const embed = defaults.createErrorEmbed("400", "You must include a valid subcommand.", "subcommand", validSubcommands);
            message.reply({ embeds: [embed] });
            return false;
        }

        return true;
    },

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

                        // Add the argument to the name array
                        // validArgumentNames.push(subcommandArgument.name);
                        // validArgumentText.push(`${subcommandArgument.name} (${subcommandArgument.required ? "required" : "not required"})`);
                    });
                    
                    // Add the subcommand help string and name
                    validSubcommandStrings.push(`**${client.config.prefix}${data.name} ${subcommand.name}** ${validArgumentStrings.join(" ")} - ${subcommand.description}`);
                    validSubcommandNames.push(subcommand.name);
                });

                // If they didnt give any subcommand, error
                if (input.length === 1) {
                    valid = false;
                    errorMessage = "You must include a subcommand.";
                    validOptionsType = "subcommand";
                    validOptions = validSubcommandStrings;
                    break;
                }

                // If they didnt give a valid subcommand, error
                if (!validSubcommandNames.includes(input[1])) {
                    valid = false;
                    errorMessage = "You must include a valid subcommand.";
                    validOptionsType = "subcommand";
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
            else if (argument.type === "int") {
                if (Number(input[i + (subcommand ? 2 : 1)]) === NaN) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be an integer.`;
                    break;
                }
            }
            // If its a url, check for "http" at the beginning of the string - error if its not there
            else if (argument.type === "url") {
                if (!input[i + (subcommand ? 2 : 1)].startsWith("http")) {
                    valid = false;
                    errorMessage = `The \`${argument.name}\` argument must be a URL.`;
                    break;
                }
            }
            // If its a hex
            else if (argument.type === "hex") {
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
            // If its a time
            // If its a user
            // If its a channel
            // If its a voice channel
            // If its a role
        };

        // // --- Subcommand Validation --- //
        // // If the command requires a subcommand and the user didnt give one
        // if (input.length === 1 && subcommand) {
        //     valid = false;
        //     errorMessage = "You must include a subcommand.";
        //     validOptionsType = "subcommand";
        //     validOptions = validSubcommandStrings;
        // }

        // // If the user gave an invalid subcommand
        // if ((!validSubcommandNames.includes(input[1])) && subcommand) {
        //     valid = false;
        //     errorMessage = "You must include a valid subcommand.";
        //     validOptionsType = "subcommand";
        //     validOptions = validSubcommandStrings;
        // }

        // // If the user gave a valid subcommand but no arguments
        // if (input.length === 2 && subcommand) {
        //     valid = false;
        //     errorMessage = "You must include arguments for the subcommand.";
        //     validOptions = "arguments";
        //     validOptions = validArgumentText;
        // }

        // --- Argument Validation --- //
        // If the command requires arguments but the user gave none

        // If the user gave some required arguments, but not all

        // If the user gave all required arguments, but incorrect types

        
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