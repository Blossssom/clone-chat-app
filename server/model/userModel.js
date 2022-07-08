const mongoose = require('mongoose');

const userSchma = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("Users", userSchma);

// nosql의 데이터 타입을 지정하기 위해 작성된 스키마