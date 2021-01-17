import { GetServerSideProps } from "blitz"
import { getSessionContext } from "@blitzjs/server"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSessionContext(req, res)
  if (!session.userId) {
    res.writeHead(302, { location: "/login" }).end()
    return { props: {} }
  }
  return { props: {} }
}
