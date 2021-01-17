import React, {Suspense, useState} from "react";
import {BlitzPage, invalidateQuery, useMutation, useParam, useQuery} from "@blitzjs/core";
import {
  Button,
  Card,
  CardSubtitle,
  CardText,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row
} from "reactstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import getInstance from "../../../../instance/queries/getInstance";
import plans, {Plan} from "../../../../../utils/plans"
import changePlan from "../../../mutations/changePlan";
import confirm from "reactstrap-confirm";
import deletePlan from "../../../mutations/deletePlan";
import {useRouter} from "blitz";

const InstanceContent = () => {
  const instanceId = useParam("instance", "number");
  const [instance] = useQuery(getInstance, instanceId);

  return (
    <Card>
      <CardTitle>Instance information</CardTitle>
      <CardSubtitle>Owned by {instance.user.name}</CardSubtitle>
      <CardText>Current plan: {instance.playerLimit}</CardText>
      <Row>
        <ChangePlanDropDown instance={instance}/>
        <CancelPlan instance={instance}/>
      </Row>
    </Card>
  )
}

const CancelPlan = ({instance}) => {
  const [_deletePlan] = useMutation(deletePlan);
  const Router = useRouter();

  const onCancel = async () => {
    let result = await confirm();

    if (result) {
      await _deletePlan({instance: instance});
      await Router.push("/admin");
    }
  }

  return (
    <Button color="danger" onClick={() => onCancel()}>Cancel Plan</Button>
  )
}

const ChangePlanDropDown = ({instance}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        Change Plan
      </DropdownToggle>
      <DropdownMenu>
        {plans
          .filter((plan) => plan.offered)
          .map((plan) => (
            <ChangePlanItem plan={plan} instance={instance}/>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}

const ChangePlanItem = ({plan, instance}: { plan: Plan, instance: any }) => {
  const active = plan.playerCount === instance.playerLimit;
  const [_changePlan] = useMutation(changePlan);

  const onChange = async () => {
    let result = await confirm();

    if (result) {
      await _changePlan({instance: instance, newPlan: plan});
      await invalidateQuery(getInstance);
    }
  }

  return (
    <DropdownItem active={active} onClick={onChange}>
      {plan.playerCount} Player Plan {active ? "(active)" : ""}
    </DropdownItem>
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
  <AdminLayout pageTitle={"Administer instance"}>{element}</AdminLayout>
)

export {getServerSideProps} from "utils/require-user"

export default Instance