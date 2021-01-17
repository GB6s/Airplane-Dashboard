import {Nav, Navbar, NavbarBrand, NavItem, NavLink} from "reactstrap"
import {useQuery, useRouter} from "@blitzjs/core"
import React, {Suspense} from "react"
import {ErrorBoundary} from "react-error-boundary";
import listInstances from "../instance/queries/listInstances";

const FullNavLink = ({href, children}) => {
  const router = useRouter();

  return (
    <NavItem>
      <NavLink active={router.asPath === href} href={href}>
        {children}
      </NavLink>
    </NavItem>
  )
}

const Sidebar = () => {
  return (
    <Navbar className="navbar-vertical fixed-left bg-white" light expand="md">
      <NavbarBrand href={"/"}>AIRPLANE.GG</NavbarBrand>
      <Nav className="mr-auto" navbar>
        <FullNavLink href={"/"}>
          <i className="fas fa-plane-departure"/>
          Home
        </FullNavLink>
        <FullNavLink href={"/billing"}>
          <i className="fas fa-cubes"/>
          Billing
        </FullNavLink>
        <hr className="my-3"/>
        <h6 className="navbar-heading text-muted text-center">Instances</h6>

        <ErrorBoundary fallback={(error) => <div>Error: {JSON.stringify(error)}</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <Instances/>
          </Suspense>
        </ErrorBoundary>

        <FullNavLink href={"/upgrade"}>
          <i className="fas fa-plus"/>
          Create Instance
        </FullNavLink>
      </Nav>
    </Navbar>
  )
}

const Instances = () => {
  const [instances] = useQuery(listInstances, {children: false, personal: true});

  return instances.map(i =>
    <FullNavLink href={`/instance/${i.id}`} key={i.apiKey}>
      <i className="fas fa-minus"/>
      Instance {i.name || i.apiKey.substring(0, 4)}
    </FullNavLink>
  );
}

export default Sidebar
