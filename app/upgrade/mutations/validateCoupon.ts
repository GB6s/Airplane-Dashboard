import {Ctx} from "@blitzjs/core"
import stripe from "../../../utils/stripe"
import {Stripe} from "stripe";

export default async function validateCoupon(
  {couponId}: { couponId: string },
  {session}: Ctx
): Promise<Stripe.Coupon | undefined> {
  session.authorize();

  try {
    return await stripe.coupons.retrieve(couponId);
  } catch (ignore) {
    return undefined;
  }
}