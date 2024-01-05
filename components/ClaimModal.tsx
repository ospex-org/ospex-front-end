import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  FormHelperText,
  useColorModeValue,
  Text,
  SimpleGrid,
  Box,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { contest, position, speculation } from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"
import { createSpeculationDescriptions } from "../functions/createDescriptions"
import { handleFocus } from "../scripts/handleFocus"

type ClaimModalProps = {
  isOpenParent: boolean
  isCloseParent: () => void
  onClaim: (contribution: number | string) => void
  speculation?: speculation
  contest?: contest
  position: position
  claimableAmount: string | number
}

export function ClaimModal({
  isOpenParent,
  isCloseParent,
  onClaim,
  speculation,
  contest,
  position,
  claimableAmount
}: ClaimModalProps) {
  const { provider, cfpContract, startWaiting, stopWaiting } =
    useContext(ProviderContext)
  const [contribution, setContribution] = useState<string | number>(0)
  const speculationDescriptions = createSpeculationDescriptions(
    speculation!,
    contest!
  )

  return (
    <>
      <Modal
        size={"sm"}
        isCentered
        isOpen={isOpenParent}
        onClose={() => {
          setContribution(0)
          isCloseParent()
        }}
      >
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent>
          <ModalHeader>
            {/* {`${contest?.awayTeam} at ${contest?.homeTeam}`} */}
            {speculationDescriptions
              ? position.positionType === "Away" ||
                position.positionType === "Over"
                ? speculationDescriptions.upperSpeculationTranslation
                : speculationDescriptions.lowerSpeculationTranslation
              : ""}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">Click submit to claim</Text>
            <br />
            <FormControl>
              <SimpleGrid columns={2} spacing={1} mb={3}>
                <Box>
                  <FormLabel htmlFor="amount">Claim (USDC)</FormLabel>
                </Box>
                <Box>
                  <FormLabel htmlFor="contribution">Contribute (USDC)</FormLabel>
                </Box>
                <Box>
                  <NumberInput
                    value={(claimableAmount ? +claimableAmount : 0) - +contribution}
                    width="125px"
                    isReadOnly
                  >
                    <NumberInputField id="amount" onFocus={handleFocus} disabled />
                  </NumberInput>
                </Box>
                <Box>
                  <NumberInput
                    defaultValue={0}
                    min={0}
                    max={+claimableAmount}
                    step={1}
                    width="125px"
                    value={+contribution}
                    onChange={setContribution}
                  >
                    <NumberInputField id="contribution" onFocus={handleFocus} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>(Not required)</FormHelperText>
                </Box>
              </SimpleGrid>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              fontWeight="bold"
              variant="outline"
              size="sm"
              borderColor="gray.300"
              bg={useColorModeValue("#f3f4f6", "#272b33")}
              color={useColorModeValue("black", "white")}
              mb={1.5}
              mr={3}
              onClick={() => onClaim(contribution)}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
