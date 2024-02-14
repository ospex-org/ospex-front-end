import React, { useContext } from "react"
import {
  Box,
  Text,
  Button,
  Badge,
  Divider,
  Input,
  RadioGroup,
  Radio,
  Stack,
  SimpleGrid,
  AccordionItem,
  Accordion,
  AccordionButton,
  SkeletonText,
  SkeletonCircle,
  useColorMode,
} from "@chakra-ui/react"
import moment from "moment-timezone"
import { PotentialContest } from "../constants/interface"
import { handleFileUpload } from "../scripts/fileUpload"
import { fetchCurrentCreateContestSourceFromGithub } from "../scripts/fetchCurrentCreateContestSourceFromGithub"
import { createContest } from "../functions/createContest"
import { translateLeague } from "../utils/translateLeague"
import { CreateSpeculation } from "./CreateSpeculation"
import { ProviderContext } from "../contexts/ProviderContext"

interface ContestCardProps {
  contest: PotentialContest
  index: number
  cardState: ContestCardState
  updateCardState: (newState: ContestCardState) => void
  onModalOpen: () => void
  onModalClose: () => void
}

type ContestCardState = {
  sourceOption: "default" | "custom"
  createContestSource: string
  useGithubSource: boolean
}

export const CreateContestCard: React.FC<ContestCardProps> = ({
  contest, index, cardState, updateCardState, onModalOpen, onModalClose
}) => {
  const { provider, contestOracleResolvedContract, isWaiting, startWaiting, stopWaiting } = useContext(ProviderContext)
  const formattedDate = moment(contest.MatchTime.toDate()).tz(moment.tz.guess()).format("ddd, MMM D, YYYY, h:mm A z")
  const { colorMode } = useColorMode()

  const handleCreateContest = async (rundownID: string, sportspageID: string, jsonoddsID: string) => {
    console.log(`Inside handleCreateContest with sourceOption: ${cardState.sourceOption}, useGithubSource: ${cardState.useGithubSource}`)
    if (cardState.useGithubSource) {
      try {
        const sourceCode = await fetchCurrentCreateContestSourceFromGithub()
        createContest(rundownID, sportspageID, jsonoddsID, sourceCode, startWaiting, stopWaiting, onModalOpen, onModalClose, provider, contestOracleResolvedContract)
      } catch (error) {
        console.error("Error fetching source code:", error)
      }
    } else {
      console.log(`Inside handleCreateContest in else block with sourceOption: ${cardState.sourceOption}, useGithubSource: ${cardState.useGithubSource}`)
      createContest(rundownID, sportspageID, jsonoddsID, cardState.createContestSource, startWaiting, stopWaiting, onModalOpen, onModalClose, provider, contestOracleResolvedContract)
    }
  }

  const handleRadioChange = (nextValue: string) => {
    console.log(`Radio button value before state update: ${cardState.sourceOption}`)
    updateCardState({
      ...cardState,
      sourceOption: nextValue as "default" | "custom",
      useGithubSource: nextValue === "default"
    })
  }

  if (cardState) {
    if (contest.status === "Pending") {
      return (
        <Box
          width="380px"
          maxW="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb="20px"
          padding="6"
        >
          <SkeletonCircle size='5' />
          <Box textAlign="left">
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              mb="0.5"
              opacity="0.5"
            >
              {/* Denver Broncos at Seattle Seahawks */}
              {`${contest.AwayTeam} at ${contest.HomeTeam}`}
              <Text
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                mb="0.5"
              >
                Pending...
              </Text>
            </Box>
          </Box>
          <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
        </Box>
      )
    }
    return (
      <Accordion allowToggle>
        <Box
          width="380px"
          maxW="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mb="20px"
        >
          <AccordionItem border={0} padding={0}>
            <Box p="4" textAlign="left">
              <Box display="flex" alignItems="baseline">
                <Badge borderRadius="full" px="2" colorScheme="gray">
                  {translateLeague(contest.Sport)}
                </Badge>
              </Box>
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                mb="0.5"
              >
                {/* Denver Broncos at Seattle Seahawks */}
                {`${contest.AwayTeam} at ${contest.HomeTeam}`}
              </Box>
              <Text
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                mb="0.5"
              >
                {formattedDate}
              </Text>
              <Divider my="2" />

              <RadioGroup onChange={handleRadioChange} value={cardState?.sourceOption}>
                <Stack direction="row">
                  <Radio value="default" colorScheme="gray">
                    <Text fontSize="xs">Use Default Source</Text>
                  </Radio>
                  <Radio value="custom" colorScheme="gray">
                    <Text fontSize="xs">Upload Custom Source</Text>
                  </Radio>
                </Stack>
              </RadioGroup>
              {cardState?.sourceOption === "custom" && (
                <>
                  {!cardState.createContestSource && (
                    <Input
                      type="file"
                      accept=".js"
                      mt="2"
                      onChange={(e) => handleFileUpload(e, (fileContent) => {
                        updateCardState({ ...cardState, createContestSource: fileContent })
                      })}
                    />
                  )}
                  {cardState.createContestSource && <Text mt="2" fontSize="sm">File loaded successfully.</Text>}
                </>
              )}
              <Divider my="2" />

              <SimpleGrid columns={2} spacing={0}>
                <Button
                  isLoading={isWaiting}
                  isDisabled={!provider || isWaiting || contest.Created}
                  fontWeight="bold"
                  variant="outline"
                  size="sm"
                  width={125}
                  height={8}
                  mt="2"
                  borderColor="gray.300"
                  bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                  color={colorMode === "light" ? "black" : "white"}
                  mb={1.5}
                  _hover={
                    colorMode === "light"
                      ? { bg: "black", borderColor: "black", color: "white" }
                      : { bg: "white", borderColor: "white", color: "black" }
                  }
                  onClick={() => {
                    if (provider) {
                      console.log(`Creating Contest with sourceOption: ${cardState.sourceOption}, useGithubSource: ${cardState.useGithubSource}`)
                      handleCreateContest(contest.rundownID, contest.sportspageID.toString(), contest.jsonoddsID)
                    }
                  }}
                >
                  Create Contest
                </Button>

                {contest.Created ?
                  <AccordionButton
                    fontSize="sm"
                    fontWeight="bold"
                    border={"1px solid #e2e2e2"}
                    borderRadius={"md"}
                    width={158}
                    height={8}
                    ml={-3}
                    mt={2}
                    justifyContent="center"
                    alignItems="center"
                    bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                    _hover={
                      colorMode === "light"
                        ? { bg: "black", borderColor: "black", color: "white" }
                        : { bg: "white", borderColor: "white", color: "black" }
                    }
                  >
                    <Box flex="1" textAlign="left">
                      Create Speculation
                    </Box>
                  </AccordionButton>
                  : <></>}
              </SimpleGrid>
              <CreateSpeculation
                index={index}
                contest={contest}
                onModalOpen={onModalOpen}
                onModalClose={onModalClose}
              />
            </Box>
          </AccordionItem>
        </Box>
      </Accordion>
    )
  } else {
    return (<></>)
  }
}
