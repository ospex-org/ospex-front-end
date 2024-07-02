import { InMemoryCache, ApolloClient } from "@apollo/client"

const apiKey = process.env.THE_GRAPH_API_KEY

export const client = new ApolloClient({
    // uri: "https://api.thegraph.com/subgraphs/name/vincelaird/ospex", // moved to subgraph studio
    // uri: "https://api.studio.thegraph.com/query/28174/ospex/version/latest", // dev url (rate limited)
    uri: "/api/graphql",
    cache: new InMemoryCache(),
  })
