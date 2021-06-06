const guildSchema = require("../schemas/guildSchema.js");
const { MessageEmbed } = require("discord.js");

module.exports = async(client, guild) => {
    const { color, footer } = client.config;
    const log = client.channels.cache.get("848581884098641935");    
    
    await guildSchema.deleteOne({
        _id: guild.id
    });

    log.send(
        new MessageEmbed()
        .setColor(color.negative)
        .setAuthor(guild.name, guild.iconURL())
        .setTitle(`Left Guild!`)
        .setDescription(`I have left \`${guild.name}\` which has \`${guild.memberCount}\` members.`)
        .setFooter(footer)
    );
};