import {invalidateQuery, useQuery} from "@blitzjs/core";
import {Plot} from '@influxdata/giraffe'
import React, {useEffect} from "react";
import queryMetrics, {QueryParameters} from "../instance/queries/queryMetrics";
import {query} from "express";

// Use this when styling the plot
const sampleFluxResponse = `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,true,true,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,example,location
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:31:33.95Z,30,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:55:23.863Z,25,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T20:50:52.357Z,20,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T21:53:37.198Z,26,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T22:53:53.033Z,24,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T23:19:21.88Z,28,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T24:20:40.776Z,24,value,temperature,index.html,browser
`

const lineLayer = {
  type: "line",
  x: "_time",
  y: "_value",
  interpolation: "natural"
}

const config = {
  layers: [lineLayer],
  gridOpacity: 0,
  showAxes: false,
  cursor: "default",
}

const MetricsPlotBody = ({queryParameters, period}: {queryParameters: QueryParameters}) => {
  const [fluxResponse] = useQuery(queryMetrics, queryParameters);

  config.fluxResponse = sampleFluxResponse;
  queryParameters.start = period;

  if (queryParameters.updateIntervalSeconds) {
    useEffect(() => {
      const id = setInterval(async () => await invalidateQuery(queryMetrics), queryParameters.updateIntervalSeconds * 1000);
      return () => clearInterval(id);
    });
  }

  return (
    <Plot config={config}/>
  )
}

export default MetricsPlotBody