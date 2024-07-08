import { useState, useEffect } from "react"
import { contest, speculation, position } from "../constants/interface"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { contestsGteCurrentTime } from "../constants/queries"

export function useQueryResults(client: ApolloClient<NormalizedCacheObject>) {
  const [contests, setContests] = useState<contest[]>([])
  const [speculations, setSpeculations] = useState<speculation[]>([])
  const [positions, setPositions] = useState<position[]>([])

  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    contestsGteCurrentTime,
    {
      client,
      variables: {
        eventTime: Math.floor(Date.now() / 1000),
      },
      pollInterval: 5000,
    }
  )  

  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return function(...args: Parameters<T>): void {
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  useEffect(() => {
    startPolling(5000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  useEffect(() => {
    const debouncedRefetch = debounce(() => {
      console.log("Refetching data...")
      refetch()
    }, 5000)
    debouncedRefetch()
  }, [data])

  useEffect(() => {
    const processData = async () => {
      if (data && !error) {
        console.log("Data received:", data)
        const contestsFromQuery = data.contests
          // .filter((contest: contest) => contest.contestCreator === ContestCreatorAddress.toLowerCase())
          // allow anyone to create contests
          .map((contest: contest) => contest)
  
        const speculationsFromQuery = data.contests
          .flatMap((contest: contest) => contest.speculations || [])
          // .filter((speculation: speculation) => speculation.speculationCreator === SpeculationCreatorAddress.toLowerCase())
          // allow anyone to create speculations
  
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
    error,
    startPolling,
    stopPolling,
  }
}