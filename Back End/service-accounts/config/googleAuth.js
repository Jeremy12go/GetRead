const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Account = require('../models/Account');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.ID_CLIENTE,
      clientSecret: process.env.SECRETO_CLIENTE,
      callbackURL: "/auth/google/callback",
    },
    async ( accessToken, refreshToken, profile, done ) => {
        try {
            const email = profile.emails[0].value;

            let account = await Account.findOne({ email });

            if (!account) {
                const buyer = await Profilebuyer.create({
                    name: profile.displayName,
                    phoneNumber: "No especificado",
                    address: "No especificado"
            });

            account = await Account.create({
                email: email,
                googleId: profile.id,
                profilebuyer: buyer._id,
                profileImage: profile.photos[0].value
            });
            } else {
                if (!account.googleID) {
                    account.googleID = profile.id;
                    account.profileImage = profile.photos[0].value;
                    await account.save();
                }
            }
        return done(null, account);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Account.findById(id);
  done(null, user);
});
