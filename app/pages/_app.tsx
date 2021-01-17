import {AppProps, ErrorComponent, useRouter, useSession} from "blitz"
import {ErrorBoundary, FallbackProps} from "react-error-boundary"
import {queryCache} from "react-query"

// import "argon-dashboard-react/src/assets/vendor/nucleo/css/nucleo.css";
// import "argon-dashboard-react/src/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "argon-dashboard-react/src/assets/scss/argon-dashboard-react.scss"
import "@fortawesome/fontawesome-free/css/all.css"
import "./styles.scss"

export default function App({Component, pageProps}: AppProps) {
  const session = useSession()
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}

function RootErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  if (error?.name === "AuthorizationError") {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    )
  }
}
