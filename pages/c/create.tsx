import React, { useContext } from "react"
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

const CreateContest: React.FC = () => {
  const { potentialContests, loading: loadingContests } = usePotentialContests()
  const { stopWaiting } = useContext(ProviderContext)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

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
