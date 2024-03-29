import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box, Badge, useColorModeValue, Heading, Divider, useBreakpointValue, Center } from '@chakra-ui/react'
import { userPosition } from '../constants/interface'
import { finalOddsDescription } from '../functions/finalOddsDescription'
import { SpeculationMoneylineAddress, SpeculationSpreadAddress, SpeculationTotalAddress } from "../constants/addresses"

interface UserPositionsProps {
  userPositions: userPosition[]
}

interface PositionData {
  teamDisplayName: JSX.Element | string
  positionDisplayName: JSX.Element | string
  payoutDisplayStatus: string
  result: string
}

const UserPositions: React.FC<UserPositionsProps> = ({ userPositions }) => {
  const textColor = useColorModeValue('black', 'white')
  const winColor = useColorModeValue('green.600', 'green.200')
  const lossColor = useColorModeValue('red.600', 'red.200')
  const fontSize = useBreakpointValue({ base: '12px', md: '14px' })
  const tableWidth = useBreakpointValue({ base: '95%', md: '600px' })
  const px = useBreakpointValue({ base: 0.5, md: 1 })

  const sortedPositions = [...userPositions].sort(
    (a, b) => b.speculation.contest.eventTime - a.speculation.contest.eventTime
  )

  const pendingPositions = sortedPositions.filter(
    (pos) => pos.speculation.speculationStatus !== 'Closed'
  )

  const nonPendingPositions = sortedPositions.filter(
    (pos) => pos.speculation.speculationStatus === 'Closed'
  )

  const determinePositionData = (position: userPosition): PositionData => {
    const { speculation, amount } = position
    const { contest } = speculation

    let teamDisplayName
    let positionDisplayName
    let payoutDisplayStatus = ""

    const result = ((finalOddsDescription({ ...speculation, positions: [] }, position)!.finalOdds * amount) / 1e6).toFixed(2)

    if (speculation.speculationScorer === SpeculationTotalAddress.toLowerCase()) teamDisplayName = (<>{`${contest.awayTeam} at`}<br />{`${contest.homeTeam}`}</>)
    else teamDisplayName = position.positionType === "Away" ? contest.awayTeam : contest.homeTeam

    if (speculation.speculationScorer === SpeculationTotalAddress.toLowerCase()) positionDisplayName = (<>{`${position.positionType}`}<br />{`${speculation.theNumber}`}</>)
    else if (speculation.speculationScorer === SpeculationSpreadAddress.toLowerCase())
      positionDisplayName = position.positionType === "Away" && speculation.theNumber > 0 ? `${speculation.theNumber + 0.5}` : `-${speculation.theNumber + 0.5}`
    else if (speculation.speculationScorer === SpeculationMoneylineAddress.toLowerCase()) positionDisplayName = "ML"
    else positionDisplayName = ""

    if (contest.contestStatus === "Void" ||
      speculation.winSide === "Push" ||
      speculation.winSide === "Forfeit" ||
      speculation.winSide === "Invalid" ||
      speculation.winSide === "Void") payoutDisplayStatus = "Push"
    else if (speculation.speculationStatus !== "Closed") payoutDisplayStatus = "Pending"
    else if (position.positionType === speculation.winSide) payoutDisplayStatus = `+${result}`
    else if (position.positionType !== speculation.winSide) payoutDisplayStatus = `-${(position.amount / 1e6).toFixed(2)}`

    return {
      teamDisplayName,
      positionDisplayName,
      payoutDisplayStatus,
      result
    }
  }

  const PositionTable = ({ positions, title, showResultColumn }: { positions: userPosition[]; title: string; showResultColumn?: boolean }) => (
    <>
      <Heading size="sm" mt="6">
        {title}
      </Heading>
      <Divider mt="1" />
      <Table variant="simple" size="sm">
        <Thead display="none">
          <Tr>
            <Th>Date</Th>
            <Th>Lg</Th>
            <Th>Team</Th>
            <Th>Type</Th>
            <Th>Pos</Th>
            {showResultColumn && <Th isNumeric>Res</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {positions.map((position, index) => {
            const { teamDisplayName, positionDisplayName, payoutDisplayStatus, result } = determinePositionData(position)
            const positionLayout = showResultColumn
              ? <>{`${position.amount / 1e6} to win`}<br />{`${result}`}</>
              : `${position.amount / 1e6} to win ${result}`

            return (
              <Tr key={index}>
                <Td px={px} fontSize={fontSize}>{new Date(position.speculation.contest.eventTime * 1000).toLocaleDateString()}</Td>
                <Td px={px} fontSize={fontSize}><Badge>{position.speculation.contest.league}</Badge></Td>
                <Td px={px} fontSize={fontSize}>{teamDisplayName}</Td>
                <Td px={px} fontSize={fontSize}>{positionDisplayName}</Td>
                <Td px={px} fontSize={fontSize}>{positionLayout}</Td>
                <Td
                  isNumeric
                  px={px}
                  fontSize={fontSize}
                  color={payoutDisplayStatus.startsWith('+') ? winColor : payoutDisplayStatus.startsWith('-') ? lossColor : textColor}>
                  {showResultColumn && payoutDisplayStatus}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </>
  )

  return (
    <>
      <Center>
        <Box overflowX="auto" mt="5" width={tableWidth}>
          {pendingPositions.length > 0 && <PositionTable positions={pendingPositions} title="Pending Positions" />}
          {nonPendingPositions.length > 0 && <PositionTable positions={nonPendingPositions} title="Position History" showResultColumn />}
        </Box>
      </Center>
      <Box w="100%" h="100px" pb={{ base: 8, md: 12 }} />
    </>
  )
}

export default UserPositions
