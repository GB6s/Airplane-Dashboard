import {Ctx} from "blitz"
import db from "../../../db"

export default async function listInstances({children, personal}: {children: boolean, personal: boolean}, {session}: Ctx): Promise<string> {
  session.authorize(personal ? '' : 'admin');

  return await db.instance.findMany({
    where: {
      AND: [
        { parentId: children ? undefined : null },
        { userId: personal ? session.userId : undefined }
        ]
    },
    include: { user: true }
  });
}
