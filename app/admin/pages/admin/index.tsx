import React, {Suspense, useState} from "react";
import {BlitzPage, useQuery} from "@blitzjs/core";
import {Card, CardHeader, Col, Container, Pagination, PaginationItem, PaginationLink, Row, Table} from "reactstrap";
import AdminLayout from "../../../layouts/AdminLayout";
import listInstances from "../../../instance/queries/listInstances";
import styled from "styled-components"
import {useRouter} from "blitz";

const PAGE_LENGTH = 6;

const InstanceTable = () => {
  const [instances] = useQuery(listInstances, {children: false, personal: false});
  const [page, setPage] = useState(0);

  return (
    <Container fluid>
      <Row xs="12">
        <Col xs="10">
          <Card className="shadow-sm">
            <CardHeader>
              <h4 className="text-uppercase text-dark mb-0">Instances</h4>
            </CardHeader>
            <div>
              <HistoryTable page={page} instances={instances}/>
              {instances.length > PAGE_LENGTH && (
                <HistoryPagination page={page} setPage={setPage} instances={instances}/>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

const PaginationButton = ({page, setPage, pages, buttons, index}: {
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
const HistoryPagination = ({page, setPage, instances}: {
  page: number
  setPage: Function
  instances: any
}) => {
  const buttons = Math.min(3, Math.ceil(instances.length / PAGE_LENGTH))

  return (
    <Pagination className="justify-content-end pagination ml-3 mr-3 mt-3 mb-2">
      <PaginationItem className={page <= 0 ? "disabled" : ""}>
        <PaginationLink aria-label="Previous" onClick={(e) => setPage(page - 1)}>
          <i className="fa fa-angle-left"/>
          <span className="sr-only">Previous</span>
        </PaginationLink>
      </PaginationItem>
      {[...Array(buttons)].map((time, index) => (
        <PaginationButton
          page={page}
          setPage={setPage}
          pages={Math.ceil(instances.length / PAGE_LENGTH)}
          index={index}
          buttons={buttons}
          key={index}
        />
      ))}
      <PaginationItem
        className={page + 1 >= Math.ceil(instances.length / PAGE_LENGTH) ? "disabled" : ""}
      >
        <PaginationLink aria-label="Next" onClick={() => setPage(page + 1)}>
          <i className="fa fa-angle-right"/>
          <span className="sr-only">Next</span>
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  )
}

const HistoryTableRow = ({instance, page, index}: { instance: any; page: number; index: number }) => {
  const createdData = new Date(instance.createdAt);
  const expiresDate = new Date(instance.expires);
  const lastPaid = new Date(instance.lastPaid);
  const router = useRouter();

  const prettifyDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  return (
    <tr onClick={async () => await router.push(`/admin/instance/${instance.id}`)}>
      <td>{instance.id}</td>
      <td>{prettifyDate(createdData)}</td>
      <td>{prettifyDate(expiresDate)}</td>
      <td>{instance.user.name}</td>
      <td>{instance.playerLimit}</td>
      <td>{instance.lastPaid ? prettifyDate(lastPaid) : "Not paid."}</td>
    </tr>
  )
}
const HistoryTable = ({instances, page}: { instances: any; page: number }) => {
  const [sort, setSort] = useState<string>("")
  const [sortDirection, setSortDirection] = useState(false)

  const Column = styled.th`
    cursor: pointer;
  `
  const SortIcon = styled.i`
    margin-left: 0.5rem;
    font-size: 0.8rem;
  `

  const changeSort = (newSort) => {
    if (newSort === sort) {
      setSortDirection(!sortDirection)
      return;
    }

    setSort(newSort)
    setSortDirection(false)
  }

  if (sort !== "") {
    instances.sort((i1, i2) => {
      switch (sort) {
        case "id":
        case "createdAt":
        case "expires":
        case "playerLimit":
          return i1[sort] - i2[sort];
        default:
          return 0;
      }
    })

    if (sortDirection) {
      instances = instances.reverse()
    }
  }

  return (
    <Table className="align-items-center" responsive>
      <thead className="thead-light">
      <tr>
        <Column scope="col" onClick={() => changeSort("id")}>
          ID
          {sort === "id" ? (
            <SortIcon
              className="fa fa-sort-up"
              style={sortDirection ? {transform: "rotate(180deg)"} : {}}
            />
          ) : (
            ""
          )}
        </Column>
        <Column scope="col" onClick={() => changeSort("createdAt")}>
          Created
          {sort === "createdAt" ? (
            <SortIcon
              className="fa fa-sort-up"
              style={sortDirection ? {transform: "rotate(180deg)"} : {}}
            />
          ) : (
            ""
          )}
        </Column>
        <Column scope="col" onClick={() => changeSort("expires")}>
          Expires
          {sort === "expires" ? (
            <SortIcon
              className="fa fa-sort-up"
              style={sortDirection ? {transform: "rotate(180deg)"} : {}}
            />
          ) : (
            ""
          )}
        </Column>
        <Column scope="col" onClick={() => changeSort("user")}>
          Owner
          {sort === "user" ? (
            <SortIcon
              className="fa fa-sort-up"
              style={sortDirection ? {transform: "rotate(180deg)"} : {}}
            />
          ) : (
            ""
          )}
        </Column>
        <Column scope="col" onClick={() => changeSort("playerLimit")}>
          Plan
          {sort === "playerLimit" ? (
            <SortIcon
              className="fa fa-sort-up"
              style={sortDirection ? {transform: "rotate(180deg)"} : {}}
            />
          ) : (
            ""
          )}
        </Column>
        <Column scope="col">Payment</Column>
      </tr>
      </thead>
      <tbody>
      {instances.length > 0 ? (
        (() => {
          return (
            <>
              {instances
                .slice(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH)
                .map((record, index) => (
                  <HistoryTableRow key={record.id} instance={record} page={page} index={index}/>
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


const Instance: BlitzPage = () => {
  return (
    <div className="header bg-gradient-blue pb-8 pt-5 pt-md-8" style={{height: "100vh"}}>
      <Suspense fallback={<></>}>
        <InstanceTable/>
      </Suspense>
    </div>
  )
}

Instance.getLayout = (element) => (
  <AdminLayout pageTitle={"Admin layout"}>{element}</AdminLayout>
)

export {getServerSideProps} from "utils/require-user"

export default Instance