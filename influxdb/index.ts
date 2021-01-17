const {InfluxDB} = require('@influxdata/influxdb-client')
export const {INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET, INFLUX_URL} = process.env;

if(!INFLUX_TOKEN || !INFLUX_ORG || !INFLUX_BUCKET || !INFLUX_URL) {
  throw new Error("Influx environment variables not set.");
}

const client = new InfluxDB({url: INFLUX_URL, token: INFLUX_TOKEN})

export const createInfluxWrite = () => client.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
export const createInfluxQuery = () => client.getQueryApi(INFLUX_ORG);
