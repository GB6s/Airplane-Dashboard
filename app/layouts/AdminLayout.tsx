import Layout from "./Layout"
import React, {ReactNode, Suspense} from "react"
import DashboardNavbar from "../components/DashboardNavbar"

type LayoutProps = {
  pageTitle: string
  children: ReactNode
}

const AdminLayout = ({pageTitle, children}: LayoutProps) => (
  <Layout title={pageTitle}>
    <div className="main-content">
      <Suspense fallback={<></>}>
        <DashboardNavbar pageTitle={pageTitle}/>
      </Suspense>
      {children}
    </div>
  </Layout>
)

export default AdminLayout
