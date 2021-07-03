const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { guild, channel, author, member, content, mentions, type } = message;
    
    try {
        let code = args.join(' ');
        
        let res = eval(code);
        if(res == client.token) res = 'aG93IGR1bWIgYXJlIHlvdT8gZGlkIHlvdSB0aGluayBpZCBsZWFrIHRoZSB0b2tlbj8=\n*tip: go to https://base64decode.org/ :)*';
        
        channel.send(
            new MessageEmbed()
            .setColor(color.green)
            .setTitle(`${emoji.positive} Output:`)
            .setDescription(`\`\`\`js\n${res}\n\`\`\``)
        );
    } catch (e) {
        channel.send(
            new MessageEmbed()
            .setColor(color.red)
            .setAuthor(`${author.username}#${author.discriminator}`, author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setThumbnail(logo)
            .setTitle(`${emoji.negative} Error!`)
            .setDescription(`${e.name}: ${e.message}`)
            .setFooter(footer)
        );
    };
};

module.exports.help = {
    name: "eval",
    description: "Executes JavaScript code.",
    aliases: "evaluate",
    ownerOnly: true,
    usage: "<valid JavaScript code>",
    minArgs: 1,
    maxArgs: -1
};