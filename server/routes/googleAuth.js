
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
const User = require('../../models/User.js');





// Check for required environment variables
if (!process.env['GOOGLE_CLIENT_ID'] || !process.env['GOOGLE_CLIENT_SECRET']) {
    throw new AppError('Environment variables not set', 500);
}





passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile', 'email']
},
    async function (issuer, profile, done) {
        try {
            let userEmail = profile.emails[0].value;
            let user;
            user = await User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }
            user = new User({
                googleId: profile.id,
                email: userEmail,
                displayName: profile.displayName
            });
            await user.save();

            done(null, user);

        } catch (err) {
            done(err);
        }
    }
));



router.get('/register', (req, res) => {
    res.render("register");
})


router.get('/login/federated/google', passport.authenticate('google'));


router.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    res.redirect('/home');
});


router.get('/login', (req, res) => {
    res.render('login');
})


router.get('/logout', (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return next(new AppError('Logout failed', 500));
            }
            res.redirect('login');
        });
    } catch (err) {
        next(new AppError('An unexpected error occurred during logout', 500));
    }
});




module.exports = router;