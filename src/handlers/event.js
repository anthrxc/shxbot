const { readdir } = require('fs');
const { sep } = require('path');

module.exports = async(client) => {
    const dir = `${process.cwd()}${sep}src${sep}events`;
    
    readdir(dir, async (err, files) => {
        for(const file of files) {
            if(!file.endsWith('.js')) continue; // Loop through all the files in the /src/events directory, if a file doesn't end with ".js", ignore it

            const evt = require(`${process.cwd()}/src/events/${file}`); // Require the event file
            const evtName = file.split('.')[0];

            client.on(evtName, evt.bind(null, client)); // Clever trick to use the client variable inside of event files, read https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/first-bot/a-basic-command-handler.md#main-file-changes
            delete require.cache[require.resolve(`${process.cwd()}/src/events/${file}`)]; // Delete the event file from cache
        };
    });
};