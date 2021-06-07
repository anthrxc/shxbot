const userSchema = require("../../schemas/userSchema.js");
const { MessageEmbed } = require("discord.js");
const { createWriteStream, unlink } = require("fs");
const { join } = require("path");
const request = require("request");
const { Image } = require("sxcu.js");

module.exports.run = async(client, message, args) => {
    const { prefix, color, emoji, footer } = client.config;
    const { channel, author, attachments } = message;
    const filetypes = ["png", "jpg", "jpeg", "tif", "tiff", "gif", "ico", "bmp", "webm"];

    if(!args[0]) {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .setDescription("You need to attach an image or provide an URL that points to the image (make sure it ends with **.<filetype>**).")
            .setFooter(footer)
        );
        return;
    };
    
    let attachment;
    if(args[0].toLowerCase() === "attached") {
        if(!attachments.first()) {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .setDescription("You need to attach an image!")
                .setFooter(footer)
            );
            return;
        };
        attachment = attachments.first().url;
    }
    else if(args[0].startsWith("http")) attachment = args[0];
    else {
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .addField("Invalid Arguments!", `If you are providing an attached image, please use \`${prefix}upload attached\`.\nOtherwise, provide a valid image URL.`)
            .setFooter(footer)
        );
        return;
    };

    let filename;
    let filelocation;
    for(const filetype of filetypes) {
        if(attachment.endsWith(filetype) !== -1) {
            filename = attachment.split("/");
            filelocation = `\\images\\${filename[filename.length-1]}`;
            filename = `./images/${filename[filename.length-1]}`;
            filelocation = join(__dirname, `..\\..\\..\\${filelocation}`);
            break;
        }
        else {
            channel.send(
                new MessageEmbed()
                .setColor(color.negative)
                .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                .setTitle(`${emoji.negative} Error!`)
                .addField("Unsupported File Type", `You need to provide a URL that points to an image!\nMake sure the url ends with \`.<filetype>\`.\nSXCU supports these image files: ${filetypes.join(", ")}`)
                .setFooter(footer)
            );
            continue;
        };
    };
    
    function download(uri, filename, callback) {
        request.head(uri, {},
            function(err, res, body) {
                const filesize = res.headers["content-length"];
                if(filesize < 12) {
                    channel.send(
                        new MessageEmbed()
                        .setColor(color.negative)
                        .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                        .setTitle(`${emoji.negative} Error!`)
                        .addField("Image Too Small", `You cannot upload images smaller than \`5 bytes\` to [sxcu.net](https://sxcu.net/api/docs/endpoint/img_upload)!`)
                        .setFooter(footer)
                    );
                    return;
                }
                else if(filesize > 99614720) {
                    channel.send(
                        new MessageEmbed()
                        .setColor(color.negative)
                        .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                        .setTitle(`${emoji.negative} Error!`)
                        .addField("Image Too Big", `You cannot upload images larger than \`95 MB (approx. 90.59 MiB)\` to [sxcu.net](https://sxcu.net/api/docs/endpoint/img_upload)!`)
                        .setFooter(footer)
                    );
                    return;
                };
                
                request(uri).pipe(createWriteStream(filename)).on('close', callback);
            }
        );
    };

    if(!await userSchema.findById(author.id)){
        channel.send(
            new MessageEmbed()
            .setColor(color.negative)
            .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setTitle(`${emoji.negative} Error!`)
            .setDescription(`Before using this command, you need to set up your domain!\nIf you don't already have a domain, [click here](https://sxcu.net/).\nWith your domain, run \`${prefix}setup <subdomain> [token (if the subdomain is private)]\` in my DMs.`)
            .setFooter(footer)
        );
        return;
    };

    let { url, token } = await userSchema.findById(author.id);
    const { attachFile, upload } = new Image(url, token);

    download(attachment, filename, () => {
        attachFile(filelocation);
        upload().then(img => {
            channel.send(
                new MessageEmbed()
                    .setColor(color.positive)
                    .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .setTitle(`${emoji.positive} Success!`)
                    .setDescription(`Your image has been uploaded successfully!\n\nImage URL: ${img.body.url}\nDeletion URL: ${img.body.del_url}`)
                    .setThumbnail(img.body.thumb)
                    .setFooter(footer)
                );
            }).catch(err => {
                const error = new MessageEmbed()
                    .setColor(color.negative)
                    .setAuthor(author.tag, author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .setTitle(`${emoji.negative} Error!`)
                    .setFooter(footer);
                
                if(err.reason) {
                    error.setDescription("This subdomain is private!\nPlease run the setup command in my DMs, but provide a valid access token!");
                    channel.send(error);
                }
            });
        }
    );
        setTimeout(() => unlink(filelocation, err => { if(err) console.log(err); }), 2500);
    
    setTimeout(async() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setHours(0, 0, 0, 0);
        
        await userSchema.findByIdAndUpdate(
            author.id,
            {
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
            }
        );
    }, 3500);
};

module.exports.help = {
    name: "upload",
    description: "Upload an image to sxcu.net",
    usage: "<the image url/attachment>",
    maxArgs: 1
};