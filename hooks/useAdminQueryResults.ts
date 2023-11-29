import { useState, useEffect } from "react"
import { contest, speculation, position } from "../constants/interface"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { contestsLtCurrentTime } from "../constants/queries"
import { ContestCreatorAddress } from "../constants/addresses"

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
    ;(async () => {
      const contestsFromQuery: contest[] = []
      if (data && !loading && !error) {
        await data.contests.forEach((contest: contest) => {
          if (contest.contestCreator === ContestCreatorAddress.toLowerCase()) {
            contestsFromQuery.push(contest)
          }
        })
        setAdminContests(contestsFromQuery)
      } else if (error) {
        console.error("Error fetching data:", error)
      }
    })()
  }, [loading, error, data])

  return {
    adminContests,
  }
}
