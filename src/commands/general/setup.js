const { MessageEmbed } = require("discord.js");
const configSchema = require("../../schemas/configSchema.js");

module.exports.run = async(client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { channel, author } = message;

    if(!args[1]) args[1] = undefined;
    if(!args[0].endsWith("/upload")) {
        if(args[0].endsWith("/")) args[0] = `${args[0]}upload`;
        else args[0] = `${args[0]}/upload`;
    };

    await configSchema.findByIdAndUpdate(
        author.id,
        {
            url: args[0],
            token: args[1]
        },
        {
            upsert: true,
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
                .setDescription("Successfully saved your information.")
                .setFooter(footer)
            );
        }
    );
};

module.exports.help = {
    name: "setup",
    description: "Configure which subdomain to use when uploading images.",
    aliases: ["config", "configure"],
    usage: "<website url> [upload token]",
    minArgs: 1,
    maxArgs: 2,
    dm: true
};