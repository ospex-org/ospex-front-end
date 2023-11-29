import { InMemoryCache, ApolloClient } from "@apollo/client"

export const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/vincelaird/ospex",
    cache: new InMemoryCache(),
  })
