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
import React, { useState, useContext } from "react"
import { ProviderContext } from "../contexts/ProviderContext"
import { SpeculationCard } from "../components/Speculation"
import { SearchIcon } from "@chakra-ui/icons"

const PrimaryTable = () => {
  const { contests, speculations, positions, isLoadingContests } = useContext(ProviderContext)
  const [query, setQuery] = useState("")

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
    if (isLoadingContests) {
      return <Spinner size="xl" />
    }

    if (filteredSpeculations.length === 0) {
      return <Text>No results found</Text>
    }

    return (
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
                positions
                  ? positions.filter(
                      (position) => position.id === speculation.id
                    )
                  : undefined
              }
              key={speculation.id}
            />
          ) : (
            <div key={speculation.id}></div>
          )
        ))}
      </Accordion>
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
