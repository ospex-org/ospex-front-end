import { Box, Center, Spinner, Text, useColorModeValue } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { PositionCard } from "../components/Position"
import {
  position,
} from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"

const Positions = () => {
  const { address } = useContext(ProviderContext)
  const { userContests, userSpeculations, userPositions, isLoadingPositions } = useContext(ProviderContext)
  const [isLoadingTransition, setIsLoadingTransition] = useState(true)

  useEffect(() => {
    if (!isLoadingPositions) {
      setTimeout(() => {
        setIsLoadingTransition(false)
      }, 300) // delay to show the loading spinner
    } else {
      setIsLoadingTransition(true)
    }
  }, [isLoadingPositions])
  
  const RenderContent = () => {
    if (isLoadingTransition || isLoadingPositions) {
      return <Spinner size="xl" />
    }
  
    const userFilteredPositions = userPositions
      .filter((position) => position.userId === address)
      .sort((a: position, b: position) => {
        const speculationA = userSpeculations.find(
          (speculation) => speculation.id === a.speculationId
        )
        const speculationB = userSpeculations.find(
          (speculation) => speculation.id === b.speculationId
        )
        if (speculationA && speculationB) {
          return speculationB.lockTime - speculationA.lockTime;
        }
        return 0
      })
  
    if (userFilteredPositions.length === 0) {
      return <Text>No results found</Text>
    }
  
    return userFilteredPositions.map((position, index) => (
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
    ))
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
          <Box>{RenderContent()}</Box>
        </Center>
      </Box>
    </>
  )
}

export default Positions
