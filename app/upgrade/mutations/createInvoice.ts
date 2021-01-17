import {matchPlan, Plan} from "../../../utils/plans"
import {Ctx} from "@blitzjs/core"
import db from "../../../db"
import stripe from "../../../utils/stripe"
import {randomBytes} from "crypto"

export default async function createInvoice(
  {plan, couponId}: { plan: Plan, couponId: string | undefined },
  {session}: Ctx
): Promise<number | undefined> {
  session.authorize();

  // Check for pending payment
  const response = await db.instance.findMany({
    where: {
      AND: [
        {userId: session.userId},
        {parentId: null}
      ]
    },
    select: {id: true, lastPaid: true},
  });

  if (response.find((item) => item.lastPaid === null)) {
    throw new Error("You have a plan that is awaiting payment.");
  }

  const actualPlan = matchPlan(plan);

  if (!actualPlan) {
    throw new Error("Invalid plan")
  }

  if (!actualPlan.offered) {
    throw new Error("That plan is no longer offered")
  }

  const {cost, playerCount} = actualPlan
  const usd = (cost * 100) | 0;

  if (usd < 100) {
    console.error("Invalid US cent amount: " + usd)
    throw new Error("A server error occurred")
  }

  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 365;

  const {stripeId} = session.publicData;

  if (!stripeId) {
    throw new Error("No stripe id, try logging out and back in.")
  }

  let coupon = couponId ? await stripe.coupons.retrieve(couponId) : undefined;

  const subscription = await stripe.subscriptions.create({
    customer: stripeId,
    items: [
      {price: plan.priceId},
    ],
    days_until_due: 7,
    collection_method: "send_invoice",
    coupon: coupon ? coupon.id : "",
    metadata: {
      userId: session.userId,
      playerCount,
      expiresAt,
    },
  });

  const instance = await db.instance.create({
    data: {
      user: {
        connect: {
          id: session.userId,
        },
      },
      apiKey: randomBytes(24).toString("hex"),
      playerLimit: playerCount,
      cost,
      expires: new Date(expiresAt),
      subscriptionId: subscription.id,
    },
  })

  if (plan.childPlan) {
    await db.instance.create({
      data: {
        user: {
          connect: {
            id: session.userId
          },
        },
        parent: {
          connect: {
            id: instance.id,
          },
        },
        apiKey: randomBytes(24).toString("hex"),
        playerLimit: plan.childPlan.playerCount,
        cost: 0,
        expires: new Date(expiresAt),
        subscriptionId: subscription.id,
      },
    })
  }

  return instance.id
}