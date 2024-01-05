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
    const processData = async () => {
      if (data && !error) {
        console.log("Data received:", data)
        const contestsFromQuery = data.contests
          .filter((contest: contest) => contest.contestCreator === ContestCreatorAddress.toLowerCase())
          .map((contest: contest) => contest)
  
        const speculationsFromQuery = data.contests
          .flatMap((contest: contest) => contest.speculations || [])
          .filter((speculation: speculation) => speculation.speculationCreator === SpeculationCreatorAddress.toLowerCase())
  
        const positionsFromQuery = speculationsFromQuery
          .flatMap((speculation: speculation) => speculation.positions || [])
  
        setContests(contestsFromQuery)
        setSpeculations(speculationsFromQuery)
        setPositions(positionsFromQuery)
      } else if (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    processData()

  }, [loading, error, data])

  return {
    contests,
    speculations,
    positions,
    isLoadingContests: loading,
    error
  }
}
