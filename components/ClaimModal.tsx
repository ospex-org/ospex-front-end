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
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useContext, useState } from "react"
import { contest, position, speculation } from "../constants/interface"
import { ProviderContext } from "../contexts/ProviderContext"
import { createSpeculationDescriptions } from "../functions/createDescriptions"

type ClaimModalProps = {
  isOpenParent: boolean
  isCloseParent: () => void
  speculation?: speculation
  contest?: contest
  position: position
}

export function ClaimModal({
  isOpenParent,
  isCloseParent,
  speculation,
  contest,
  position,
}: ClaimModalProps) {
  const { provider, cfpContract, setIsWaiting } = useContext(ProviderContext)
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
              <FormLabel htmlFor="contribution">Contribute (USDC)</FormLabel>
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
              <FormHelperText>(Not required)</FormHelperText>
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
              onClick={() => {
                if (provider) {
                  ;(async () => {
                    try {
                      const claimTx = await cfpContract!.claim(
                        Number(position.speculationId),
                        ethers.utils.parseUnits(contribution.toString(), 6)
                      )
                      isCloseParent()
                      setIsWaiting(true)
                      await claimTx.wait()
                      setIsWaiting(false)
                    } catch (error) {
                      console.error("an error has occurred:", error)
                    }
                  })()
                }
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
