import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// Assume these functions are properly typed in their definitions
// import { getContestData, getComments } from '../../utils/api';
import { Box, Badge, Text, Flex, SimpleGrid, Divider } from '@chakra-ui/react'
import { SpeculationCard } from '../../components/Speculation'
import { contest, speculation, position } from "../../constants/interface"
import { client } from "../../utils/apolloClient"
import { useContestDetails } from "../../hooks/useContestDetails"
import { Header } from '../../components/Header';

interface Comment {
  id: string
  text: string
}

const ContestPage: React.FC = () => {
  const router = useRouter()
  const contestId = parseInt(router.query.contestId as string, 10)
  const [comments, setComments] = useState<Comment[]>([])

  const { contestDetails, isLoading, error } = useContestDetails(client, contestId)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !contestDetails) {
    return <div>Error: {error ? error.message : 'Contest not found'}</div>
  }

  const formatDate = (date: number) => {
    return new Date(date * 1000).toLocaleString("en-US", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <>
      {/* <Header /> */}
      <Box p={4}>
        <Text fontSize="2xl" fontWeight="bold">{contestDetails.homeTeam} vs {contestDetails.awayTeam}</Text>
        <Badge colorScheme="green">{contestDetails.league}</Badge>
        <Text fontSize="md">{formatDate(contestDetails.eventTime)}</Text>
        <Text fontSize="lg">Status: {contestDetails.contestStatus}</Text>
        {/* {contestDetails.speculations.map((spec: speculation) => (
          <SpeculationCard key={spec.id} speculation={spec} contest={contestDetails} />
        ))} */}
      </Box>
      {/* <Divider my={4} /> */}
      {/* <Box>
        <Text fontSize="xl" mb={2}>Comments:</Text>
        {comments.map(comment => (
          <Box key={comment.id} p={3} shadow="md" borderWidth="1px">
            {comment.text}
          </Box>
        ))}
      </Box> */}
    </>
  )
}

export default ContestPage
