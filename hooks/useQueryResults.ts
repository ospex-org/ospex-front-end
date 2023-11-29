import { useState, useEffect } from "react"
import { contest, speculation, position } from "../constants/interface"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { contestsGteCurrentTime } from "../constants/queries"
import {
  ContestCreatorAddress,
  SpeculationCreatorAddress,
} from "../constants/addresses"

export function useQueryResults(client: ApolloClient<NormalizedCacheObject>) {
  const [contests, setContests] = useState<contest[] | []>([])
  const [speculations, setSpeculations] = useState<speculation[] | []>([])
  const [positions, setPositions] = useState<position[] | []>([])

  const { loading, error, data, refetch, startPolling } = useQuery(
    contestsGteCurrentTime,
    {
      client,
      variables: {
        eventTime: Math.floor(new Date().getTime() / 1000),
      },
      pollInterval: 5000,
    }
  )

  useEffect(() => {
    console.log("Starting polling...")
    startPolling(5000)
  }, [startPolling])

  useEffect(() => {
    console.log("Refetching data...")
    refetch()
  }, [data, refetch])

  useEffect(() => {
    ;(async () => {
      const contestsFromQuery: contest[] = []
      const speculationsFromQuery: speculation[] = []
      const positionsFromQuery: position[] = []
      console.log("Processing data...")
      if (data && !loading && !error) {
        console.log("Data received:", data)
        await data.contests.forEach((contest: contest) => {
          if (contest.contestCreator === ContestCreatorAddress.toLowerCase()) {
            contestsFromQuery.push(contest)
            if (contest.speculations) {
              contest.speculations.forEach((speculation: speculation) => {
                if (
                  speculation.speculationCreator ===
                  SpeculationCreatorAddress.toLowerCase()
                ) {
                  speculationsFromQuery.push(speculation)
                  if (speculation.positions) {
                    speculation.positions.forEach((position: position) => {
                      positionsFromQuery.push(position)
                    })
                  }
                }
              })
            }
          }
        })
        setContests(contestsFromQuery)
        setSpeculations(speculationsFromQuery)
        setPositions(positionsFromQuery)
      } else if (error) {
        console.error("Error fetching data:", error)
      }
    })()
  }, [loading, error, data])

  return {
    contests,
    speculations,
    positions,
  }
}
