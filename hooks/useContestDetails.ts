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
    pollInterval: 3600000, // 1 hour, only used on experimental contest details page
  })

  useEffect(() => {
    startPolling(3600000) // 1 hour, only used on experimental contest details page
  }, [startPolling])

  useEffect(() => {
    refetch()
  }, [data, refetch])

  useEffect(() => {
    if (data) {
      const contest = data.contests.find((contest: contest) => contest.id === contestId.toString()) || null;
      setContestDetails(contest);
      setIsLoading(false)
    }
    if (queryError) {
      setError(queryError)
      setIsLoading(false)
    }
  }, [data, loading, error, contestId]);

  return { contestDetails, loading: isLoading, error }
}