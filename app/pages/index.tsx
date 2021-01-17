import {BlitzPage} from "blitz"
import {Col, Container, Row,} from "reactstrap"
import DashboardLayout from "../layouts/DashboardLayout"
import React from "react"
import MetricsPlot from "../components/MetricsPlot";

const ChartView = () => {
  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" style={{height: '500px'}}>
      <Container fluid>
        <MetricsPlot
          queryParameters={{
            fields: ['player_count'],
            updateIntervalSeconds: 60,
            window: '5s'
          }}
          style={{
            header: 'Overview',
            title: 'Player Count',
            dimensions: {
              width: "calc(70vw - 20px)",
              height: "calc(30vh - 20px)",
              margin: "10px",
            }
          }}
        />
      </Container>
    </div>
  )
}

const News = () => {
  return (
    <Col md={4}>
      <h1>News</h1>
      <hr/>
      <p>
        Have you joined the Discord yet? In the Discord we frequently release announcements,
        updates, and previews!
      </p>
    </Col>
  );
}

const DiscordWidget = () => {
  return (
    <Col md={3}>
      <iframe
        src="https://discordapp.com/widget?id=748023548467216394&theme=dark"
        width="100%"
        height="500"
        frameBorder="0"
        title="Discord"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </Col>
  );
}

const Home: BlitzPage = () => {
  return (
    <>
      <ChartView/>
      <div style={{height: "150px"}}/>
      <Container fluid>
        <Row>
          <Col md={2}/>
          <News/>
          <Col md={1}/>
          <DiscordWidget/>
          <Col md={2}/>
        </Row>
      </Container>
    </>
  )
}

Home.getLayout = (page) => <DashboardLayout pageTitle="Home">{page}</DashboardLayout>

export {getServerSideProps} from "utils/require-user"

export default Home
