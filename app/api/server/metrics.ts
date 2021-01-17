import db from '../../../db'
import {createInfluxWrite} from '../../../influxdb'
import {Point} from "@influxdata/influxdb-client";


export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await handlePost();
      break;
    case "GET":
      await handleGet();
      break;
    default:
      res.statusCode = 405;
      res.end();
  }

  /*
  GET /api/server/metrics
  {
    "key": "abcdefghi",
    "start": 1610382555334,
    "end": 1610382555334,
    "data_points": 30
  }

  Response:
  {}
  */

  //TODO: Possible GET implementation
  async function handleGet() {
    res.statusCode = 405;
    res.end();
  }


  /*
  POST /api/server/metrics
  {
    "key": "abcdefghi",
    "time_stamp": "1609843526294"
    "data": {
      "tps": 20,
      "player_count": 24,
      "entity_count": 2000,
      "total_chunk_count": 200,
      "inactive_chunk_count": 40,
      "tile_entity_count": 20,
      "total_memory_usage": 1024,
      "current_memory_usage": 512,
      "cpu_usage": 20,
      "gc_event": undefined,
      "server_version": 15
    }
  }

  Response:
  {}
  */
  async function handlePost() {
    const writeApi = createInfluxWrite();
    let key = req.body.key;

    if (!key) {
      res.statusCode = 400;
      res.end();
      return;
    }

    let {id} = await db.instance.findFirst({
      where: {apiKey: key},
      select: {id: true}
    });

    if (id === undefined) {
      res.statusCode = 403;
      res.end();
      return;
    }

    let {data} = req.body;

    let point = new Point('server')
      .tag('id', id)
      .intField('player_count', data.player_count)
      .intField('tps', data.tps)
      .intField('entity_count', data.entity_count)
      .intField('total_chunk_count', data.total_chunk_count)
      .intField('inactive_chunk_count', data.inactive_chunk_count)
      .intField('tile_entity_count', data.tile_entity_count)
      .intField('total_memory_usage', data.total_memory_usage)
      .intField('current_memory_usage', data.current_memory_usage)
      .intField('cpu_usage', data.cpu_usage)
      .intField('gc_event', data.gc_event)
      .intField('server_version', data.server_version)

    if(req.body.time_stamp) {
      point.timestamp(req.body.time_stamp);
    }

    writeApi.writePoint(point);

    writeApi
      .close()
      .catch(e => {
        console.log(e);
        res.statusCode = 500;
        res.end();
      });

    res.statusCode = 200;
    res.end();
  }
}