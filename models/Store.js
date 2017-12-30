const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'please enter a store name .',
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String]
});

/********************************
 * auto generate slug before save 
 *if the name is modified 
 ********************************/
storeSchema.pre('save', function(next) {
    if (!isModified('name')) {
        next(); // skip it
        return; // stop this function from running 
    }
    this.slug = slug(this.name);
    next();
    // TODO make more resilient make slugs unique
});

module.exports = mongoose.model('Store', storeSchema);