const { Schema, model } = require("mongoose");

const reqStr = {
    type: String,
    required: true
};

const guildSchema = Schema({
    _id: reqStr,
    prefix: reqStr
});

module.exports = model("guild", guildSchema);