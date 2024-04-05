import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// Assume these functions are properly typed in their definitions
// import { getContestData, getComments } from '../../utils/api';
import { contest } from "../../constants/interface"
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

  return (
    <>
    <Header></Header>
    <div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <h1>Contest: {contestDetails.awayTeam} vs {contestDetails.homeTeam}</h1>
      <section>
        {comments.map(comment => (
          <div key={comment.id}>{comment.text}</div>
        ))}
      </section>
    </div>
    </>
  )
}

export default ContestPage
