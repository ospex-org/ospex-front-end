import { useState, useEffect } from "react"
import { contest } from "../constants/interface"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { contestById } from "../constants/queries"

export function useContestDetails(
  client: ApolloClient<NormalizedCacheObject>,
  contestId: number
) {
  const [contestDetails, setContestDetails] = useState<contest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { data, loading, error: queryError, refetch, startPolling } = useQuery(contestById, {
    client,
    variables: { id: contestId },
    pollInterval: 5000,
  })

  useEffect(() => {
    startPolling(5000)
  }, [startPolling])

  useEffect(() => {
    refetch()
  }, [data, refetch])

  useEffect(() => {
    if (data && !loading && !error) {
      const contest = data.contests.length > 0 ? data.contests[0] : null
      setContestDetails(contest)
      setIsLoading(false)
    }
    if (queryError) {
      setError(queryError)
      setIsLoading(false)
    }
  }, [data, loading, queryError])

  return { contestDetails, isLoading, error }
}