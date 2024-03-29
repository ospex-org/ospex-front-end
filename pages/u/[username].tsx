import { useRouter } from "next/router"
import React from "react"
import { useAddressResolution } from "../../hooks/useAddressResolution"
import { client } from "../../utils/apolloClient"
import { Header } from "../../components/Header"
import { Center, useColorModeValue, Box, Text, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Flex } from "@chakra-ui/react"
import { useUserStatistics } from "../../hooks/useUserStatistics"
import { useUserQueryResults } from "../../hooks/useUserQueryResults"
import UserPositions from "../../components/UserPositions"
import { Footer } from "../../components/Footer"

const UserProfile: React.FC = () => {
  const router = useRouter()
  const { username } = router.query
  const hoverBgLight = "gray.200"
  const hoverBgDark = "gray.700"

  const resolvedAddress = useAddressResolution(
    typeof username === "string" ? username : ""
  )

  const {
    userTotalSpeculated,
    userTotalClaimed,
    userTotalClaimable,
    userTotalContributed,
    userTotalLost,
    userTotalPending,
    userWins,
    userLosses,
    userTies,
    userNet,
  } = useUserStatistics(client, resolvedAddress.toLowerCase())

  const { detailedPositions } = useUserQueryResults(client, resolvedAddress.toLowerCase())

  return (
    <>
      <Header></Header>
      <Center>
        <Flex justifyContent="center" alignItems="center" width="100%">
          <Box flexDirection="column" alignContent="center" mt="100px" textAlign="center">
            <Text
              textTransform="none"
              fontWeight="bold"
              fontSize="20px"
              pt={50}
              pb={1}
              color={useColorModeValue("black", "white")}
            >
              {username}
            </Text>
            <Text
              textTransform="none"
              fontWeight="normal"
              fontSize="14px"
              pb={1}
              color={useColorModeValue("black", "white")}
            >
              {resolvedAddress === username ? "" : resolvedAddress}
            </Text>
            <Text
              textTransform="none"
              fontWeight="bold"
              fontSize="16px"
              pb={1}
              color={useColorModeValue("black", "white")}
            >
              {userNet > 0 ? "+" : ""}{userNet.toFixed(2)} ({userWins}-{userLosses}-{userTies})
            </Text>
            <Box
              width="380px"
              maxW="md"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              fontWeight="semibold"
              m="auto"
            >
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th textAlign="left" pb={2}>Statistics</Th>
                      <Th textAlign="right" pb={2}>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody fontSize="14px">
                    <Tr _hover={{
                      background: useColorModeValue(hoverBgLight, hoverBgDark),
                    }}>
                      <Td textAlign="left" py={1}>Speculated</Td>
                      <Td textAlign="right" py={1}>{userTotalSpeculated.toFixed(2)} USDC</Td>
                    </Tr>
                    <Tr _hover={{
                      background: useColorModeValue(hoverBgLight, hoverBgDark),
                    }}>
                      <Td textAlign="left" py={1}>Claimed</Td>
                      <Td textAlign="right" py={1}>{userTotalClaimed.toFixed(2)} USDC</Td>
                    </Tr>
                    <Tr _hover={{
                      background: useColorModeValue(hoverBgLight, hoverBgDark),
                    }}>
                      <Td textAlign="left" py={1}>Claimable</Td>
                      <Td textAlign="right" py={1}>{userTotalClaimable.toFixed(2)} USDC</Td>
                    </Tr>
                    <Tr _hover={{
                      background: useColorModeValue(hoverBgLight, hoverBgDark),
                    }}>
                      <Td textAlign="left" py={1}>Contributed</Td>
                      <Td textAlign="right" py={1}>{userTotalContributed.toFixed(2)} USDC</Td>
                    </Tr>
                    <Tr _hover={{
                      background: useColorModeValue(hoverBgLight, hoverBgDark),
                    }}>
                      <Td textAlign="left" py={1}>Lost</Td>
                      <Td textAlign="right" py={1}>{userTotalLost.toFixed(2)} USDC</Td>
                    </Tr>
                    <Tr _hover={{
                      background: useColorModeValue(hoverBgLight, hoverBgDark),
                    }}>
                      <Td textAlign="left" py={1}>Pending</Td>
                      <Td textAlign="right" py={1}>{userTotalPending.toFixed(2)} USDC</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            <UserPositions userPositions={detailedPositions} />
            <Footer />
          </Box>
        </Flex>
      </Center>
    </>
  )
}

export default UserProfile
