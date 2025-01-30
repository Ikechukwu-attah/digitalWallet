import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import { prisma } from "./db.js";
import bcrypt from "bcryptjs";

dotenv.config();

passport.use(
    new GoogleStrategy({
            clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET_ID,
            callbackURL: "http://localhost:8080/auth/user/google/callback", // Ensure this matches Google Console
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google Profile Data:", JSON.stringify(profile, null, 2)); // Debug log

                // ✅ Safely access email from `profile.emails`
                if (!profile.emails || profile.emails.length === 0) {
                    return done(new Error("No email found in Google profile"), null);
                }

                const email = profile.emails[0].value;
                const firstname =
                    profile.name && profile.name.givenName ?
                    profile.name.givenName :
                    "No Firstname";
                const lastname =
                    profile.name && profile.name.familyName ?
                    profile.name.familyName :
                    "No Lastname";
                const username = `${firstname.toLowerCase()}${lastname.toLowerCase()}${Math.floor(
          Math.random() * 10000
        )}`;

                // Generate a secure random password
                const defaultPassword = await bcrypt.hash(
                    Math.random().toString(36).slice(-8),
                    10
                );

                // ✅ Check if user exists in DB
                let user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    // ✅ Create new user if not found
                    user = await prisma.user.create({
                        data: {
                            firstname,
                            lastname,
                            email,
                            isActive: true,
                            username,
                            password: defaultPassword,
                        },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});