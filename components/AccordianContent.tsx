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
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import { CFPv1Address } from "../constants/addresses"
import { speculation } from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"

type AccordianContentProps = {
  speculation?: speculation
  speculationDescription?: string
  speculationPositionTypeEnum?: number
}

export function AccordianContent({
  speculation,
  speculationDescription,
  speculationPositionTypeEnum,
}: AccordianContentProps) {
  const {
    provider,
    USDCContract,
    cfpContract,
    balance,
    approvedAmount,
    setApprovedAmount,
    isWaiting,
    setIsWaiting,
  } = useContext(ProviderContext)
  const [isApproved, setIsApproved] = useState(false)
  const [amount, setAmount] = useState<string | number>(1)
  const [contribution, setContribution] = useState<string | number>(0)
  const [total, setTotal] = useState<number>(1)

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

  return (
    <>
      <Text fontWeight="bold" mt={2} mb={2}>
        {speculationDescription}
      </Text>
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
              max={10}
            >
              <NumberInputField id="amount" />
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
            >
              <NumberInputField id="contribution" />
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
            Limit set to 10 USDC, contract is unaudited
          </Text>
        </Box>
        <Divider />
        <SimpleGrid columns={1} mt={3}>
          <Box>
            <Button
              mr={3}
              isLoading={isWaiting}
              loadingText="Awaiting confirmation"
              disabled={
                !provider || isWaiting || balance < +amount + +contribution
              }
              onClick={() => {
                if (provider && !isApproved) {
                  ;(async () => {
                    try {
                      const approveTx = await USDCContract!.approve(
                        CFPv1Address,
                        (total * 1e18).toString()
                      )
                      setIsWaiting(true)
                      await approveTx.wait()
                      setIsApproved(true)
                      setIsWaiting(false)
                      setApprovedAmount(total)
                    } catch (error) {
                      console.error("an error has occurred:", error)
                    }
                  })()
                } else if (provider && isApproved) {
                  if (speculation) {
                    ;(async () => {
                      try {
                        const approveTx = await cfpContract!.createPosition(
                          speculation.id,
                          ethers.utils.parseUnits(amount.toString(), 18),
                          ethers.utils.parseUnits(contribution.toString(), 18),
                          speculationPositionTypeEnum
                        )
                        setIsWaiting(true)
                        await approveTx.wait()
                        const newApprovedAmount =
                          approvedAmount - +amount - +contribution
                        if (approvedAmount < +amount + +contribution) {
                          setIsApproved(false)
                        }
                        setApprovedAmount(newApprovedAmount)
                        setIsWaiting(false)
                      } catch (error) {
                        console.error("an error has occurred:", error)
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
                : "(2 of 2) Create position"}
            </Button>
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
