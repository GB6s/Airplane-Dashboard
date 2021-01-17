import {Ctx} from "blitz"
import stripe from "../../../utils/stripe"

export default async function fetchPastPayments(_: null, {session}: Ctx): Promise<any> {
  session.authorize();

  return stripe.charges.list({customer: session.publicData.stripeId, limit: 100})
}
