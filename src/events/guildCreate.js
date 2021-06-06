const guildSchema = require("../schemas/guildSchema.js");
const { MessageEmbed } = require("discord.js");

module.exports = async(client, guild) => {
    const { color, footer } = client.config;
    const log = client.channels.cache.get("848581884098641935");    
    
    guildSchema.create({
        _id: guild.id,
        prefix: "shx "
    });

    log.send(
        new MessageEmbed()
        .setColor(color.positive)
        .setAuthor(guild.name, guild.iconURL())
        .setTitle(`Joined Guild!`)
        .setDescription(`I have joined \`${guild.name}\` which has \`${guild.memberCount}\` members.\nThe owner of \`${guild.name}\` is ${guild.owner} (${guild.ownerID})`)
        .setFooter(footer)
    );
};