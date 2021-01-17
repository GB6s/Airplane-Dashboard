import DashboardLayout from "../../../layouts/DashboardLayout";
import React, {Suspense, useState} from "react";
import {BlitzPage, invalidateQuery, useMutation, useParam, useQuery} from "@blitzjs/core";
import checkPayment from "../../queries/checkPayment"
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import getInstance from "../../queries/getInstance";
import updateInstanceName from "../../mutations/updateInstanceName";
import cancelPurchase from "../../mutations/cancelPurchase";
import {useRouter} from "blitz";
import listInstances from "../../queries/listInstances";
import MetricsPlot from "../../../components/MetricsPlot";

const PlotSection = ({instanceId, metric}) => {
  return (
    <div className="pt-md-8" style={{height: '500px'}}>
      <Container fluid>
        <MetricsPlot
          queryParameters={{
            apiKeys: [instanceId],
            fields: [metric],
            window: '5s'
          }}
          style={{
            header: 'Overview',
            title: metric.toUpperCase(),
            dimensions: {
              width: "calc(35vw - 20px)",
              height: "calc(30vh - 20px)",
              margin: "10px",
            }
          }}
        />
      </Container>
    </div>
  )
}

const InstanceContent = () => {
  const instanceId = useParam("instance", "number");
  const [{paid, link}] = useQuery(checkPayment, instanceId)
  const [_cancelPurchase] = useMutation(cancelPurchase);
  const router = useRouter();

  const cancel = async () => {
    await _cancelPurchase({id: instanceId});
    await router.push(`/upgrade`);
  }

  if (paid) {
    return <InstanceInformation instanceId={instanceId}/>
  }

  return (
    <Card>
      <div>
        <p>You have not yet paid the invoice.</p>
        <p>You can pay the invoice here:</p>
        <a href={link} target="_blank">Link to invoice</a>
      </div>
      <Button color="danger" onClick={cancel}>Cancel</Button>
    </Card>
  )
}

const InstanceInformation = ({instanceId}: { instanceId: number }) => {
  const [instance] = useQuery(getInstance, instanceId);
  const [_updateInstanceName] = useMutation(updateInstanceName);

  const [name, setName] = useState<string | undefined>();

  return (
    <div>
      <Card>
        <CardTitle>{instance.playerLimit} Player Plan</CardTitle>
        <CardSubtitle>API key: {instance.apiKey}</CardSubtitle>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="name">Naming</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter a name for your instance"
                value={name}
                onChange={(e) => setName(e.target.value)}/>
            </FormGroup>
            <Button onClick={async () => {
              setName('');
              await _updateInstanceName({name: name, id: instanceId});
              await invalidateQuery(listInstances);
            }}>Submit name</Button>
          </Form>
        </CardBody>
      </Card>
      <Row>
        <PlotSection instanceId={instanceId} metric={'tps'}/>
        <PlotSection instanceId={instanceId} metric={'player_count'}/>
      </Row>
    </div>
  )
}

const Instance: BlitzPage = () => {
  return (
    <div className="header bg-gradient-blue pb-8 pt-5 pt-md-8" style={{height: "100vh"}}>
      <Suspense fallback={<></>}>
        <InstanceContent/>
      </Suspense>
    </div>
  )
}

Instance.getLayout = (element) => (
  <DashboardLayout pageTitle={"View instance"}>{element}</DashboardLayout>
)

export {getServerSideProps} from "utils/require-user"

export default Instance