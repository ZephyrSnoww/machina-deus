const defaults = require("./defaults");

module.exports = {
    async validateSubcommands(client, message, data) {
        const input = message.content.split(" ");
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

    async validateCommand(client, message, data) {
        const input = message.content.split(" ");

        // !create channel blargh
        // 1       2       3
        // 0       1       2
        
        let requiredArguments = data.arguments.filter(argument => argument.required);
        let subcommand = false;

        let valid = true;
        let errorMessage = "";
        let validOptionsType = "";
        let validOptions = [];

        // For each argument in the command
        data.arguments.forEach((argmuent) => {
            // If the argument is a subcommand
            if (argument.type === "subcommand") {
                subcommand = true;

                let validSubcommandStrings = [];
                let validSubcommandNames = [];

                // Iterate through all valid subcommands
                argument.subcommands.forEach((subcommand) => {
                    let validArgumentStrings = [];
                    let validArgumentNames = [];

                    // Iterate through all of the subcommands arguments
                    subcommand.arguments.forEach((subcommandArgument) => {
                        // Add the argument to the help array
                        if (subcommandArgument.required) {
                            validArgumentStrings.push(`<${subcommandArgument.name}>`);
                        }
                        else {
                            validArgumentStrings.push(`[${subcommandArgument.name}]`);
                        }

                        // Add the argument to the name array
                        validArgumentNames.push(subcommandArgument.name);
                    });
                    
                    // Add the subcommand help string and name
                    validSubcommandStrings.push(`**${client.config.prefix}${data.name} ${subcommand.name}**`);
                    validSubcommandNames.push(subcommand.name);
                });

                break;
            }
        });

        // --- Subcommand Validation --- //
        // If the command requires a subcommand and the user didnt give one
        if (input.length === 1 && subcommand) {
            valid = false;
            errorMessage = "You must include a subcommand.";
            validOptionsType = "subcommand";
            validOptions = validSubcommandStrings;
        }

        // If the user gave an invalid subcommand

        // If the user gave a valid subcommand but no arguments
        if (input.length === 2 && subcommand) {
            valid = false;
            errorMessage = "You "
        }

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