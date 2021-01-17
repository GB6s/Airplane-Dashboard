import {BlitzPage, useQuery} from "@blitzjs/core"
import React, {Suspense, useState} from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap"
import fetchPastPayments from "../queries/fetchPastPayments"
import styled from "styled-components"
import fetchFirstBillable from "../queries/fetchFirstBillable";

const STATUS_MAP: { [key: string]: string } = {
  succeeded: "success",
  pending: "warning",
  failed: "danger",
}
const PAGE_LENGTH = 6;

const HistoryPaginationButton = ({page, setPage, pages, buttons, index}: {
  page: number
  setPage: Function
  pages: number
  buttons: number
  index: number
}) => {
  let displayPage = page + index
  if (page === pages - 1 && buttons > 2) {
    displayPage--
  } else if (page <= 1) {
    displayPage = index + 1
  }

  return (
    <PaginationItem className={page === displayPage - 1 ? "active" : ""}>
      <PaginationLink onClick={() => setPage(displayPage - 1)}>{displayPage}</PaginationLink>
    </PaginationItem>
  )
}
const HistoryPagination = ({page, setPage, payments}: {
  page: number,
  setPage: Function,
  payments: any,
}) => {
  const buttons = Math.min(3, Math.ceil(payments.length / PAGE_LENGTH))

  return (
    <Pagination className="justify-content-end pagination ml-3 mr-3 mt-3 mb-2">
      <PaginationItem className={page <= 0 ? "disabled" : ""}>
        <PaginationLink aria-label="Previous" onClick={(e) => setPage(page - 1)}>
          <i className="fa fa-angle-left"/>
          <span className="sr-only">Previous</span>
        </PaginationLink>
      </PaginationItem>
      {[...Array(buttons)].map((time, index) => (
        <HistoryPaginationButton
          page={page}
          setPage={setPage}
          pages={Math.ceil(payments.length / PAGE_LENGTH)}
          index={index}
          buttons={buttons}
          key={index}
        />
      ))}
      <PaginationItem className={page + 1 >= Math.ceil(payments.length / PAGE_LENGTH) ? "disabled" : ""}>
        <PaginationLink aria-label="Next" onClick={(e) => setPage(page + 1)}>
          <i className="fa fa-angle-right"/>
          <span className="sr-only">Next</span>
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  )
}

const HistoryTableRow = ({record, page, index}: {
  record: any,
  page: number,
  index: number,
}) => {
  const date = new Date(record.created)

  return (
    <tr>
      <td>{1 + index + page * PAGE_LENGTH}</td>
      <td>{record.balance_transaction}</td>
      <td>
        {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}
      </td>
      <td>
        <Badge color={STATUS_MAP[record.status]} onClick={(e) => e.preventDefault()}>
          {record.status}
        </Badge>
      </td>
      <td>
        {(record.amount / 100).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          style: "currency",
          currency: record.currency,
        })}{" "}
        {record.currency.toUpperCase()}
      </td>
      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle
            className="btn-icon-only text-light"
            role="button"
            size="sm"
            color=""
            onClick={(e) => e.preventDefault()}
          >
            <i className="fas fa-ellipsis-v"/>
          </DropdownToggle>
        </UncontrolledDropdown>
      </td>
    </tr>
  )
}

const Column = styled.th`
    cursor: pointer;
  `
const SortIcon = styled.i`
    margin-left: 0.5rem;
    font-size: 0.8rem;
  `

