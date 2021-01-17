import React, {Suspense, useState} from "react"
import {Card, CardBody, CardHeader, Nav, NavItem, NavLink, Row, Spinner} from "reactstrap";
import {QueryParameters} from "../instance/queries/queryMetrics";
import classnames from "classnames";
import {dynamic} from "@blitzjs/core";

export interface MetricsPlotConfig {
  queryParameters: QueryParameters,
  style: MetricsPlotStyle,
}

export interface MetricsPlotStyle {
  header: string,
  title: string,
  dimensions: {
    width: string,
    height: string,
    margin: string
  }
}

const MetricsPlotBodyNoSSRWrapper = dynamic(
  () => import('./MetricsPlotBody'),
  {ssr: false, loading: () => <p>Loading ...</p>},
)

const MetricsPlot = (config: MetricsPlotConfig) => {
  const [period, setPeriod] = useState<string>('-1d');

  return (
    <Card className="bg-gradient-default shadow">
      <CardHeader className="bg-transparent">
        <Row className="align-items-center">
          <div className="col">
            <h6 className="text-uppercase text-light ls-1 mb-1">{config.style.header}</h6>
            <h2 className="text-white mb-0">{config.style.title}</h2>
          </div>
          <div className="col">
            <PeriodPills queryParameters={config.queryParameters} setPeriod={setPeriod}/>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        <div style={config.style.dimensions}>
          <Suspense fallback={<Spinner/>}>
            <MetricsPlotBodyNoSSRWrapper queryParameters={config.queryParameters} period={period}/>
          </Suspense>
        </div>
      </CardBody>
    </Card>
  )
}

const PeriodPills = ({setPeriod}) => {
  const [activePeriod, setActivePeriod] = useState<string>('today');

  const setActive = async (period) => {
    switch (period) {
      case 'today':
        setPeriod('-1d');
        break;
      case 'this-week':
        setPeriod('-7d');
    }

    setActivePeriod(period);
  }

  return (
    <Nav className="justify-content-end" pills>
      <PeriodPill
        activePeriod={activePeriod}
        setActivePeriod={setActive}
        period={'today'}/>
      <PeriodPill
        activePeriod={activePeriod}
        setActivePeriod={setActive}
        period={'this-week'}/>
    </Nav>
  )
}

const PeriodPill = ({activePeriod, setActivePeriod, period}) => {
  const sanitized = period.replace(/\b\w/g, l => l.toUpperCase()).replace('-', ' ');

  return (
    <NavItem>
      <NavLink
        className={classnames("py-2 px-3", {
          active: activePeriod === period,
        })}
        href="#"
        onClick={(e) => {
          e.preventDefault()
          setActivePeriod(period);
        }}
      >
        <span className="d-none d-md-block">{sanitized}</span>
      </NavLink>
    </NavItem>
  )
}

export default MetricsPlot
