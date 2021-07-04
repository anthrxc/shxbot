const userConfig = require("../../models/user");
const { MessageEmbed } = require("discord.js");
const { fetchDomains } = require("sxcu.js");

module.exports.run = async(client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { channel, author } = message;

    let domain = args[0];

    if(domain.startsWith("http://")) domain = domain.replace("http://", "https://");
    
    if(domain.startsWith("https://")) {
        if(domain.endsWith("/")) domain = domain.slice(8, -1);
        else domain = domain.slice(8);
    };

    let domains = await fetchDomains().catch(err => {
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

    if(domain.isPublic() === 0 && !args[1]) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Unauthorized", "You have provided a private domain without the domain's token.\nIf you wish to use this domain, please re-run the command and provide the token.")
            .setFooter(footer)
        );
        return;
    };

    userConfig.findByIdAndUpdate(author.id, {
        _id: author.id,
        url: `${domain.meta_data.domain}/upload`,
        token: args[1]
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
            .setDescription(`Your images will now be uploaded to \`${domain.meta_data.domain}\`!`)
            .setFooter(footer)
        );
    });
};

module.exports.help = {
    name: "setup",
    description: "Configure which domain the bot uploads your images to!",
    usage: "<sxcu domain>",
    aliases: "config",
    minArgs: 1,
    maxArgs: 2,
    dm: true
};