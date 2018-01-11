const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Faild to login',
    successRedirect: '/',
    successFlash: 'You are now loged in !. ',
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Hope to see u soon GOOD BYE!!');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Ooops You must login first !!.');
    res.redirect('/login');
};

exports.forgot = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'No account with that email ');
        return res.redirect('/login');
    }

    user.restPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resrPasswordExpired = Date.now() + 3600000;
    await user.save();
    const restURL = `http://${req.headers.host}/account/rest/${user.restPasswordToken}`;
    req.flash('success', `You have been emailed a password rest link ${restURL}`);
    res.redirect('/login');
};

exports.reset = async(req, res) => {
    const user = User.findOne({
        restPasswordToken: req.params.token,
        restPasswordExpired: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'password rest token invalied');
        return res.redirect('/login');
    }
    res.render('rest', { title: 'Rest Password' });
};

exports.confirmPassword = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        return next();
    }
    req.flash('error', 'password and confirm password not matched');
    res.redirect('back');
};

exports.update = async(req, res) => {
    const user = User.findOne({
        restPasswordToken: req.params.token,
        restPasswordExpired: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'password rest token invalied');
        return res.redirect('/login');
    }
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.restPasswordToken = undefined;
    user.restPasswordExpired = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', '💃 Nice! Your password has been reset! You are now logged in!');
    res.redirect('/');

};