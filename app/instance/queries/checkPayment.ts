import {Ctx} from "@blitzjs/core"
import db from "../../../db"
import stripe from "../../../utils/stripe"

export default async function checkPayment(
  instanceId: number | undefined,
  {session}: Ctx
): Promise<{ paid: boolean; link: string | null | undefined }> {
  session.authorize();

  if (!instanceId) {
    throw new Error("No instance id provided");
  }

  const {subscriptionId} = await db.instance.findFirst({
    where: {
      AND: [{userId: session.userId}, {id: instanceId}]
    },
    select: {subscriptionId: true},
  });


  if (!subscriptionId) {
    throw new Error("Could not find the subscription.")
  }

  let subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["latest_invoice"]
  });

  let {latest_invoice} = subscription;

  if (latest_invoice.status === "draft") {
    await stripe.invoices.finalizeInvoice(latest_invoice.id);
    latest_invoice = await stripe.invoices.retrieve(latest_invoice.id);
  }

  if (latest_invoice.status === "paid") {
    let lastPaid = new Date(latest_invoice.status_transitions.paid_at * 1000);

    await db.instance.updateMany({
      where: {
        AND: [{userId: session.userId}, {id: instanceId}]
      },
      data: {lastPaid: lastPaid}
    })
  }

  return {paid: latest_invoice.status === "paid", link: latest_invoice.hosted_invoice_url};
}