const HistoryTable = ({payments, page}: { payments: any; page: number }) => {
  const [sort, setSort] = useState<string>("")
  const [sortDirection, setSortDirection] = useState(false)

  const changeSort = (newSort) => {
    if (newSort === sort) {
      setSortDirection(!sortDirection)
      return;
    }

    setSort(newSort)
    setSortDirection(false)
  }

  if (sort !== "") {
    payments.sort((record1, record2) => {
      if (sort === "created" || sort === "amount") {
        return record1[sort] - record2[sort]
      } else if (sort === "status") {
        return record1.status.localeCompare(record2.status)
      }
      return 0
    });

    if (sortDirection) {
      payments = payments.reverse()
    }
  }

  const ColumnItem = ({name, sorted}: { name: string, sorted: boolean }) => {
    return (
      <Column scope="col" onClick={sorted ? () => changeSort(name) : () => {
      }}>
        {name}
        {sort === name ? (
          <SortIcon
            className="fa fa-sort-up"
            style={sortDirection ? {transform: "rotate(180deg)"} : {}}
          />
        ) : <div/>}
      </Column>
    );
  }

  return (
    <Table className="align-items-center" responsive>
      <thead className="thead-light">
      <tr>
        <th scope="col">No.</th>
        <th scope="col">Transaction ID</th>
        <ColumnItem name={"created"} sorted={true}/>
        <ColumnItem name={"status"} sorted={true}/>
        <ColumnItem name={"amount"} sorted={true}/>
        <th scope="col"/>
      </tr>
      </thead>
      <tbody>
      {payments.length > 0 ? (
        (() => {
          return (
            <>
              {payments
                .slice(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH)
                .map((record, index) => (
                  <HistoryTableRow key={record.id} record={record} page={page} index={index}/>
                ))}
            </>
          )
        })()
      ) : (
        <tr>
          <td colSpan={6} align="center" className="pl-4 pr-4 pb-8 pt-5 lead">
            <p>No history.</p>
          </td>
        </tr>
      )}
      </tbody>
    </Table>
  )
}

const LastPaymentCard = () => {
  const [firstBillable] = useQuery(fetchFirstBillable, null);

  const content = () => {
    if (!firstBillable) {
      return (
        <p>You haven't signed up for a plan yet, please visit our plans page to purchase one.</p>
      );
    }

    let date = new Date(firstBillable.expires);
    let now = Date.now();

    if (date <= now) {
      return (
        <p>
          It looks like your previous plan expired on {date.getMonth()}/
          {date.getDate()}/{date.getFullYear()} and we're still waiting to receive
          another payment before re-activating your plan.
        </p>
      );
    }

    let daysDue = Math.ceil((date - now) / (1000 * 3600 * 24));

    if(daysDue > 30) {
      return (
        <p>
          You are all set for this month!
        </p>
      )
    }

    return (
      <p>
        It looks like you have an upcoming payment due within
        <strong>
          {daysDue}
        </strong>
        day(s).
      </p>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <h4 className="text-uppercase text-dark mb-0">Next payment info</h4>
      </CardHeader>
      <CardBody>
        {content()}
      </CardBody>
    </Card>
  )
}

const BillingBody = () => {
  const [page, setPage] = useState(0);
  const [payments] = useQuery(fetchPastPayments, null);

  return (
    <Container fluid>
      <Row xs="12">
        <Col xs="8">
          <Card className="shadow-sm">
            <CardHeader>
              <h4 className="text-uppercase text-dark mb-0">Payment History</h4>
            </CardHeader>
            <div>
              <HistoryTable page={page} payments={payments.data}/>
              {payments.data.length > PAGE_LENGTH && (
                <HistoryPagination page={page} setPage={setPage} payments={payments.data}/>
              )}
            </div>
          </Card>
        </Col>
        <Col xs="4">
          <LastPaymentCard/>
        </Col>
      </Row>
    </Container>
  )
}

const Billing: BlitzPage = () => {
  return (
    <div className="header bg-gradient-green pb-8 pt-5 pt-md-8" style={{height: "500px"}}>
      <Suspense fallback={<></>}>
        <BillingBody/>
      </Suspense>
    </div>
  )
}

Billing.getLayout = (element) => <DashboardLayout pageTitle={"Billing"}>{element}</DashboardLayout>

export {getServerSideProps} from "utils/require-user"

export default Billing
