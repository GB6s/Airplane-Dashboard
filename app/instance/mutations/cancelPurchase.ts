import {Ctx} from "@blitzjs/core"
import db from "../../../db"

export default async function cancelPurchase(
  {id}: { id: number | undefined},
  {session}: Ctx
): Promise<void> {
  session.authorize();

  if(!id) {
    throw new Error("Can not cancel purchase without id")
  }

  await db.instance.deleteMany({
    where: {
      OR: [
        {id: id},
        {parentId: id},
      ]
    },
  });
}