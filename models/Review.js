const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    create: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply author'
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: 'You must Supply store'
    },
    text: {
        type: String,
        required: 'You must supply a string'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
});

function autopopulate(next) {
    this.populate('author');
    next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

mongoose.model('Review', reviewSchema);