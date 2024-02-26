import {
  Accordion,
  Box,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import React, { useState, useContext, useEffect } from "react"
import { useRouter } from 'next/router'
import { ProviderContext } from "../contexts/ProviderContext"
import { SpeculationCard } from "../components/Speculation"
import { SearchIcon } from "@chakra-ui/icons"

const PrimaryTable = () => {
  const router = useRouter()
  const { contests, speculations, positions, isLoadingContests } = useContext(ProviderContext)
  const [query, setQuery] = useState("")
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (!isLoadingContests && isInitialLoad) {
      setIsInitialLoad(false) // Set isInitialLoad to false once the initial load is completed
    }

    // Timer to force component to update every minute
    const interval = setInterval(() => {
      // This will trigger a re-render by updating a state variable
      setQuery((prevQuery) => prevQuery)
    }, 60000)

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval)
  }, [isLoadingContests, isInitialLoad])

  const navigateToCreateContest = () => {
    router.push('/c/create')
  }

  const filteredSpeculations = speculations
    ? speculations.filter((speculation) => {
      const curTime = Date.now() / 1000
      if (speculation.lockTime >= curTime) {
        if (query === "") {
          return true
        }
        const contestFilterContent = contests.find(
          (contest) => contest.id === speculation.contestId
        )
        return (
          contestFilterContent?.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
          contestFilterContent?.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
          contestFilterContent?.league.toLowerCase().includes(query.toLowerCase())
        )
      }
      return false
    })
    : []

  const RenderContent = () => {
    if (isInitialLoad) {
      return <Spinner size="xl" />
    }

    return (
      <>
        {filteredSpeculations.length === 0 ? (
          <Text onClick={navigateToCreateContest} _hover={{ cursor: "pointer" }}>No results found - Create one</Text>
        ) : (
          <Accordion>
            {filteredSpeculations.map((speculation) => (
              contests.some(
                (contest) => contest.id === speculation.contestId
              ) ? (
                <SpeculationCard
                  speculation={speculation}
                  contest={contests.find(
                    (contest) => contest.id === speculation.contestId
                  )}
                  position={
                    positions?.filter(
                      (position) => position.id === speculation.id
                    )}
                  key={speculation.id}
                />
              ) : (
                <div key={speculation.id}></div>
              )
            ))}
            <Box textAlign="center" pb="4">
              <Text onClick={navigateToCreateContest} _hover={{ cursor: "pointer" }}>Looking for something different? Create Contest</Text>
            </Box>
          </Accordion>
        )}
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
              Commission-free parimutuel pools
            </Text>
          </Box>
        </Center>
        <Center>
          <Box pb={5}>
            <InputGroup>
              <InputLeftElement
                zIndex="unset"
                pointerEvents="none"
                // eslint-disable-next-line react/no-children-prop
                children={<SearchIcon />}
              />
              <Input
                width="350px"
                placeholder="Search"
                onChange={(event) => setQuery(event.target.value)}
              />
            </InputGroup>
          </Box>
        </Center>
        <Center>
          {RenderContent()}
        </Center>
      </Box>
    </>
  )
}

export default PrimaryTable
