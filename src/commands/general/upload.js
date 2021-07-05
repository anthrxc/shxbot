const userConfig = require("../../models/user");
const guildConfig = require("../../models/guild");
const { MessageEmbed } = require("discord.js");
const { Image } = require("sxcu.js");

module.exports.run = async(client, message, args) => {
    const { color, emoji, footer } = client.config;
    const { guild, channel, author, member, attachments } = message;
    const filetypes = ["png", "jpg", "jpeg", "tif", "tiff", "gif", "ico", "bmp", "webm"];

    const image = attachments.first() ? attachments.first().url : args[0] ? args[0] : null;
    
    if(image === null) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("No Image", "You neet to attach an image or provide a URL to it.\n*Make sure that the URL ends with \`.<filetype>\`!*")
            .setFooter(footer)
        );
        return;
    };

    if(!image.startsWith("http")) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Invalid URL", "You have provided an invalid URL!\n*Make sure that the URL starts with \`http://\` or \`https://\`!*")
            .setFooter(footer)
        );
        return;
    };
    
    const endsWith = [];
    filetypes.forEach(x => {
        if(image.endsWith(x)) endsWith.push(true);
        else endsWith.push(false);
    });

    if(!endsWith.includes(true)) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Unsupported File Type", `You need to provide a URL that points to an image!\nMake sure the url ends with \`.<filetype>\`.\nSXCU supports these image filetypes: \`${filetypes.join(", ")}\`.`)
            .setFooter(footer)
        );
        return;
    };
    
    const u_conf = await userConfig.findById(author.id);
    const g_conf = await guildConfig.findById(guild.id);
    let url = u_conf ? u_conf.url : g_conf ? g_conf.url : null
    let token = u_conf ? u_conf.token : null;

    if(url === null) {
        const noB = new MessageEmbed()
        .setColor(color.negative)
        .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
        .setTitle(`${emoji.negative} Error!`)
        .setFooter(footer);

        if(member.hasPermission("MANAGE_GUILD")) noB.addField("No Destination", "You haven't set up a URL to upload images to. To set one up, run \`shx setup <URL> [token]\` in my DMs.\nYou can also set up a default domain for this server, which will be used whenever a user without a configured URL tries to upload an image. To do that, run \`shx default <URL>\`.");
        else noB.addField("No Destination", "You haven't set up a URL to upload images to. To set one up, run \`shx setup <URL> [token]\` in my DMs.");
    
        channel.send(noB);
        return;
    };

    
    // channel.send(
    //     new MessageEmbed()
    //     .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
    //     .setTitle("Uploading...")
    // ).then(msg => {
    //     const { attachFile, upload } = new Image(url, token);
    //     attachFile(image);
        
    //     upload().catch(err => {
    //         console.log(err);
    //     });
    // });
};

module.exports.help = {
    name: "upload",
    description: "Upload images to [sxcu.net](https://sxcu.net/)!",
    usage: "<attachment or url to image>",
    maxArgs: 1
};