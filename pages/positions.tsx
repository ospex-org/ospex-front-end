import { Box, Center, Text, useColorModeValue } from "@chakra-ui/react"
import { useContext } from "react"
import { PositionCard } from "../components/Position"
import {
  contest,
  speculation,
  position,
  userPosition,
} from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"
import { useState, useEffect } from "react"
import { addressSpecificPositions } from "../constants/queries"
import { useQuery } from "@apollo/client"

const Positions = () => {
  const { address } = useContext(ProviderContext)
  const [userContests, setUserContests] = useState<contest[] | []>([])
  const [userSpeculations, setUserSpeculations] = useState<speculation[] | []>(
    []
  )
  const [userPositions, setUserPositions] = useState<position[] | []>([])

  const { loading, error, data, refetch, startPolling } = useQuery(
    addressSpecificPositions,
    {
      variables: {
        userId: address,
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
      const speculationsFromQuery: speculation[] = []
      const positionsFromQuery: position[] = []
      if (data && !loading && !error) {
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
            upperAmount: Number(BigInt(position.speculation.upperAmount)),
            lowerAmount: Number(BigInt(position.speculation.lowerAmount)),
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

  const RenderCards = () => {
    return (
      <>
        {userPositions
          .filter((position) => {
            return position.userId === address
          })
          .sort((a: position, b: position) => {
            const speculationA = userSpeculations.find(
              (speculation) => speculation.id === a.speculationId
            )
            const speculationB = userSpeculations.find(
              (speculation) => speculation.id === b.speculationId
            )
            if (speculationA && speculationB) {
              return speculationB.lockTime - speculationA.lockTime
            }
            return 0
          })
          .map((position, index) => (
            <PositionCard
              speculation={userSpeculations.find(
                (speculation) => speculation.id === position.speculationId
              )}
              position={position}
              contest={userContests.find(
                (contest) =>
                  contest.id ===
                  userSpeculations.find(
                    (speculation) => speculation.id === position.speculationId
                  )?.contestId
              )}
              key={index}
            />
          ))}
      </>
    )
  }

  return (
    <>
      <Box flexDirection="column" alignContent="center" m="0 auto">
        <Center>
          <Box>
            <Text
              textTransform="none"
              fontWeight="normal"
              fontSize="24px"
              pt={50}
              pb={5}
              color={useColorModeValue("black", "white")}
            >
              Positions
            </Text>
          </Box>
        </Center>
        <Center>
          <Box>{RenderCards()}</Box>
        </Center>
      </Box>
    </>
  )
}

export default Positions
