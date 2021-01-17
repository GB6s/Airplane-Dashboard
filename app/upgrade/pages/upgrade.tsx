import {useMutation} from "@blitzjs/core"
import DashboardLayout from "../../layouts/DashboardLayout"
import React, {ReactNode, Suspense, useState} from "react"
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap"
import plans, {Plan} from "../../../utils/plans"
import styles from "./upgrade.module.css"
import validateCoupon from "../mutations/validateCoupon";
import {BlitzPage, useQuery, useRouter} from "blitz";
import createInvoice from "../mutations/createInvoice";
import hasPendingPayment from "../queries/hasPendingPayment";

const PendingPayment = ({pending}: { pending: number }) => {
  const Router = useRouter();

  return (
    <Card>
      <CardBody>
        <CardTitle>Warning!</CardTitle>
        <CardText>
          You have a plan which is awaiting payment.
          You need to finish payment or cancel the plan before you can continue.
        </CardText>
        <Button color="success" onClick={() => Router.push(`/instance/${pending}`)}>Finish payment</Button>
      </CardBody>
    </Card>
  )
}

const Feature = ({supported, children}: { supported: boolean; children: ReactNode }) => (
  <div className={styles.feature}>
    <i className="fa fa-check" style={{color: "green"}}/>
    <div>{children}</div>
  </div>
)

const PlanComponent = ({plan, onPurchase, pending}: { plan: Plan; onPurchase: () => void, pending: boolean }) => {
  return (
    <Card body>
      <h1 className={styles.planTitle}>{plan.playerCount} Player Plan</h1>
      <h2>${plan.cost}.00/year</h2>
      <hr/>

      {plan.features.map((feature, index) => (
        <Feature supported key={index}>
          {feature}
        </Feature>
      ))}

      <div style={{height: "2rem"}}/>
      <Button color="success" disabled={pending} onClick={onPurchase}>
        {pending ? <del>Purchase</del> : "Purchase"}
      </Button>
    </Card>
  )
}

const Plans = ({setPlan}: { setPlan: (plan: Plan) => void }) => {
  const [pending] = useQuery(hasPendingPayment, null);

  return (
    <Container fluid>
      <Row>
        {plans
          .filter((plan) => plan.offered)
          .map((plan) => (
            <Col md={3} key={plan.id}>
              <PlanComponent plan={plan} onPurchase={() => setPlan(plan)} pending={pending !== undefined}/>
            </Col>
          ))}
      </Row>
      <Row>
        {pending ? <PendingPayment pending={pending}/> : <div/>}
      </Row>
    </Container>
  )
}

type Coupon = {
  input: string,
  message: string,
  id: string
}

const StartPurchase = ({plan, completePurchase}: {
  plan: Plan
  completePurchase: (coupon: string | undefined) => void
}) => {
  const [_validateCoupon] = useMutation(validateCoupon);
  const [coupon, setCoupon] = useState<Coupon>({input: "", id: "", message: ""});

  const validate = async () => {
    if (!coupon) {
      setCoupon({id: "", input: coupon.input, message: "No code entered."});
      return;
    }

    let validatedCoupon = await _validateCoupon({couponId: coupon.input});

    if (validatedCoupon === undefined) {
      setCoupon({id: "", input: "", message: "Unknown coupon."});
      return;
    }

    setCoupon({
      id: validatedCoupon.id,
      input: "",
      message: "Known coupon - amount off: " + (validatedCoupon.amount_off / 100) + " dollars."
    });
  }

  return (
    <Card>
      <p>Are you sure you'd like to buy the {plan.playerCount} plan?</p>
      <Form>
        <FormGroup>
          <Label for="coupon">Coupon</Label>
          <Input
            type="text"
            name="coupon"
            placeholder="Optional"
            value={coupon.input}
            onChange={(e) => setCoupon({id: coupon.id, input: e.target.value, message: coupon.message})}/>
          {coupon.message ? <div>{coupon.message}</div> : null}
        </FormGroup>
        <Button onClick={validate}>Validate Coupon</Button>
        <Button onClick={() => completePurchase(coupon.id)}>Confirm purchase</Button>
      </Form>
    </Card>
  )
}

const UpgradeContents = () => {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  const [_completePurchase] = useMutation(createInvoice);

  const chargePayment = async coupon => {
    setConfirmed(true);
    try {
      const instanceId = await _completePurchase({plan: plan!, couponId: coupon || undefined});
      await router.push(`/instance/${instanceId}`);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!plan) {
    return <Plans setPlan={setPlan}/>
  } else if (!confirmed) {
    return <StartPurchase plan={plan} completePurchase={chargePayment}/>
  } else if (error) {
    return <p>An error occurred: {error}</p>
  } else {
    return <p>Loading..</p>
  }
}

const Upgrade: BlitzPage = () => {
  return (
    <div className="header bg-gradient-blue pb-8 pt-5 pt-md-8" style={{height: "100vh"}}>
      <Suspense fallback={<></>}>
        <UpgradeContents/>
      </Suspense>
    </div>
  )
}

Upgrade.getLayout = (element) => (
  <DashboardLayout pageTitle={"Add/Upgrade Instances"}>{element}</DashboardLayout>
)

export {getServerSideProps} from "utils/require-user"

export default Upgrade
