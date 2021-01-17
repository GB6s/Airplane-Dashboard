import { Stripe } from "stripe"

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
  apiVersion: "2020-08-27",
  typescript: true,
  appInfo: {
    name: "Airplane Dashboard",
  },
})

export default stripe
