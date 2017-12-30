const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');

router.get('/', StoreController.homePage);
router.get('/add', StoreController.add);
router.post('/add', StoreController.createStore);

module.exports = router;