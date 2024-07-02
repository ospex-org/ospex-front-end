import { useState, useEffect } from "react"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { userTotals } from "../constants/queries"

export function useUserStatistics(
  client: ApolloClient<NormalizedCacheObject>,
  address: string
) {
  const [userTotalSpeculated, setUserTotalSpeculated] = useState<number>(0)
  const [userTotalClaimed, setUserTotalClaimed] = useState<number>(0)
  const [userTotalClaimable, setUserTotalClaimable] = useState<number>(0)
  const [userTotalContributed, setUserTotalContributed] = useState<number>(0)
  const [userTotalLost, setUserTotalLost] = useState<number>(0)
  const [userTotalPending, setUserTotalPending] = useState<number>(0)
  const [userWins, setUserWins] = useState<number>(0)
  const [userLosses, setUserLosses] = useState<number>(0)
  const [userTies, setUserTies] = useState<number>(0)
  const [userNet, setUserNet] = useState<number>(0)

  const { loading, error, data, refetch, startPolling } = useQuery(
    userTotals,
    {
      client,
      variables: {
        Id: address,
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
    ; (async () => {
      if (data && data.users && data.users.length > 0) {
        setUserTotalSpeculated(data.users[0].totalSpeculated / 1e6)
        setUserTotalClaimed(data.users[0].totalClaimed / 1e6)
        setUserTotalClaimable(data.users[0].totalClaimable / 1e6)
        setUserTotalContributed(data.users[0].totalContributed / 1e6)
        setUserTotalLost(data.users[0].totalLost / 1e6)
        setUserTotalPending(data.users[0].totalPending / 1e6)
        setUserWins(data.users[0].wins)
        setUserLosses(data.users[0].losses)
        setUserTies(data.users[0].ties)
        setUserNet(data.users[0].net / 1e6)
      } else {
        console.log('User data not found');
      }
    })()
  }, [loading, error, data])

  return {
    userTotalSpeculated,
    userTotalClaimed,
    userTotalClaimable,
    userTotalContributed,
    userTotalLost,
    userTotalPending,
    userWins,
    userLosses,
    userTies,
    userNet,
    loading,
    error
  }
}
