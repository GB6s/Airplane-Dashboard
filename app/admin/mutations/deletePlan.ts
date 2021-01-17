import {Ctx, invalidateQuery} from "@blitzjs/core"
import db from "../../../db"
import listInstances from "../../instance/queries/listInstances";

export default async function deletePlan(
  {instance} : {instance : any},
  {session}: Ctx
): Promise<void> {
  session.authorize("admin");

  // TODO: Issue with removing child instance
  await db.instance.deleteMany({
    where: {
      AND: [
        {userId: instance.userId},
        {parentId: instance.id}
      ]
    }
  });

  await db.instance.deleteMany({
    where: {
      AND: [
        {userId: instance.userId},
        {id: instance.id}
      ]
    }
  });

  await invalidateQuery(listInstances);
}