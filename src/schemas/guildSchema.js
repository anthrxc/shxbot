const { Schema, model } = require("mongoose");

const reqStr = {
    type: String,
    required: true
};

const guildSchema = Schema({
    _id: reqStr,
    url: reqStr,
});

module.exports = model("guild", guildSchema);