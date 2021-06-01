module.exports = async (client) => {
    console.clear();
    
    console.log(`-----------------------`);
    console.log(`${client.user.username} v${require("../../package.json").version}`);
    console.log(`Logged into Discord and ready to use!`);
    console.log(`-----------------------`);
    
    setTimeout(() => {
        console.clear();
    }, 1500);
};