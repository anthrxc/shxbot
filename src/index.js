const { Client, Collection } = require("discord.js");
const client = new Client({ disableMentions: "everyone" });

client.config = require("./config.js");
["commands", "aliases"].forEach(x => client[x] = new Collection());

require("./handlers/command.js")(client);
require("./handlers/event.js")(client);

client.login(client.config.token);
