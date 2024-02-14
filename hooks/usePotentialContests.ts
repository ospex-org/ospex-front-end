import { useState, useEffect } from 'react'
import { db } from '../utils/firebase'
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { PotentialContest } from '../constants/interface'

const usePotentialContests = () => {
  const [potentialContests, setPotentialContests] = useState<PotentialContest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const now = Timestamp.fromDate(new Date())
    const contestsQuery = query(
      collection(db, 'contests'),
      where('MatchTime', '>', now),
      orderBy('MatchTime', 'asc')
    )

    const unsubscribe = onSnapshot(contestsQuery, (querySnapshot) => {
      const contestsArray: PotentialContest[] = []
      querySnapshot.forEach((doc) => {
        const contest = { ...doc.data(), id: doc.id } as PotentialContest
        contestsArray.push(contest)
      })
      setPotentialContests(contestsArray)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching contests:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { potentialContests, loading }
}

export default usePotentialContests
