import {Ctx} from "blitz"
import db from "../../../db"

export default async function fetchFirstBillable(_: null, {session}: Ctx): Promise<any> {
  session.authorize();

  const instances = await db.instance.findMany({
    where: {
      userId: session.userId
    }
  });

  if(instances.length == 0) {
    return undefined;
  }

  return instances.sort((a, b) => new Date(a.expires) - new Date(b.expires))[0];
}
