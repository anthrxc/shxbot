const { readdir, readdirSync } = require("fs");
const { sep } = require("path");
const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, message, args) => {
    const { prefix, color, emoji, footer } = client.config;
    const { channel, author } = message;

    let dir = `${process.cwd()}${sep}src${sep}commands`
    let categories;
    readdir(dir, (err, files) => {
        categories = files;
    });
    setTimeout(() => {
        if(!args.length) {
            const help = new MessageEmbed()
                .setColor(color.positive)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.positive} Help`)
                .setFooter(footer);
            
            categories.forEach(category => {
                if(category == "dev") return;
                help.addField(category.toLocaleUpperCase(), `\`${prefix}help ${category}\``, true)
            });
            channel.send(help);
            return;
        }
        else {
            if(!categories.includes(args[0])) {
                channel.send(
                    new MessageEmbed()
                    .setColor(color.positive)
                    .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .setTitle(`${emoji.negative} Error!`)
                    .addField("Invalid Argument", "You must specify a valid category!")
                    .setFooter(footer)
                );
                return;
            };

            dir = `${dir}${sep}${args[0]}`;
                
            const help = new MessageEmbed()
                .setColor(color.positive)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.positive} Help - ${args[0].toLocaleUpperCase()}`)
                .setFooter(footer);

            const commands = readdirSync(dir).filter(f => f.endsWith(".js"));
            commands.forEach(command => {
                const cmd = require(`${dir}${sep}${command}`);
                    
                let maxArgs;
                if(cmd.help.maxArgs === -1) maxArgs = "Unlimited";
                else maxArgs = cmd.help.maxArgs;
                if(typeof cmd.help.aliases === "string") cmd.help.aliases = [cmd.help.aliases];
                else;
                
                help.addField(cmd.help.name, `*${cmd.help.description}*\n\n**Usage:** ${prefix}${cmd.help.name} ${cmd.help.usage}\n**Aliases:** ${cmd.help.aliases ? cmd.help.aliases.join(", ") : "None"}\n**Owner Only:** ${cmd.help.ownerOnly}\n**DM:** ${cmd.help.dm}\n**Minimum Arguments:** ${cmd.help.minArgs}\n**Maximum Arguments:** ${maxArgs}`, true);
            });
            channel.send(help);
        };
    }, 10);
};

module.exports.help = {
    name: "help",
    description: "Shows you a list of commands and information about them.",
    usage: "[category]",
    maxArgs: 1
};
