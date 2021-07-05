const { Client, Collection } = require("discord.js");
const client = new Client({ disableMentions: "everyone" });
const { connect } = require("mongoose");

client.config = require("./config.js");
["commands", "aliases"].forEach(x => client[x] = new Collection());

require("./handlers/command.js")(client);
require("./handlers/event.js")(client);

connect(client.config.database.uri, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB!");
}).catch(err => {
    console.log(err);
});

client.login(client.config.token);
