const { Schema, model } = require('mongoose');

module.exports = model("ModerationDB",
    new Schema({
        GuildID: String,
        UserID: String,
        ChannelIDs: Array,
        WarnData: Array,
        KickData: Array,
        BanData: Array,

        // AI Moderation System
        Punishments: Array,
        LogChannelIDs: Array,
        BypassUsers: Array,
        BypassRoles: Array,
    })
);