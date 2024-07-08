import { useState, useEffect } from "react"
import { contest, speculation, position, userPosition } from "../constants/interface"
import { useQuery, ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { addressSpecificPositions } from "../constants/queries"

export function useUserQueryResults(
  client: ApolloClient<NormalizedCacheObject>,
  address: string,
  pollInterval: number = 5000 // default to 5 seconds
) {
  const [userContests, setUserContests] = useState<contest[]>([])
  const [userSpeculations, setUserSpeculations] = useState<speculation[]>([])
  const [userPositions, setUserPositions] = useState<position[]>([])
  const [detailedPositions, setDetailedPositions] = useState<userPosition[]>([])

  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    addressSpecificPositions,
    {
      client,
      variables: {
        userId: address,
      },
      pollInterval,
    }
  )

  useEffect(() => {
    startPolling(pollInterval)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling, pollInterval])

  useEffect(() => {
    refetch()
  }, [data, refetch])

  /* maybe more concise but did not work
  useEffect(() => {
    if (data) {
      console.log(`[${new Date().toISOString()}] Processing data in useUserQueryResults:`, data);
      const contestsFromQuery: contest[] = [];
      const speculationsFromQuery: speculation[] = [];
      const positionsFromQuery: position[] = [];
      const detailedPositionsFromQuery: userPosition[] = [];

      data.contests.forEach((contest: contest) => {
        contest.speculations.forEach((speculation: speculation) => {
          speculation.positions.forEach((position: position) => {
            if (position.userId === address) {
              const userPosition: userPosition = {
                ...position,
                speculation: {
                  ...speculation,
                  contest: { ...contest }
                }
              };

              positionsFromQuery.push(position);
              detailedPositionsFromQuery.push(userPosition);

              if (!speculationsFromQuery.some(s => s.id === speculation.id)) {
                speculationsFromQuery.push(speculation);
              }

              if (!contestsFromQuery.some(c => c.id === contest.id)) {
                contestsFromQuery.push(contest);
              }
            }
          });
        });
      });

      setUserContests(contestsFromQuery);
      setUserSpeculations(speculationsFromQuery);
      setUserPositions(positionsFromQuery);
      setDetailedPositions(detailedPositionsFromQuery);
    }
  }, [data, address]);

  */

  useEffect(() => {
    ; (async () => {
      const contestsFromQuery: contest[] = []
      const speculationsFromQuery: speculation[] = []
      const positionsFromQuery: position[] = []
      if (data && !loading && !error) {
        setDetailedPositions(data.positions)
        await data.positions.forEach((position: userPosition) => {
          const positionToAdd: position = {
            id: position.id,
            speculationId: position.speculationId,
            userId: position.userId,
            amount: position.amount,
            contributedUponCreation: position.contributedUponCreation
              ? position.contributedUponCreation
              : 0,
            contributedUponClaim: position.contributedUponClaim
              ? position.contributedUponClaim
              : 0,
            positionType: position.positionType,
            claimed: position.claimed,
            amountClaimed: position.amountClaimed,
          }
          const speculationToAdd: speculation = {
            id: position.speculation.id,
            contestId: position.speculation.contestId,
            lockTime: position.speculation.lockTime,
            speculationScorer: position.speculation.speculationScorer,
            theNumber: position.speculation.theNumber,
            speculationCreator: position.speculation.speculationCreator,
            upperAmount: Number(position.speculation.upperAmount),
            lowerAmount: Number(position.speculation.lowerAmount),
            winSide: position.speculation.winSide,
            speculationStatus: position.speculation.speculationStatus,
            positions: [],
          }
          const contestToAdd: contest = {
            id: position.speculation.contest.id,
            awayScore: position.speculation.contest.awayScore,
            homeScore: position.speculation.contest.homeScore,
            contestCreator: position.speculation.contest.contestCreator,
            rundownId: position.speculation.contest.rundownId,
            sportspageId: position.speculation.contest.sportspageId,
            jsonoddsId: position.speculation.contest.jsonoddsId,
            leagueId: position.speculation.contest.leagueId,
            league: position.speculation.contest.league,
            awayTeamId: position.speculation.contest.awayTeamId,
            awayTeam: position.speculation.contest.awayTeam,
            homeTeamId: position.speculation.contest.homeTeamId,
            homeTeam: position.speculation.contest.homeTeam,
            eventTime: position.speculation.contest.eventTime,
            contestStatus: position.speculation.contest.contestStatus,
            speculations: [],
          }
          positionsFromQuery.push(positionToAdd)
          if (
            speculationsFromQuery.findIndex(
              (x) => x.id === speculationToAdd.id
            ) === -1
          ) {
            speculationsFromQuery.push(speculationToAdd)
          }
          if (
            contestsFromQuery.findIndex((x) => x.id === contestToAdd.id) === -1
          ) {
            contestsFromQuery.push(contestToAdd)
          }
        })
      }
      setUserContests(contestsFromQuery)
      setUserSpeculations(speculationsFromQuery)
      setUserPositions(positionsFromQuery)
    })()
  }, [loading, error, data])  

  // console.log(`[${new Date().toISOString()}] useUserQueryResults hook state:`, { userContests, userSpeculations, userPositions, detailedPositions, loading, error });

  // useEffect(() => {
  //   console.log(`[${new Date().toISOString()}] useUserQueryResults mounted, requesting data...`);
  // }, []);  

  return {
    detailedPositions,
    userContests,
    userSpeculations,
    userPositions,
    isLoadingPositions: loading,
    error,
    startPolling,
    stopPolling,
  }
}
