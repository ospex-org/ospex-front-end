import { useRouter } from "next/router"
import React from "react"
import { useAddressResolution } from "../../hooks/useAddressResolution"
import { client } from "../../utils/apolloClient"
import { Header } from "../../components/Header"
import { Center, useColorModeValue, Box, Text, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Flex, Spacer, Spinner } from "@chakra-ui/react"
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
    loading: isLoadingStatistics,
  } = useUserStatistics(client, resolvedAddress.toLowerCase())

  const { detailedPositions } = useUserQueryResults(client, resolvedAddress.toLowerCase(), 60000)

  // caused hooks error, removed
  // const isLoading = isLoadingStatistics // || isLoadingPositions;

  // if (isLoading) {
  //   return (
  //     <>
  //       <Flex direction="column" minH="100vh">
  //         <Header />
  //         <Box flex="1">
  //           <Center>
  //             <Flex direction="column" alignItems="center" w="100%" mt="100px">
  //               <Text
  //                 textTransform="none"
  //                 fontWeight="bold"
  //                 fontSize={username ? username.length > 36 ? '16px' : '20px' : '20px'}
  //                 pt={50}
  //                 pb={3}
  //                 color={useColorModeValue("black", "white")}
  //               >
  //                 {username}
  //               </Text>
  //               <Spinner size="xl" />
  //             </Flex>
  //           </Center>
  //         </Box >
  //       </Flex>
  //       <Footer />
  //     </>
  //   );
  // }

  return (
    <>
      <Flex direction="column" minH="100vh">
        <Header />
        <Box flex="1">
          <Center>
            <Flex direction="column" alignItems="center" w="100%" mt="100px">
              <Text
                textTransform="none"
                fontWeight="bold"
                fontSize={username ? username.length > 36 ? '16px' : '20px' : '20px'}
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
              <Spacer height="50px" />
            </Flex>
          </Center>
        </Box>
        <Footer />
      </Flex>
    </>
  )
}

export default UserProfile
