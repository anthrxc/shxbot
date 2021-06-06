const { Schema, model } = require("mongoose");

const reqStr = {
    type: String,
    required: true
};
const optStr = {
    type: String,
    required: false
};
const date = {
    type: Date,
    required: true
}

const userSchema = Schema({
    _id: reqStr,
    url: reqStr,
    token: optStr,
    expires: date
});

module.exports = model("user", userSchema);