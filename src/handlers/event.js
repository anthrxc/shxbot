const { readdir } = require('fs');
const { sep } = require('path');

module.exports = async(client) => {
    const dir = `${process.cwd()}${sep}src${sep}events`;
    
    readdir(dir, async (err, files) => {
        for(const file of files) {
            if(!file.endsWith(".js")) continue;

            const evt = require(`${process.cwd()}/src/events/${file}`);
            const evtName = file.split(".")[0];

            client.on(evtName, evt.bind(null, client));
            delete require.cache[require.resolve(`${process.cwd()}/src/events/${file}`)];
        };
    });
};