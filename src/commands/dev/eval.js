module.exports.run = async(client, message, args) => {
    const { channel } = message;

    const clean = text => {
        if(typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    };

    try {
        const code = args.join(" ");
        let evaled = eval(code);

        if(typeof evaled !== "string") evaled = require("util").inspect(evaled);
        if(evaled == client.token) evaled = "did you really think i'd let you do that";
        channel.send(clean(evaled), { code: "xl" });

    } 
    catch (err) {
        message.channel.send(`\`\`\`xl\n${clean(err)}\n\`\`\``);
    };
};

module.exports.help = {
    name: "eval",
    description: "Executes JavaScript code. Because of the nature of the command, it is limited to bot owners.",
    aliases: "evaluate",
    ownerOnly: true,
    usage: "<valid JavaScript code>",
    minArgs: 1,
    maxArgs: -1
};