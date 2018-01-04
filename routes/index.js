const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(StoreController.getStores));
router.get('/stores', catchErrors(StoreController.getStores));
router.get('/add', StoreController.add);
router.post('/add', catchErrors(StoreController.createStore));
router.post('/add/:id', catchErrors(StoreController.updateStore));
router.get('/stores/:id/edit', catchErrors(StoreController.editStore));
module.exports = router;