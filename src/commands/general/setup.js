const { MessageEmbed } = require("discord.js");
const userSchema = require("../../schemas/userSchema.js");

module.exports.run = async(client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { channel, author } = message;

    if(!args[0].startsWith("https://")) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .setDescription("Invalid domain! Please make sure that you type in the `https://` part too!\nIf you are using a private domain, make sure you provide the domain's token after the domain itself.")
        )
        return;
    }
    if(!args[0].endsWith("/upload")) {
        if(args[0].endsWith("/")) args[0] = `${args[0]}upload`;
        else args[0] = `${args[0]}/upload`;
    };
    
    if(!args[1]) args[1] = undefined;

    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setHours(0, 0, 0, 0);

    await userSchema.findByIdAndUpdate(
        author.id,
        {
            url: args[0],
            token: args[1],
            expires: date
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
                .setDescription(`Successfully saved your information.\n${!args[1] ? "*Note: If you provided a private subdomain, you need to re-run this command and provide the subdomain's token or you won't be able to upload images!*" : ""}`)
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