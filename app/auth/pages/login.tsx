import React from "react"
import {BlitzPage, useRouterQuery} from "blitz"
import Layout from "app/layouts/Layout"

const LoginPage: BlitzPage = () => {
  const query = useRouterQuery()

  return (
    <div>
      {query.authError && <p>{query.authError}</p>}
      <a href="/api/auth/discord">Log In With Discord</a>
    </div>
  )
}

LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
