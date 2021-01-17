import {Ctx, invalidateQuery} from "@blitzjs/core"
import db from "../../../db"
import stripe from "../../../utils/stripe";
import getInstance from "../../instance/queries/getInstance";
import {Plan} from "../../../utils/plans"

export default async function changePlan(
  {instance, newPlan}: { instance: any, newPlan: Plan },
  {session}: Ctx
): Promise<void> {
  session.authorize("admin");

  let subscription = await stripe.subscriptions.retrieve(instance.subscriptionId);
  let items = [];

  subscription.items.data.forEach(item => items.push({id: item.id, deleted: true}));

  items.push({price: newPlan.priceId});

  // Update the subscription
  await stripe.subscriptions.update(
    instance.subscriptionId,
    {
      items: items,
      proration_behavior: "none"
    }
  );

  // Update the parent instance
  await db.instance.updateMany({
    where: {
      AND: [
        {userId: instance.userId},
        {id: instance.id}
      ]
    },
    data: {
      playerLimit: newPlan.playerCount,
      cost: newPlan.cost
    }
  });

  // Update the child instance
  if (newPlan.childPlan) {
    await db.instance.updateMany({
      where: {
        AND: [
          {userId: instance.userId},
          {parentId: instance.id}
        ]
      },
      data: {
        playerLimit: newPlan.childPlan.playerCount,
      }
    });
  }

  await invalidateQuery(getInstance);
}