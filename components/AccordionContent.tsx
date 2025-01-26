import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import { CFPv1Address } from "../constants/addresses"
import { speculation, contest } from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"
import { TransactionStatusModal } from "./TransactionStatusModal"
import { handleFocus } from "../scripts/handleFocus"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShirt } from '@fortawesome/free-solid-svg-icons'
import ShimmerText from './ShimmerText'
import { TEAM_COLORS } from "../constants/teamColors"

type AccordionContentProps = {
  speculation?: speculation
  speculationDescription?: string
  speculationPositionTypeEnum?: number
  contest?: contest
  selectedButton?: 'yes' | 'no' | null
}

export function AccordionContent({
  speculation,
  speculationDescription,
  speculationPositionTypeEnum,
  contest,
  selectedButton,
}: AccordionContentProps) {
  const {
    provider,
    USDCContract,
    cfpContract,
    isConnected,
    balance,
    approvedAmount,
    setApprovedAmount,
    isWaiting,
    startWaiting,
    stopWaiting,
    loadingButtonId,
  } = useContext(ProviderContext)
  const [isApproved, setIsApproved] = useState(false)
  const [amount, setAmount] = useState<string | number>(1)
  const [contribution, setContribution] = useState<string | number>(0)
  const [total, setTotal] = useState<number>(1)
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Create unique button IDs for approve and create position actions
  const approveButtonId = `approve-position-${speculation?.id}`
  const createPositionButtonId = `create-position-${speculation?.id}`

  useEffect(() => {
    if (total > approvedAmount) {
      setIsApproved(false)
    } else {
      setIsApproved(true)
    }
  }, [total, approvedAmount, isApproved])

  useEffect(() => {
    setTotal(+amount + +contribution)
  }, [amount, contribution])

  // Function to get the relevant team name based on the description
  const getTeamFromDescription = (description: string | undefined, contest: contest | undefined) => {
    if (!description || !contest) return ""
    // If description includes "win", use the team name before "win"
    if (description.includes("win")) {
      const teamName = description.split(" to")[0]
      return teamName
    }
    return ""
  }

  return (
    <>
      <Box p={2}>
        <Box display="flex" alignItems="center" fontWeight="bold">
          <FontAwesomeIcon
            icon={faShirt}
            color={TEAM_COLORS[getTeamFromDescription(speculationDescription, contest)] || "gray.400"}
            fontSize="12px"
            style={{ marginRight: "8px" }}
          />
          <ShimmerText>
            {speculationDescription}
          </ShimmerText>
        </Box>
      </Box>
      <FormControl>
        <SimpleGrid columns={2} spacing={1} mb={3}>
          <Box>
            <FormLabel htmlFor="amount">Amount (USDC)</FormLabel>
          </Box>
          <Box>
            <FormLabel htmlFor="contribution">Contribute (USDC)</FormLabel>
          </Box>
          <Box>
            <NumberInput
              defaultValue={1}
              min={1}
              step={1}
              width="125px"
              value={+amount}
              onChange={setAmount}
              max={1000}
            >
              <NumberInputField id="amount" onFocus={handleFocus} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box>
            <NumberInput
              defaultValue={0}
              min={0}
              step={1}
              width="125px"
              value={+contribution}
              onChange={setContribution}
              isDisabled={!isApproved || approvedAmount === 0}
            >
              <NumberInputField id="contribution" onFocus={handleFocus} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box></Box>
          <Box>
            <FormHelperText ml="1">(Not required)</FormHelperText>
          </Box>
        </SimpleGrid>
        <Box pb="2">
          <Text as="b" color="red">
            {/* Limit set to 1,000 USDC, contract is unaudited */}
          </Text>
        </Box>
        <Divider />
        <SimpleGrid columns={1} mt={3}>
          <Box>
            <Button
              mr={3}
              isLoading={isWaiting && loadingButtonId === (isApproved ? createPositionButtonId : approveButtonId)}
              loadingText="Awaiting confirmation"
              isDisabled={
                !provider ||
                !isConnected ||
                isWaiting ||
                (isApproved && balance < Math.max(1, +amount + +contribution))
              }
              onClick={() => {
                if (provider && !isApproved) {
                  ; (async () => {
                    try {
                      startWaiting(approveButtonId)
                      onOpen()
                      const approveTx = await USDCContract!.approve(
                        CFPv1Address,
                        (total * 1e6).toString()
                      )
                      await approveTx.wait()
                      setIsApproved(true)
                      setApprovedAmount(total)
                      onClose()
                    } catch (error) {
                      console.error("an error has occurred:", error)
                      onClose()
                    } finally {
                      stopWaiting()
                    }
                  })()
                } else if (provider && isApproved) {
                  if (speculation) {
                    ; (async () => {
                      try {
                        startWaiting(createPositionButtonId)
                        onOpen()
                        const approveTx = await cfpContract!.createPosition(
                          speculation.id,
                          ethers.utils.parseUnits(amount.toString(), 6),
                          ethers.utils.parseUnits(contribution.toString(), 6),
                          speculationPositionTypeEnum
                        )
                        await approveTx.wait()
                        const newApprovedAmount =
                          approvedAmount - +amount - +contribution
                        if (approvedAmount < +amount + +contribution) {
                          setIsApproved(false)
                        }
                        setApprovedAmount(newApprovedAmount)
                        onClose()
                      } catch (error) {
                        console.error("an error has occurred:", error)
                        onClose()
                      } finally {
                        stopWaiting()
                      }
                    })()
                  }
                }
              }}
            >
              {!provider
                ? "Please connect wallet"
                : !isApproved
                  ? "(1 of 2) Approve amount first"
                  : balance < 1
                    ? "Insufficient USDC"
                    : "(2 of 2) Create position"}
            </Button>
            <TransactionStatusModal isOpen={isOpen} onClose={onClose} stopWaiting={stopWaiting} />
            <Text
              fontSize="xs"
              fontWeight="semibold"
              mt="2"
              fontStyle="citation"
            >
              {provider && !isApproved
                ? "Please click Connect in the top-right to connect your wallet"
                : ""}
            </Text>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              mt="2"
              fontStyle="citation"
            >
              {provider && !isApproved
                ? "If your wallet is already connected, please ensure you are on Polygon network"
                : ""}
            </Text>
          </Box>
        </SimpleGrid>
      </FormControl>
    </>
  )
}
