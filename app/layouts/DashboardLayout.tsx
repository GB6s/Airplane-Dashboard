import Layout from "./Layout"
import Sidebar from "../components/Sidebar"
import React, { ReactNode, Suspense } from "react"
import DashboardNavbar from "../components/DashboardNavbar"

type LayoutProps = {
  pageTitle: string
  children: ReactNode
}

const DashboardLayout = ({ pageTitle, children }: LayoutProps) => (
  <Layout title={pageTitle}>
    <Sidebar />
    <div className="main-content">
      <Suspense fallback={<></>}>
        <DashboardNavbar pageTitle={pageTitle} />
      </Suspense>
      {children}
    </div>
  </Layout>
)

export default DashboardLayout
