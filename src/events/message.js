const { MessageEmbed } = require("discord.js");

module.exports = async(client, message) => {
    const { owners, prefix, color, emoji, footer } = client.config;
    const { guild, channel, author, content, mentions } = message;
    let member = message.member;

    const args = content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    
    let command;

    if(mentions.users.get(client.user.id)) {
        channel.send(
            new MessageEmbed()
            .setColor(color.positive)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle("Hello! :smile:")
            .setDescription(`I'm shxbot, a Discord image uploader bot created by <@!${owners[0]}>.\nMy prefix is \`shx \` (there's a space at the end!).\nTo get started, please use the \`setup\` command in my DMs.`)
            .setFooter(footer)
        );
        return;
    };

    if(!content.startsWith(prefix) || !cmd) return;
    if(!member && guild) member = await guild.fetchMember(author);

    if(cmd.indexOf("\n")) cmd = cmd.split("\n")[0];
    if(cmd.indexOf("​")) cmd = cmd.split("​")[0];
    
    if(client.commands.has(cmd)) command = client.commands.get(cmd);
    else if(client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

    if(!command) return;
    const { name, ownerOnly, requiredPerms, requiredRoles, minArgs, maxArgs, usage, dm } = command.help;

    if(ownerOnly == true && !owners.includes(author.id)) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Invalid Permissions", "To run this command, you need to be a bot owner!")
            .setFooter(footer)
            );
            return;
        }
        if(dm === true && channel.type !== "dm") {
            message.delete({ reason: "Inocrrect use of the setup command." });
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Invalid Usage", "This command must be ran in DMs!")
                .setFooter(footer)
            );
            return;
        }
        else if(dm === false && channel.type === "dm") {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Invalid Usage", "This command must be ran in a server!")
                .setFooter(footer)
            );
            return;
        };
    if(requiredPerms && requiredPerms.length) {
        for(perm of requiredPerms) {
            if(!member.hasPermission(perm)) {
                channel.send(
                    new MessageEmbed()
                    .setColor(color.negative)
                    .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .setTitle(`${emoji.negative} Error!`)
                    .addField("Invalid permissions", `You need to have the \`${perm}\` permission to run this command!`)
                    .setFooter(footer)
                );
                return;
            };
        };
    };
    if(requiredRoles && requiredRoles.length) {
        for(const role of requiredRoles) {
            const req = guild.roles.cache.get(role);

            if(!member.roles.cache.get(req.id)) {
                channel.send(
                    new MessageEmbed()
                    .setColor(color.negative)
                    .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .setTitle(`${emoji.negative} Error!`)
                    .addField("Invalid roles", `You need to have the \`${req.name}\` role to run this command!`)
                    .setFooter(footer)
                );
                return;
            };
        };
    };

    let reqArgs;
    if(minArgs === maxArgs) reqArgs = `This command requires ${minArgs} arguments!`;
    if(minArgs > 0 && maxArgs == -1) reqArgs = `This command requires at least ${minArgs} arguments!`;
    if(minArgs !== maxArgs) reqArgs = `This command requires ${minArgs}-${maxArgs} arguments!`;

    if(args.length < minArgs) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Not Enough Arguments!", `${reqArgs}\n*Usage: ${prefix}${name} ${usage}*`)
            .setFooter(footer)
        );
        return;
    }
    if(args.length > maxArgs && maxArgs !== -1) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Too Many Arguments!", `${reqArgs}\n*Usage: ${prefix}${name} ${usage}*`)
            .setFooter(footer)
        );
        return;
    };

    if(command) command.run(client, message, args);
};
