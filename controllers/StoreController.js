const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, done) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            done(null, true);
        } else {
            done("That filetype not allowed.", false);
        }
    }
};

// render us to Home Page
exports.homePage = (req, res) => {
    res.render('index', { title: 'Now it is delicious' });
};

/********** *******************************************
 *render add store page and we call it editStore to make
 *   it reusable also in edit form 
 *********************************************************/
exports.add = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
    if (!req.file) {
        return next();
    }
    const extention = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extention}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

/* process save the added store to the database */
exports.createStore = async(req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `successfully created ${store.name} care to leave a review ?`);
    res.redirect(`/store/${store.slug}`);
};

/* display stores */
exports.getStores = async(req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'stores', stores: stores });
};

exports.editStore = async(req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    res.render('editStore', { title: `Edit ${store.name}`, store: store });
};

exports.updateStore = async(req, res) => {
    req.body.location.type = "Point";
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of old one
        runValidators: true,
    }).exec();
    req.flash('success', `successfully updated ${store.name} <a href="/stores/${store.slug}">View Store -></a>`);
    res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async(req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return next();
    res.render('store', { store, title: store.name });
};