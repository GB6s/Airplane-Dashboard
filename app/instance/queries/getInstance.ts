import {Ctx} from "@blitzjs/core"
import db from "../../../db"

export default async function getInstance(
  instanceId: number | undefined, {session}: Ctx
): Promise<Object> {
  session.authorize();

  if(!instanceId) {
    throw new Error("No instance id provided")
  }

  return await db.instance.findFirst({
    where: {
      AND: [
        {id: instanceId},
        {userId: session.userId},
      ]
    },
    include: {user: true}
  });
}