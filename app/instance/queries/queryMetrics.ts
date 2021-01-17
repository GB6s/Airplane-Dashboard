import {Ctx} from "@blitzjs/core"
import {createInfluxQuery, INFLUX_BUCKET} from "../../../influxdb";
import db from "../../../db";

export interface QueryParameters {
  updateIntervalSeconds?: number,
  start?: string,
  stop?: string,
  window?: string,
  fields: [string],
  ids?: [number]
}

export default async function queryMetrics(
  {
    // The time from where to start from, e.g. "-5h"
    start = '-1d',
    // The time from where to stop, e.g. "-1h"
    stop = 'now()',
    // The window of the query
    window = '5m',
    // Fields to query for, e.g. player_count
    fields,
    // If this array is empty, all ids associated with the user will be queried.
    ids = []
  }: QueryParameters,
  {session}: Ctx
): Promise<string | undefined> {
  session.authorize();

  const queriedIds = (await db.instance.findMany({
    where: {
      userId: session.userId,
      parentId: null,
    },
    select: {id: true}
  })).map(obj => obj.id.toString());

  ids = ids.length == 0 ? queriedIds : queriedIds.filter(val => queriedIds.includes(val));

  if (ids.length == 0) {
    return undefined;
  }

  // TODO: SQL Injection?
  const fluxQuery =
    `from(bucket:"${INFLUX_BUCKET}")
    |> range(
      start: ${start},
      stop: ${stop}
    )
    |> filter(fn: (r) =>
      r._measurement == "server" and
      contains(value: r.id, set:${JSON.stringify(ids)}) and
      contains(value: r._field, set:${JSON.stringify(fields)})
    )
    |> window(every: ${window})
    |> unique(column: "id")
    |> drop(columns: ["id"])
    |> sum()
    |> duplicate(column: "_stop", as: "_time")`;

  let output = await createInfluxQuery().collectLines(fluxQuery);

  return output.join("\n");
}