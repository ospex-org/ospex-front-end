import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useColorModeValue, Text } from "@chakra-ui/react";
import { useUserActivity } from "../contexts/UserActivityContext";

const InactivityModal = () => {
  const { showModal, setShowModal, setPolling } = useUserActivity();

  const handleContinue = () => {
    setShowModal(false);
    setPolling(true);
  };

  return (
    <Modal size={"sm"} isCentered isOpen={showModal} onClose={handleContinue}>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader textAlign="center">Are you still there?</ModalHeader>
        <ModalBody>
          <Text fontSize="sm" textAlign="center">
            You appear to be inactive. Continue using ospex.org?
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button variant="ghost" mb={2} onClick={handleContinue}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InactivityModal;
