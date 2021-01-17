import {Ctx} from "@blitzjs/core"
import db from "../../../db"

export default async function updateInstanceName(
  {id, name}: { id: number, name?: string },
  {session}: Ctx
): Promise<void> {
  session.authorize();

  if(!name || !id) {
    return;
  }

  await db.instance.updateMany({
    where: {
      AND: [
        {userId: session.userId},
        {id: id},
      ]
    },
    data: {name: name}
  });
}