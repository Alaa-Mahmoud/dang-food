const mongoose = require('mongoose');
const Store = mongoose.model('Store');
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
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of old one
        runValidators: true,
    }).exec();
    req.flash('success', `successfully updated ${store.name} <a href="/stores/${store.slug}">View Store -></a>`);
    res.redirect(`/stores/${store._id}/edit`);
};