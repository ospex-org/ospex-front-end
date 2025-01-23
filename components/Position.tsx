import {
  Badge,
  Box,
  Button,
  Flex,
  useColorMode,
  Text,
  useDisclosure,
  Divider,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { ethers } from "ethers"
import { contest, speculation, position } from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"
import { createSpeculationDescriptions } from "../functions/createDescriptions"
import { ClaimModal } from "./ClaimModal"
import { TransactionStatusModal } from "./TransactionStatusModal"
import { finalOddsDescription } from "../functions/finalOddsDescription"
import router from "next/router"

type PositionCardProps = {
  speculation?: speculation
  position: position
  contest?: contest
}

export function PositionCard({
  speculation,
  position,
  contest,
}: PositionCardProps) {
  const { provider, cfpContract, isWaiting, startWaiting, stopWaiting, loadingButtonId } =
    useContext(ProviderContext)
  const { colorMode } = useColorMode()
  const speculationDescriptions = createSpeculationDescriptions(
    speculation!,
    contest!
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose,
  } = useDisclosure()
  const [totalClaimableAmount, setTotalClaimableAmount] = useState<string | number>(0)

  const navigateToScoreContest = () => {
    router.push('/c/score')
  }

  const claimableAmount = () => {
    if (speculation) {
      if (
        (speculation?.winSide === position.positionType && !position.claimed) ||
        Number(speculation?.upperAmount) === 0 ||
        Number(speculation?.lowerAmount) === 0 ||
        speculation?.winSide === "Push" || 
        speculation?.winSide === "Forfeit" || 
        speculation?.winSide === "Invalid" ||
        speculation?.winSide === "Void"
      ) {
        // amount in position equals total speculation amount (this position was the only position)
        if (
          Number(speculation?.upperAmount) === 0 ||
          Number(speculation?.lowerAmount) === 0 ||
          speculation?.winSide === "Push" || 
          speculation?.winSide === "Forfeit" || 
          speculation?.winSide === "Invalid" ||
          speculation?.winSide === "Void"
        ) {
          return Number(position.amount / 1e6)
        }
        // upper scenario; away wins or over wins
        if (
          position.positionType === "Away" ||
          position.positionType === "Over"
        ) {
          return (
            ((Number(position.amount) / Number(speculation!.upperAmount)) *
              (Number(speculation!.upperAmount) +
                Number(speculation!.lowerAmount))) /
            1e6
          ).toFixed(2)
        }
        // lower scenario; home wins or under wins
        if (
          position.positionType === "Home" ||
          position.positionType === "Under"
        ) {
          return (
            ((Number(position.amount) / Number(speculation!.lowerAmount)) *
              (Number(speculation!.upperAmount) +
                Number(speculation!.lowerAmount))) /
            1e6
          ).toFixed(2)
        }
      }
    }
    return 0
  }

  const outcome = () => {
    // contest has not started
    if (contest) {
      if (new Date(contest.eventTime * 1000).getTime() - Date.now() > 0) {
        return (
          <Text fontSize="sm" fontWeight="semibold">
            Contest has not yet started
          </Text>
        )
      }

      // contest has started but outcome has not yet been determined
      if (
        new Date(contest.eventTime * 1000).getTime() - Date.now() <= 0 &&
        speculation?.winSide === "TBD"
      ) {
        return (
          <>
            <Text fontSize="sm" fontWeight="semibold" onClick={navigateToScoreContest} _hover={{ cursor: "pointer" }}>
              Contest pending; if contest over, try scoring it
            </Text>
            <Divider p={1} mb={1} />
            <Text fontSize="sm" fontWeight="semibold">
              Final odds: 1 wins {finalOddsDescription(speculation, position)?.finalOdds.toFixed(2)} USDC
            </Text>
            <Text fontSize="sm" fontWeight="semibold">
              Potential win: {finalOddsDescription(speculation, position)?.potentialWinningAmount.toFixed(2)} USDC
            </Text>
          </>
        )
      }

      // contest is over and user won and is able to claim
      // or all speculations have come in on one side and therefore is claimable once contest has started
      // or speculation has been voided
      if (
        !position.claimed &&
        speculation?.speculationStatus !== "Open" &&
        (speculation?.winSide === position.positionType ||
          speculation?.upperAmount === 0 ||
          speculation?.lowerAmount === 0 ||
          speculation?.winSide === "Void")
      ) {
        const buttonId = `claim-position-${position.id}`
        
        return (
          <>
            <Button
              isLoading={isWaiting && loadingButtonId === buttonId}
              disabled={!provider || isWaiting}
              fontWeight="bold"
              variant="outline"
              size="sm"
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
                setTotalClaimableAmount(claimableAmount)
                startWaiting(buttonId)
                onOpen()
              }}
            >
              {speculation?.upperAmount === 0 ||
                speculation?.lowerAmount === 0 ||
                speculation?.winSide === "Invalid" ||
                speculation?.winSide === "Void"
                ? "Claim (position invalid)"
                : "Claim"}
            </Button>
            <ClaimModal
              isOpenParent={isOpen}
              isCloseParent={onClose}
              onClaim={(contribution) => handleClaim(contribution, buttonId)}
              speculation={speculation}
              contest={contest}
              position={position}
              claimableAmount={totalClaimableAmount}
            />
            <TransactionStatusModal
              isOpen={isStatusOpen}
              onClose={onStatusClose}
              stopWaiting={stopWaiting}
            />
            <Text fontSize="sm" fontWeight="semibold">
              {position ? `Claimable: ${claimableAmount()} USDC` : ""}
            </Text>
          </>
        )
      }

      // contest is over and user won and has already claimed and did not contribute
      if (
        position.claimed &&
        Number(position.contributedUponCreation / 1e6) +
        Number(position.contributedUponClaim / 1e6) <=
        0
      ) {
        return (
          <Text fontSize="sm" fontWeight="semibold">
            Successful claim: {Number(position.amountClaimed / 1e6).toFixed(2)}{" "}
            USDC
          </Text>
        )
      }

      if (
        position.claimed &&
        Number(position.contributedUponCreation / 1e6) +
        Number(position.contributedUponClaim / 1e6) >
        0
      ) {
        return (
          <>
            <Text fontSize="sm" fontWeight="semibold">
              Successful claim:{" "}
              {Number(position.amountClaimed / 1e6).toFixed(2)} USDC
            </Text>
            <Text fontSize="sm" fontWeight="semibold">
              Contributed:{" "}
              {(
                Number(position.contributedUponCreation / 1e6) +
                Number(position.contributedUponClaim / 1e6)
              ).toFixed(2)}{" "}
              USDC
            </Text>
          </>
        )
      }

      // contest is over and user lost
      if (
        speculation?.winSide !== "TBD" &&
        speculation?.winSide !== position.positionType
      ) {
        return (
          <Text fontSize="sm" fontWeight="semibold">
            Loss
          </Text>
        )
      }
    }
  }

  const handleClaim = async (contribution: number | string, buttonId: string) => {
    onClose()
    onStatusOpen()
    startWaiting(buttonId)
    try {
      const claimTx = await cfpContract!.claim(
        Number(position.speculationId),
        ethers.utils.parseUnits(contribution.toString(), 6)
      )
      await claimTx.wait()
    } catch (error) {
      console.error("an error has occurred:", error)
      onStatusClose()
    } finally {
      stopWaiting()
    }
  }

  return (
    <>
      <Box flexDirection="column" alignContent="center" m="0 auto">
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
                  {contest?.league}
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
                {`${contest?.awayTeam} at ${contest?.homeTeam}`}
              </Box>
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                mb="0.5"
              >
                {/* Sep 12, 2022, 5:15 PM PST */}
                {contest?.eventTime
                  ? new Date(contest?.eventTime * 1000).toLocaleString(
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
              <Box fontWeight="bold">
                {/* Seattle Seahawks win */}
                {speculationDescriptions
                  ? position.positionType === "Away" ||
                    position.positionType === "Over"
                    ? speculationDescriptions.upperSpeculationTranslation
                    : speculationDescriptions.lowerSpeculationTranslation
                  : ""}
              </Box>
              <Box mb="0.5">
                <>
                  <Text fontSize="sm" fontWeight="semibold">
                    {position
                      ? `Speculated: ${(Number(position.amount) / 1e6).toFixed(
                        2
                      )} USDC`
                      : ""}
                  </Text>
                  {Number(position.contributedUponCreation) > 0 ? (
                    <Text fontSize="sm" fontWeight="semibold">
                      {`Contributed: ${(
                        Number(position.contributedUponCreation) / 1e6
                      ).toFixed(2)} USDC`}
                    </Text>
                  ) : (
                    ""
                  )}
                  <Divider p={1} mb={1} />
                  <Box fontWeight="semibold" as="h4" lineHeight="tight">
                    {contest?.awayScore &&
                      contest?.homeScore &&
                      contest?.contestStatus === "Scored" ? (
                      <>
                        <Text>
                          {contest?.awayScore > contest?.homeScore
                            ? `${contest?.awayTeam} ${contest?.awayScore}, ${contest?.homeTeam} ${contest?.homeScore}`
                            : `${contest?.homeTeam} ${contest?.homeScore}, ${contest?.awayTeam} ${contest?.awayScore}`}
                        </Text>
                        <Divider p={1} mb={1} />
                      </>
                    ) : (
                      ""
                    )}
                  </Box>
                  {outcome()}
                </>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
