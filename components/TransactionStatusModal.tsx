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
} from "@chakra-ui/react"

type TransactionStatusModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function TransactionStatusModal({
  isOpen,
  onClose,
}: TransactionStatusModalProps) {
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
              This may take a few minutes. Most wallets will notify you once the
              transaction has been processed.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
