import {passportAuth} from "blitz"
import db from "db"
import {Strategy} from "passport-discord"
import stripe from "../../../utils/stripe"

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/login",
  strategies: [
    new Strategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL: process.env.DISCORD_REDIRECT,
        authorizationURL: "https://discord.com/oauth2/authorize",
        scope: ["identify", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const {email} = profile
          if (!email) {
            return done(new Error("Email was not found."))
          }

          const avatar = `https://cdn.discordapp.com/${
            profile.avatar
              ? `avatars/${profile.id}/${profile.avatar}.png`
              : `embed/avatars/${+profile.discriminator % 5}.png`
          }`

          const user = await db.user.upsert({
            where: {discordId: profile.id},
            create: {
              email,
              name: profile.username,
              discordId: profile.id,
              avatar,
            },
            update: {
              email,
              name: profile.username,
              avatar,
            },
          })

          if (!user.stripeId) {
            const newCustomer = await stripe.customers.create({
              email: user.email,
              metadata: {
                airplaneId: user.id,
              },
            });

            await db.user.update({
              where: {id: user.id},
              data: {stripeId: newCustomer.id},
            });

            user.stripeId = newCustomer.id;
          }

          const publicData = {
            userId: user.id,
            roles: [user.role],
            stripeId: user.stripeId,
            source: "discord",
            avatar,
          }

          done(null, {publicData})
        } catch (e) {
          done(e)
        }
      }
    ),
  ],
})
