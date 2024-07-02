import { useState, useEffect } from "react"
import { contest } from "../constants/interface"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { contestsLtCurrentTime } from "../constants/queries"

export function useAdminQueryResults(
  client: ApolloClient<NormalizedCacheObject>
) {
  const [adminContests, setAdminContests] = useState<contest[] | []>([])

  const { loading, error, data, refetch, startPolling } = useQuery(
    contestsLtCurrentTime,
    {
      client,
      variables: {
        currentTime: Math.floor(new Date().getTime() / 1000),
      },
      pollInterval: 5000,
    }
  )

  useEffect(() => {
    startPolling(5000)
  }, [startPolling])

  useEffect(() => {
    refetch()
  }, [data, refetch])

  useEffect(() => {
    if (data) {
      // filtering logic similar to previous GraphQL query `contestsLtCurrentTime`
      const currentTime = Math.floor(Date.now() / 1000)
      const contestsFromQuery: contest[] = data.contests
        .filter((contest: contest) => contest.eventTime < currentTime)
        .map((contest: contest) => contest);
      setAdminContests(contestsFromQuery)
    }
  }, [loading, error, data]);

  return {
    adminContests,
    loading,
    error,
  }
}
