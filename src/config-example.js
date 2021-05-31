module.exports = {
    owners: ["ALL", "OWNER", "IDs", "HERE"],
    database: {
        type: "DATABASE-TYPE-HERE", // can be one of quickdb, mongodb
        uri: "DATABASE://URI:HERE" // if you use quick.db, delete this line
    },
    token: "BOT-TOKEN-HERE",
    prefix: "PREFIX-HERE",
    color: {
        positive: "GREEN", // #2ECC71
        negative: "RED" // #E74C3C
    },
    emoji: {
        positive: ":green_circle:", // For custom server emojis, use "<:emojiName:emojiID>"
        negative: ":red_circle:" // which you can get by typing "\:emojiName:"
    },
    footer: "EMBED-FOOTER"
};
