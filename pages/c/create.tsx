import React, { useContext, useEffect, useState } from "react"
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
} from "@chakra-ui/react"
import usePotentialContests from "../../hooks/usePotentialContests"
import { ProviderContext } from "../../contexts/ProviderContext"
import { TransactionStatusModal } from "../../components/TransactionStatusModal"
import { CreateContestCard } from "../../components/CreateContestCard"
import { Footer } from "../../components/Footer"

type ContestCardState = {
  sourceOption: "default" | "custom"
  createContestSource: string
  useGithubSource: boolean
}

const CreateContest: React.FC = () => {
  const { potentialContests, loading: loadingContests } = usePotentialContests()
  const { provider, contestOracleResolvedContract, cfpContract, isWaiting, startWaiting, stopWaiting } =
    useContext(ProviderContext)
  const [contestCardsState, setContestCardsState] = useState<Record<string, ContestCardState>>({})
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

  useEffect(() => {
    const initialState = potentialContests.reduce((acc, contest) => {
      const uniqueKey = `${contest.rundownID}-${contest.sportspageID}-${contest.jsonoddsID}`
      acc[uniqueKey] = {
        sourceOption: "default",
        createContestSource: "",
        useGithubSource: true,
      }
      return acc
    }, {} as Record<string, ContestCardState>)
    console.log("Initial state:", initialState)
    setContestCardsState(initialState)
  }, [potentialContests])

  const updateContestCardState = (key: string, newState: ContestCardState) => {
    console.log(`State before update for key ${key}:`, contestCardsState[key])
    setContestCardsState(prevState => {
      const updatedState = { ...prevState, [key]: newState }
      console.log(`State after update for key ${key}:`, updatedState[key])
      return updatedState
    })
  }

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
            <Box>
              {loadingContests ? (<Spinner size="xl" />) : potentialContests.length > 0 ? (
                potentialContests.map((contest, index) => {
                  const uniqueKey = `${contest.rundownID}-${contest.sportspageID}-${contest.jsonoddsID}`
                  console.log("Card state for", uniqueKey, contestCardsState[uniqueKey])
                  return (
                    <CreateContestCard
                      key={uniqueKey}
                      contest={contest}
                      index={index}
                      cardState={contestCardsState[uniqueKey]}
                      updateCardState={(newState) => updateContestCardState(uniqueKey, newState)}
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
