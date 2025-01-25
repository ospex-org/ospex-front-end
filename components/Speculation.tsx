import {
  Badge,
  Box,
  Flex,
  SimpleGrid,
  useColorMode,
  Text,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  Divider,
  Accordion,
  useDisclosure,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { SpeculationTotalAddress } from "../constants/addresses"
import { contest, speculation, position } from "../constants/interface"
import {
  createPositionDescriptions,
  createSpeculationDescriptions,
} from "../functions/createDescriptions"
import { AccordionContent } from "./AccordionContent"

type SpeculationCardProps = {
  speculation: speculation
  contest?: contest
  position?: position[]
}

export function SpeculationCard({
  speculation,
  contest,
  position,
}: SpeculationCardProps) {
  const { colorMode } = useColorMode()
  const [speculationPosition, setSpeculationPosition] = useState<
    string | undefined
  >()
  const [speculationPositionTypeEnum, setSpeculationPositionTypeEnum] =
    useState<number | undefined>()
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(null)
  const speculationDescriptions = createSpeculationDescriptions(
    speculation,
    contest!
  )
  const positionDescriptions = createPositionDescriptions(
    speculation!,
    position!
  )
  const { isOpen } = useDisclosure()

  useEffect(() => {
    if (!isOpen) {
      setSelectedButton(null)
      setSpeculationPosition(undefined)
      setSpeculationPositionTypeEnum(undefined)
    }
  }, [isOpen])

  return (
    <AccordionItem border={0} padding={0}>
      {({ isExpanded }) => (
        <>
          <Flex alignItems="center" wrap="wrap" w="100%" mb="5">
            <Box
              width="380px"
              maxW="md"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Box p="4">
                <Box display="flex" alignItems="baseline">
                  <Badge borderRadius="full" px="2" colorScheme="gray">
                    {contest ? contest.league : ""}
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
                  {contest ? `${contest.awayTeam} at ${contest.homeTeam}` : ``}
                </Box>
                <Box
                  color="gray.500"
                  fontWeight="semibold"
                  letterSpacing="wide"
                  fontSize="xs"
                  mb="0.5"
                >
                  {/* Sep 12, 2022, 5:15 PM PST */}
                  {speculation && speculation.lockTime
                    ? new Date(speculation.lockTime * 1000).toLocaleString(
                        "en-US",
                        {
                          hour12: true,
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          timeZoneName: "short",
                        }
                      )
                    : ""}
                </Box>
                <Box fontWeight="semibold" mb={2}>
                  {speculationDescriptions?.speculationQuestion}
                </Box>
                <Box>
                  <SimpleGrid columns={3} spacing={10}>
                    <AccordionButton
                      fontSize="sm"
                      fontWeight="bold"
                      border={"1px solid #e2e2e2"}
                      borderRadius={"md"}
                      width={65}
                      height={7}
                      mb={2}
                      ml={3}
                      justifyContent="center"
                      alignItems="center"
                      bg={
                        selectedButton === 'yes'
                          ? colorMode === "light"
                            ? "black"
                            : "white"
                          : colorMode === "light"
                          ? "#f3f4f6"
                          : "#272b33"
                      }
                      color={
                        selectedButton === 'yes'
                          ? colorMode === "light"
                            ? "white"
                            : "black"
                          : colorMode === "light"
                          ? "black"
                          : "white"
                      }
                      _hover={
                        colorMode === "light"
                          ? { bg: "black", borderColor: "black", color: "white" }
                          : { bg: "white", borderColor: "white", color: "black" }
                      }
                      onClick={() => {
                        if (speculation) {
                          setSelectedButton('yes')
                          if (
                            speculation.theNumber < 0 ||
                            speculation.speculationScorer ===
                              SpeculationTotalAddress.toLowerCase()
                          ) {
                            setSpeculationPosition("upper")
                            setSpeculationPositionTypeEnum(0)
                          } else {
                            setSpeculationPosition("lower")
                            setSpeculationPositionTypeEnum(1)
                          }
                        }
                      }}
                    >
                      Yes
                    </AccordionButton>
                    <AccordionButton
                      fontSize="sm"
                      fontWeight="bold"
                      border={"1px solid #e2e2e2"}
                      borderRadius={"md"}
                      width={65}
                      height={7}
                      mb={2}
                      ml={3}
                      justifyContent="center"
                      alignItems="center"
                      bg={
                        selectedButton === 'no'
                          ? colorMode === "light"
                            ? "black"
                            : "white"
                          : colorMode === "light"
                          ? "#f3f4f6"
                          : "#272b33"
                      }
                      color={
                        selectedButton === 'no'
                          ? colorMode === "light"
                            ? "white"
                            : "black"
                          : colorMode === "light"
                          ? "black"
                          : "white"
                      }
                      _hover={
                        colorMode === "light"
                          ? { bg: "black", borderColor: "black", color: "white" }
                          : { bg: "white", borderColor: "white", color: "black" }
                      }
                      onClick={() => {
                        if (speculation) {
                          setSelectedButton('no')
                          if (
                            speculation.theNumber < 0 ||
                            speculation.speculationScorer ===
                              SpeculationTotalAddress.toLowerCase()
                          ) {
                            setSpeculationPosition("lower")
                            setSpeculationPositionTypeEnum(1)
                          } else {
                            setSpeculationPosition("upper")
                            setSpeculationPositionTypeEnum(0)
                          }
                        }
                      }}
                    >
                      No
                    </AccordionButton>
                    <Text ml="3">Pool</Text>
                  </SimpleGrid>
                  <SimpleGrid columns={3}>
                    <Text fontSize="xs" fontWeight="semibold" ml="1">
                      {speculation.theNumber < 0
                        ? positionDescriptions.lowerPositionTranslation
                        : positionDescriptions.upperPositionTranslation}
                    </Text>
                    <Text fontSize="xs" fontWeight="semibold" ml="4">
                      {speculation.theNumber < 0
                        ? positionDescriptions.upperPositionTranslation
                        : positionDescriptions.lowerPositionTranslation}
                    </Text>
                    <Text fontSize="xs" fontWeight="semibold" ml="8">
                      {positionDescriptions.totalAmount.toString()} USDC
                    </Text>
                  </SimpleGrid>
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      mt="2"
                      fontStyle="italic"
                    >
                      Odds not final until contest begins
                    </Text>
                  </Box>
                  <AccordionPanel padding={0}>
                    <Divider pt={3} />
                    <AccordionContent
                      speculation={speculation}
                      speculationDescription={
                        speculationPosition === "upper"
                          ? speculationDescriptions?.upperSpeculationTranslation
                          : speculationDescriptions?.lowerSpeculationTranslation
                      }
                      speculationPositionTypeEnum={speculationPositionTypeEnum}
                      contest={contest}
                    />
                  </AccordionPanel>
                </Box>
              </Box>
            </Box>
          </Flex>
        </>
      )}
    </AccordionItem>
  )
}
