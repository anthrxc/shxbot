const guildSchema = require("../../schemas/guildSchema");
const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { guild, channel, author, member } = message;

    if(!args[0]) {
        const guildConfig = await guildSchema.findById(guild.id);
        
        const embed = new MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setFooter(footer);
        
        if(guildConfig.url) {
            channel.send(
                embed
                .setColor(color.positive)
                .setTitle(`${emoji.positive} Success!`)
                .setDescription(`The default domain for this server is \`${guildConfig.url.slice(0, -6)}\``)
            );
        }
        else {
            embed
            .setColor(color.positive)
            .setTitle(`${emoji.positive} Success!`)

            if(member.hasPermission("MANAGE_GUILD")) {
                embed.setDescription(`There is no default domain for this server.\nYou can set one by running \`shx default [domain]\`. Make sure that the domain you provide is public!`)
            }
            else {
                embed.setDescription(`There is no default domain for this server.`)
            };
            channel.send(embed);
        };
    };
    if(args[0]) {
        if(!member.hasPermission("MANAGE_GUILD")) {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Invalid permission", "You need to have the \`MANAGE_GUILD\` permission to run this command!")
                .setFooter(footer)
            );
            return;
        };
        if(!args[0].startsWith("https")) {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Invalid URL", "The URL you provided is not valid.\nMake sure it starts with `https://`!")
                .setFooter(footer)
            );
            return;
        };
        
        let url;
        if(args[0].endsWith("/upload"));
        else {
            if(!args[0].endsWith("/")) url = `${args[0]}/upload`;
            else url = `${args[0]}upload`;
        };

        guildSchema.findByIdAndUpdate(guild.id, {
            _id: guild.id,
            url: url
        },
        {
            upsert: true
        },
        (err, doc, res) => {
            if(err) {
                channel.send(
                    new MessageEmbed()
                    .setColor(color.negative)
                    .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .setTitle(`${emoji.negative} Error!`)
                    .setDescription("An internal error has occured, please try again later.")
                    .setFooter(footer)
                );
                console.log(err);
                return;
            };
            channel.send(
                new MessageEmbed()
                .setColor(color.positive)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.positive} Success!`)
                .setDescription(`The default domain for \`${guild}\` is now \`${args[0].endsWith("/") ? args[0] : `${args[0]}/`}\`!\nPlease make sure that the domain you provided is public. If you provided a private domain, users won't be able to upload images!`)
                .setFooter(footer)                
            );
        });
    };
};

module.exports.help = {
    name: "default",
    description: "Check or set the default domain for this server!",
    usage: "[domain]",
    maxArgs: 1,
};