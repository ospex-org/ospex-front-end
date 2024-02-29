import React, { useCallback, useContext, useState } from "react"
import { Header } from "../../components/Header"
import {
  Box,
  Center,
  Flex,
  Text,
  useColorModeValue,
  Spinner,
  useDisclosure,
  Spacer,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react"
import usePotentialContests from "../../hooks/usePotentialContests"
import { ProviderContext } from "../../contexts/ProviderContext"
import { TransactionStatusModal } from "../../components/TransactionStatusModal"
import { CreateContestCard } from "../../components/CreateContestCard"
import { Footer } from "../../components/Footer"
import { SearchIcon } from "@chakra-ui/icons"
import { useFilteredItems } from "../../hooks/useFilteredItems"
import { PotentialContest } from "../../constants/interface"
import { debounce } from "../../scripts/debounce"

const CreateContest: React.FC = () => {
  const { potentialContests, loading: loadingContests } = usePotentialContests()
  const { stopWaiting } = useContext(ProviderContext)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
  const [query, setQuery] = useState("")

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const debouncedSearchHandler = useCallback(debounce(handleSearchChange, 300), [])

  const potentialContestFilterCriteria = (potentialContest: PotentialContest, query: string): boolean => {
    if (query === "") return true
    return (
      potentialContest.AwayTeam.toLowerCase().includes(query.toLowerCase()) ||
      potentialContest.HomeTeam.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  const filteredPotentialContests = useFilteredItems(query, potentialContests, potentialContestFilterCriteria)

  return (
    <>
      <Header />
      <Center>
        <Flex justifyContent="center" alignItems="center" width="100%">
          <Box flexDirection="column" alignContent="center" mt="100px" textAlign="center">
            <Text
              textTransform="none"
              fontWeight="normal"
              fontSize="24px"
              pt={50}
              pb={5}
              color={useColorModeValue("black", "white")}
            >
              Create Contest
            </Text>

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
                    onChange={(event) => debouncedSearchHandler(event)}
                  />
                </InputGroup>
              </Box>
            </Center>

            <Box>
              {loadingContests ? (<Spinner size="xl" />) : filteredPotentialContests.length > 0 ? (
                filteredPotentialContests.map((contest, index) => {
                  const uniqueKey = `${contest.rundownID}-${contest.sportspageID}-${contest.jsonoddsID}`
                  return (
                    <CreateContestCard
                      key={uniqueKey}
                      contest={contest}
                      index={index}
                      onModalOpen={onModalOpen}
                      onModalClose={onModalClose}
                    />
                  )
                })
              ) : (<Text>No contests to create</Text>)}
            </Box>
            <Spacer height="50px" />
          </Box>
          <Footer />
        </Flex>
        <TransactionStatusModal isOpen={isModalOpen} onClose={onModalClose} stopWaiting={stopWaiting} />
      </Center>
    </>
  )
}

export default CreateContest
