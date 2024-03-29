import {
  Container,
  Stack,
  ButtonGroup,
  IconButton,
  useColorModeValue,
  Box,
} from "@chakra-ui/react"
import { FaGithub, FaTelegram } from "react-icons/fa"
import { SiDocusaurus } from "react-icons/si"

export function Footer() {
  return (
    <Box
      as="footer"
      role="contentinfo"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="1"
      pt="2"
      width="full"
      bg={useColorModeValue("white", "#1A202C")}
      color={useColorModeValue("#1A202C", "white")}
    >
      <Stack>
        <ButtonGroup variant="unstyled" justifyContent="center">
          <IconButton
            as="a"
            href="https://github.com/ospex-org"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.5rem" />}
            target="_blank"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
          <IconButton
            as="a"
            href="https://t.me/ospex"
            aria-label="Telegram"
            icon={<FaTelegram fontSize="1.5rem" />}
            target="_blank"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
          <IconButton
            as="a"
            href="https://docs.ospex.org"
            aria-label="Documentation"
            icon={<SiDocusaurus fontSize="1.5rem" />}
            target="_blank"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
        </ButtonGroup>
      </Stack>
    </Box>
  )
}
