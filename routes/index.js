const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(StoreController.getStores));

router.get('/stores', catchErrors(StoreController.getStores));

router.get('/add', AuthController.isLoggedIn, StoreController.add);

router.post('/add', StoreController.upload,
    catchErrors(StoreController.resize),
    catchErrors(StoreController.createStore)
);

router.post('/add/:id', StoreController.upload,
    catchErrors(StoreController.resize),
    catchErrors(StoreController.updateStore)
);

router.get('/stores/:id/edit', AuthController.isLoggedIn, catchErrors(StoreController.editStore));

router.get('/store/:slug', catchErrors(StoreController.getStoreBySlug))

router.get('/tags', catchErrors(StoreController.getStoresByTag));

router.get('/tags/:tag', catchErrors(StoreController.getStoresByTag));

router.get('/login', UserController.loginForm);
router.post('/login', AuthController.login);
router.get('/register', UserController.registerForm);
router.post('/register',
    UserController.validateRegister,
    catchErrors(UserController.register),
    AuthController.login);
router.get('/logout', AuthController.logout);

router.get('/account', AuthController.isLoggedIn, UserController.account);
router.post('/account', catchErrors(UserController.updateAccount));
router.post('/account/forgot', catchErrors(AuthController.forgot));
router.get('/account/rest/:token', catchErrors(AuthController.reset));
router.post('/account/rest/:token',
    AuthController.confirmPassword,
    catchErrors(AuthController.update)
);

/* dealing with API  */

router.get('/api/search', catchErrors(StoreController.serachStores));


module.exports = router;