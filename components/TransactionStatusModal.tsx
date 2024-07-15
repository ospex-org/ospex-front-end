import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useColorModeValue,
  Progress,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  Flex
} from "@chakra-ui/react"

type TransactionStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  stopWaiting: () => void
}

export function TransactionStatusModal({
  isOpen,
  onClose,
  stopWaiting
}: TransactionStatusModalProps) {
  const bgColor = useColorModeValue("gray.100", "gray.700")

  return (
    <>
      <Modal size={"md"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent>
          <ModalHeader>Transaction Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Progress size="xs" isIndeterminate />
            <Text mt={4} fontWeight="bold">
              Awaiting transaction confirmation...
            </Text>
            <Text fontSize="sm">
              This may take a few minutes. Most wallets will notify you once the transaction has been processed.
            </Text>
          </ModalBody>
          <ModalFooter flexDirection="column" alignItems="flex-start">
            <Button variant="ghost" mb={2} alignSelf="flex-end" onClick={onClose}>
              Close
            </Button>
            <Accordion allowToggle w="100%">
              <AccordionItem border="none">
                <AccordionButton _hover={{ bg: "none" }}>
                  <Box flex="1" textAlign="left">
                    <Text fontSize="sm">
                      If this transaction is taking too long, click for options
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <List spacing={2} styleType="disc">
                    <ListItem fontSize="sm">
                      Blockchain transaction speed can vary based on network traffic. You may need to cancel the transaction using your wallet and retry with a higher gas fee.
                    </ListItem>
                    <ListItem fontSize="sm">
                      Ensure that you have the necessary tokens in your wallet (MATIC and USDC) and that you have enough MATIC to cover the transaction fee.
                    </ListItem>
                    <ListItem fontSize="sm">
                      You can cancel the loading state using the button below, however you may also need to cancel the transaction using your wallet.
                    </ListItem>
                  </List>
                  <Flex justify="flex-end">
                    <Button mt={4} variant="ghost" onClick={() => {
                      stopWaiting();
                      onClose();  // Close the modal after stopping the waiting
                    }}>
                      Cancel Loading State
                    </Button>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
