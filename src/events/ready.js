module.exports = async (client) => {
    setTimeout(() => {
        console.clear();
        
        console.log(`-----------------------`);
        console.log(`${client.user.username} v${require("../../package.json").version}`);
        console.log(`Logged into Discord and ready to use!`);
        console.log(`-----------------------`);
    }, 1500)
    
};