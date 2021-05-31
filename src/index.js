const { Client, Collection } = require("discord.js");
const client = new Client({ disableMentions: "everyone" });

client.config = require("./config.js"); // Make all variables in the config.js file available through client.config
["commands", "aliases"].forEach(x => client[x] = new Collection()); // Create collections for the bot commands and their aliases

require("./handlers/command.js")(client); // require the handlers and provide the client variable
require("./handlers/event.js")(client);

if(client.config.database) {
    if(client.config.database.type.toLowerCase() === "quickdb") {
        client.database = require("quick.db"); // If the database type is quick.db, then require it
        console.log("Successfully enabled quick.db!");
    }
    else if(client.config.database.type.toLowerCase() === "mongodb") { // If the database type is mongodb, connect to the database
        const mongoose = require("mongoose");
        mongoose.connect(client.config.database.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        client.database == mongoose;
        console.log("Sucessfully enabled MongoDB!");
    };
};

client.login(client.config.token);
