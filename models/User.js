const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHndler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address'],
        required: 'Please enter email',
    },
    name: {
        type: String,
        trim: true,
        required: 'Please enter a name',
    },
    restPasswordToken: String,
    restPasswordExpired: Date,
    hearts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
    }]
});

userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatat/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHndler);

module.exports = mongoose.model('User', userSchema);