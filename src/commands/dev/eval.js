module.exports.run = async(client, message, args) => {
    const { channel } = message;

    const clean = text => {
        if(typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); // Deletes zero-width spaces from the provided code (if there are any)
        else return text; // if the type of the text isn't a string, return the text
    };

    try {
        const code = args.join(" ");
        let evaled = eval(code); // execute the provided code

        if(typeof evaled !== "string") evaled = require("util").inspect(evaled); // converts the variable value to a string (if it isn't already one) in a safe way that won't error out on some objects
        if(evaled == client.token) evaled = "did you really think i'd let you do that" // prevents you from leaking your token
        channel.send(clean(evaled), { code: "xl" }); // If the length of the output is longer than 2000 characters, the bot will error out

    } 
    catch (err) {
        message.channel.send(`\`\`\`xl\n${clean(err)}\n\`\`\``);
    };
};

/* 
 * !!! Before granting users BOT OWNER permissions and even USING the command, !!!
 * !!! read this: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md#but-eval-is-dangerous !!!,
 * !!! THE WHOLE THING. ANY DAMAGE YOU DO TO YOUR COMPUTER OR HOSTING SERVICE WHILE USING THIS COMMAND IS ENTIRELY YOUR FAULT. !!!
 * !!! I DO NOT TAKE ANY RESPONSIBILITY FOR WHAT HAPPENS WHEN YOU USE THIS COMMAND !!!
 * !!! YOU'VE BEEN WARNED !!!
 */

module.exports.help = {
    name: "eval",
    description: "Executes JavaScript code. Because of the nature of the command, it is limited to bot owners.",
    aliases: "evaluate",
    ownerOnly: true,
    usage: "<valid JavaScript code>",
    minArgs: 1,
    maxArgs: -1
};