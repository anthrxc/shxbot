const guildConfig = require("../../models/guild");
const { MessageEmbed } = require("discord.js");
const { fetchDomains } = require("sxcu.js");

module.exports.run = async(client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { guild, channel, author, member } = message;
    
    let domain = args[0];
    const g_conf = await guildConfig.findById(guild.id);
    
    if(!domain) {
        const embed = new MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setFooter(footer);
        
        if(g_conf.url) {
            embed
            .setColor(color.positive)
            .setTitle(`${emoji.positive} Success!`);
            
            if(member.hasPermission("MANAGE_GUILD")) {
                embed.setDescription(`The default domain for this server is \`${g_conf.url.slice(0, -7)}\`.\nYou can change the domain by running \`shx default [domain]\`. Make sure that the domain you provide is public!`)
            }
            else {
                embed.setDescription(`The default domain for this server is \`${g_conf.url.slice(0, -7)}\``)
            };
            channel.send(embed);
        }
        else {
            embed
            .setColor(color.positive)
            .setTitle(`${emoji.positive} Success!`);

            if(member.hasPermission("MANAGE_GUILD")) {
                embed.setDescription(`There is no default domain for this server.\nYou can set one by running \`shx default [domain]\`. Make sure that the domain you provide is public!`)
            }
            else {
                embed.setDescription(`There is no default domain for this server.`)
            };
            channel.send(embed);
        };
    };
    if(domain) {
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
        if(domain == g_conf.url) {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Same URL", "The URL you provided is the same as the current default URL!")
                .setFooter(footer)
            );
            return;
        };


        if(domain.startsWith("http://")) domain = domain.replace("http://", "https://");
        if(domain.startsWith("https://")) domain = domain.slice(8);
        if(domain.indexOf("/") > -1) domain = domain.slice(0, domain.indexOf("/"));
    
        const domains = await fetchDomains().catch(err => {
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
        });

        domain = domains.find(d => d.getDomain() === domain) || null;

        if(domain === null) {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Invalid URL", "The URL you provided is not an existing [sxcu.net](https://sxcu.net/) domain.")
                .setFooter(footer)
            );
            return;
        };
    
        if(domain.isPublic() === 0) {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Unsupported domain", "Server default domains cannot be private.\nPlease provide a public domain.")
                .setFooter(footer)
            );
            return;
        };
        
        guildConfig.findByIdAndUpdate(guild.id, {
            _id: guild.id,
            url: `${domain.meta_data.domain}/upload`
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
                .setDescription(`The default domain for \`${guild}\` is now \`${domain.meta_data.domain}\`!`)
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