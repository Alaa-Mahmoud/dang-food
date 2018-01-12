const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify')
exports.loginForm = (req, res) => {
    res.render('login', { title: 'LOGIN' });
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'REGISTER' });
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false,
    });
    req.checkBody('name', 'You must enter a name').notEmpty();
    req.checkBody('email', 'Invalid email address').isEmail();
    req.checkBody('password', 'Password can not be blank').notEmpty();
    req.checkBody('password-confirm', 'confirmed password can not b blank').notEmpty();
    req.checkBody('password-confirm', 'OOPS!! your password don\'t match ').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        return res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    }
    next();
}

exports.register = async(req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register, User);
    console.log(req.body.email);
    await register(user, req.body.password);
    next();
};

exports.account = (req, res) => {
    res.render('account', { title: req.user.name });
};

exports.updateAccount = async(req, res) => {
    const updates = {
        email: req.body.email,
        name: req.body.name,
    };

    const user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: updates }, { new: true, runValidator: true, context: 'Query' });
    req.flash('success', 'yeaay u updted your profile')
    res.redirect('back');
}