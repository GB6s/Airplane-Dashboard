import {Ctx} from "blitz"
import db from "../../../db"

export default async function hasPendingPayment(_: null, {session}: Ctx): Promise<number | undefined> {
  session.authorize();

  const response = await db.instance.findMany({
    where: {
      AND: [
        {userId: session.userId},
        {parentId: null}
      ]
    },
    select: {id: true, lastPaid: true},
  });

  return response.find((item) => item.lastPaid === null)?.id;
}

