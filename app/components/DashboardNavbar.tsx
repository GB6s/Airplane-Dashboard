import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Nav,
  Navbar,
  UncontrolledDropdown,
} from "reactstrap"
import {Link, useSession} from "@blitzjs/core"
import {useCurrentUser} from "../hooks/useCurrentUser"
import {useMutation} from "blitz"
import logout from "../auth/mutations/logout"
import React from "react";

const DashboardNavbar = ({pageTitle}: { pageTitle: string }) => {
  const user = useCurrentUser();
  const session = useSession();

  return (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Container fluid>
        <PageTitle title={pageTitle}/>
        <Nav className="align-items-center d-none ml-auto d-md-flex" navbar>
          <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
              <Media className="align-items-center">
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    {user ? user.name || user.email : ""}
                  </span>
                </Media>
                <span className="avatar avatar-sm rounded-circle ml-3">
                  <img width="36" src={session.avatar} alt=""/>
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome {user ? user.name : ""}!</h6>
              </DropdownItem>
              <AdminItem/>
              <DropdownItem divider/>
              <LogoutItem/>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}

const PageTitle = ({title}: { title: string }) => {
  return (
    <Link href="/">
      <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block">
        {title}
      </a>
    </Link>
  )
}

const AdminItem = () => {
  const session = useSession();

  if (!session.roles.includes("admin")) {
    return <div/>
  }

  return (
    <Link href={'/admin'}>
      <DropdownItem>
        <i className="ni ni-user-run"/>
        <span>Admin</span>
      </DropdownItem>
    </Link>
  )
}

const LogoutItem = () => {
  const [_logout] = useMutation(logout);

  const onClick = async () => {
    await _logout();
    window.location.reload()
  }

  return (
    <DropdownItem onClick={onClick}>
      <i className="ni ni-user-run"/>
      <span>Logout</span>
    </DropdownItem>
  )
}

export default DashboardNavbar
