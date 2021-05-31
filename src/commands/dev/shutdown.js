const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, message) => {
    const { color, emoji, footer } = client.config;
    const { channel, author } = message;
 
    console.log("Shutdown initiated...")
    
    channel.send(
        new MessageEmbed()
        .setColor(color.positive)
        .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
        .setTitle(`${emoji.positive} Shutdown`)
        .setDescription("The bot has been shut down.")
        .setFooter(footer)
    );

    setTimeout(() => { process.exit(); }, 1500);
};

module.exports.help = {
    name: "shutdown",
    description: "Shuts down the bot.",
    aliases: ["sd", "quit", "exit"],
    ownerOnly: true,
    maxArgs: 0
};