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
import { useContext } from "react"
import { contest, speculation, position } from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"
import { createSpeculationDescriptions } from "../functions/createDescriptions"
import { ClaimModal } from "./ClaimModal"

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
  const { provider, isWaiting } = useContext(ProviderContext)
  const { colorMode } = useColorMode()
  const speculationDescriptions = createSpeculationDescriptions(
    speculation!,
    contest!
  )
  const { isOpen, onOpen, onClose } = useDisclosure()

  const claimableAmount = () => {
    if (speculation) {
      if (
        (speculation?.winSide === position.positionType && !position.claimed) ||
        Number(BigInt(speculation?.upperAmount)) === 0 ||
        Number(BigInt(speculation?.lowerAmount)) === 0
      ) {
        // amount in position equals total speculation amount (this position was the only position)
        if (
          Number(BigInt(speculation?.upperAmount)) === 0 ||
          Number(BigInt(speculation?.lowerAmount)) === 0
        ) {
          return Number(BigInt(position.amount) / BigInt(1e18))
        }
        // upper scenario; away wins or over wins
        if (
          position.positionType === "Away" ||
          position.positionType === "Over"
        ) {
          return Number(
            ((BigInt(position.amount) / BigInt(speculation!.upperAmount)) *
              (BigInt(speculation!.upperAmount) +
                BigInt(speculation!.lowerAmount))) /
              BigInt(1e18)
          ).toFixed(2)
        }
        // lower scenario; home wins or under wins
        if (
          position.positionType === "Home" ||
          position.positionType === "Under"
        ) {
          return Number(
            ((BigInt(position.amount) / BigInt(speculation!.lowerAmount)) *
              (BigInt(speculation!.upperAmount) +
                BigInt(speculation!.lowerAmount))) /
              BigInt(1e18)
          ).toFixed(2)
        }
      }
    }
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
          <Text fontSize="sm" fontWeight="semibold">
            Contest pending
          </Text>
        )
      }

      // contest is over and user won and is able to claim
      // or all speculations have come in on one side and therefore is claimable once contest has started
      if (
        !position.claimed &&
        speculation?.speculationStatus !== "Open" &&
        (speculation?.winSide === position.positionType ||
          speculation?.upperAmount === 0 ||
          speculation?.lowerAmount === 0)
      ) {
        return (
          <>
            <Button
              isLoading={isWaiting}
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
              onClick={onOpen}
            >
              {speculation?.upperAmount === 0 ||
              speculation?.lowerAmount === 0 ||
              speculation?.winSide === "Invalid"
                ? "Claim (position invalid)"
                : "Claim"}
            </Button>
            <ClaimModal
              isOpenParent={isOpen}
              isCloseParent={onClose}
              speculation={speculation}
              contest={contest}
              position={position}
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
        Number(BigInt(position.contributedUponCreation) / BigInt(1e18)) +
          Number(BigInt(position.contributedUponClaim) / BigInt(1e18)) <=
          0
      ) {
        return (
          <Text fontSize="sm" fontWeight="semibold">
            Successful claim:{" "}
            {Number(BigInt(position.amountClaimed) / BigInt(1e18)).toFixed(2)}{" "}
            USDC
          </Text>
        )
      }

      if (
        position.claimed &&
        Number(BigInt(position.contributedUponCreation) / BigInt(1e18)) +
          Number(BigInt(position.contributedUponClaim) / BigInt(1e18)) >
          0
      ) {
        return (
          <>
            <Text fontSize="sm" fontWeight="semibold">
              Successful claim:{" "}
              {Number(BigInt(position.amountClaimed) / BigInt(1e18)).toFixed(2)}{" "}
              USDC
            </Text>
            <Text fontSize="sm" fontWeight="semibold">
              Contributed:{" "}
              {(
                Number(
                  BigInt(position.contributedUponCreation) / BigInt(1e18)
                ) + Number(BigInt(position.contributedUponClaim) / BigInt(1e18))
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

  return (
    <Flex alignItems="center" wrap="wrap" w="100%" ml="5" mb="5">
      <Box
        maxW="sm"
        minW="sm"
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
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" mb="0.5">
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
              ? new Date(contest?.eventTime * 1000).toLocaleString("en-EN", {
                  timeStyle: "short",
                  dateStyle: "medium",
                })
              : ""}{" "}
            PST
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
                  ? `Speculated: ${Number(
                      BigInt(position.amount) / BigInt(1e18)
                    ).toFixed(2)} USDC`
                  : ""}
              </Text>
              {BigInt(position.contributedUponCreation) > 0 ? (
                <Text fontSize="sm" fontWeight="semibold">
                  {`Contributed: ${Number(
                    BigInt(position.contributedUponCreation) / BigInt(1e18)
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
  )
}
