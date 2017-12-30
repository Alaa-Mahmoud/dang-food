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
exports.createStore = (req, res) => {
    res.json(req.body);
};