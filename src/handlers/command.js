const { readdir, readdirSync } = require("fs");
const { sep } = require("path");

module.exports = (client) => {
    var dir = `${process.cwd()}${sep}src${sep}commands`
    
    try {
        readdir(dir, (err, subDirs) => {
            if(err) throw err;
            
            subDirs.forEach(subDir => {
                dir = `${process.cwd()}${sep}src${sep}commands${sep}${subDir}`
                const commands = readdirSync(`${dir}`).filter(f => f.endsWith(".js")); // Filter the commands variable so it only includes files that end with ".js"
                
                for(const command of commands) {
                    dir = `${dir}${sep}${command}`
                    const cmd = require(`${process.cwd()}/src/commands/${subDir}/${command}`); // Require the command file

                    if(!cmd.run) throw new TypeError(`Command at ${dir} does not export a run function.`);
                    
                    if(cmd.help) { // Check if the command file exports a help object
                        if(!cmd.help.name) throw new TypeError(`Command at ${dir} does not export a name value.`);                                                               // These lines simply check
                        if(!typeof cmd.help.name == "string") throw new TypeError(`Command at ${dir} exports an invalid name value, it can only be a string.`);                  // if the help object exports any
                        if(!cmd.help.description) throw new TypeError(`Command at ${dir} does not export a description value.`);                                                 // values that our dynamic help command
                        if(!typeof cmd.help.description == "string") throw new TypeError(`Command at ${dir} exports an invalid description value, it can only be a string.`);    // requires to display the command help
                                                                                                                                                                                 // and if not, it throws an error.
                        if(client.commands.get(cmd.help.name)) throw new TypeError(`Command at ${dir} exports the same name value as another command.`);
                        
                        if(cmd.help.aliases) {
                            if(!typeof cmd.help.aliases === "string" || !typeof cmd.help.aliases === "object") throw new TypeError(`Command at ${dir} exports an invalid alias value. Value must be a string or object.`);
                            
                            let aliases;
                            if(typeof cmd.help.aliases == "string") aliases = [cmd.help.aliases]; // Add the alias to the "aliases" variable as an array element
                            else if(typeof cmd.help.aliases == "object") aliases = cmd.help.aliases // Add the aliases to the "aliases" variable as array elements

                            aliases.forEach(alias => { // Loop through all aliases and see if another command already has that alias
                                if(client.aliases.get(alias)) throw new TypeError(`Command at ${dir} exports the same alias value as another command.`);
                                client.aliases.set(alias, cmd.help.name); // if not, add the alias to the collection of aliases defined at index.js:5:1
                            });
                        };
                        if(cmd.help.ownerOnly && cmd.help.requiredPerms) throw new TypeError(`Command at ${dir} has a setting conflict: ownerOnly and requiredPerms cannot be used together.`); // Owners already have full permission over the bot, if a command is "ownerOnly", it shouldn't require any additional permissions
                        if(cmd.help.requiredPerms && cmd.help.requiredRoles) throw new TypeError(`Command at ${dir} has a setting conflict: requiredRoles and requiredPerms cannot be used together.`); // Because of role/perm conflict (a command might require a certain role and permission, but that role does not have the required permission), using these two settings together is disabled.
                        if(cmd.help.requiredRoles) {
                            if(typeof cmd.help.requiredRoles === "string") cmd.help.requiredRoles = [cmd.help.requiredRoles];
                            else if(typeof cmd.help.requiredRoles === "object") cmd.help.requiredRoles = cmd.help.requiredRoles;
                            else throw new TypeError(`Command at ${dir} exports an invalid requiredRoles value. Value must be a string or object.`)
                        };
                        if(!typeof cmd.help.ownerOnly == "boolean") throw new TypeError(`Command at ${dir} uses an invalid value for the ownerOnly setting.`); // the ownerOnly setting can only be a boolean -- true or false
                        if(!cmd.help.ownerOnly) cmd.help.ownerOnly = false;
                        if(cmd.help.requiredPerms) {
                            if(typeof cmd.help.requiredPerms == "string") cmd.help.requiredPerms = [cmd.help.requiredPerms]; // read line 33 -- instead of aliases, this is done to required permissions
                            else if(typeof cmd.help.requiredPerms == "object") {
                                cmd.help.requiredPerms.forEach(permission => {
                                    const permissions = [
                                        "ADMINISTRATOR",
                                        "CREATE_INSTANT_INVITE",
                                        "KICK_MEMBERS",
                                        "BAN_MEMBERS",
                                        "MANAGE_CHANNELS",
                                        "MANAGE_GUILD",
                                        "ADD_REACTIONS",
                                        "VIEW_AUDIT_LOG",
                                        "PRIORITY_SPEAKER",
                                        "STREAM",
                                        "VIEW_CHANNEL",
                                        "SEND_MESSAGES",
                                        "SEND_TTS_MESSAGES",
                                        "MANAGE_MESSAGES",
                                        "EMBED_LINKS",
                                        "ATTACH_FILES",
                                        "READ_MESSAGE_HISTORY",
                                        "MENTION_EVERYONE",
                                        "USE_EXTERNAL_EMOJIS",
                                        "VIEW_GUILD_INSIGHTS",
                                        "CONNECT",
                                        "SPEAK",
                                        "MUTE_MEMBERS",
                                        "DEAFEN_MEMBERS",
                                        "MOVE_MEMBERS",
                                        "USE_VAD",
                                        "CHANGE_NICKNAME",
                                        "MANAGE_NICKNAMES",
                                        "MANAGE_ROLES",
                                        "MANAGE_WEBHOOKS",
                                        "MANAGE_EMOJIS"
                                    ]
                                    if(!permissions.includes(permission.toUpperCase())) throw new TypeError(`Command at ${dir} requires an invalid permission: ${permission}.`); // Loop through a list of valid Discord permissions and see whether or not the exported permission is in that list
                                });
                            }
                            else throw new TypeError(`Command at ${dir} exports an invalid requiredPerms value. Value must be a string or object.`); // read line 36 -- instead of aliases, this is done to required permissions
                        };
                        if(!typeof cmd.help.usage == "string") throw new TypeError(`Command at ${dir} exports an invalid usage value.`);
                        if(!typeof cmd.help.minArgs == "number") throw new TypeError(`Command at ${dir} exports an invalid minArgs value.`);
                        if(!typeof cmd.help.maxArgs == "number") throw new TypeError(`Command at ${dir} exports an invalid maxArgs value.`);

                        if(!cmd.help.minArgs) cmd.help.minArgs = 0;
                        if(cmd.help.maxArgs === undefined || cmd.help.maxArgs < 0) cmd.help.maxArgs = -1
                        
                        if(cmd.help.minArgs > cmd.help.maxArgs && cmd.help.maxArgs !== -1) throw new TypeError(`Command at ${dir} minimally requires more arguments than maximally allowed.`);
                        

                        client.commands.set(cmd.help.name, cmd); // Add the command to the collection of commands defined at index.js:5:1
                        console.log(`Loaded command "${cmd.help.name}"`);
                    }
                    else throw new TypeError(`Command at ${dir} does not export a help object.`); // Throw an error if there is no help object in a command
                }
            })
        })
    }
    catch(e) {
        throw e // If an error is encountered, throw it
    };
};
