import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { InMemoryCache, ApolloProvider, ApolloClient } from "@apollo/client"

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/vincelaird/ospex",
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
