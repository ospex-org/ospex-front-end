import {
  Container,
  Stack,
  ButtonGroup,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react"
import { FaGithub, FaTelegram } from "react-icons/fa"

export function Footer() {
  return (
    <Container
      as="footer"
      role="contentinfo"
      centerContent
      position="fixed"
      bottom="0"
      zIndex="1"
      pt="2"
      bg={useColorModeValue("white", "#1A202C")}
      color={useColorModeValue("#1A202C", "white")}
    >
      <Stack>
        <ButtonGroup variant="unstyled">
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
        </ButtonGroup>
      </Stack>
    </Container>
  )
}
