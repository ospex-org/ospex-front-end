import { useState, useEffect } from 'react'
import { db } from '../utils/firebase'
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { PotentialContest } from '../constants/interface'

const sportOrder: Record<number, number> = {
  4: 1, // NFL from Jsonodds
  1: 2, // NBA from Jsonodds
  0: 3, // MLB from Jsonodds
  5: 4, // NHL from Jsonodds
  3: 5, // NCAAF from Jsonodds
  2: 6, // NCAAB from Jsonodds
}

const sortPotentialContests = (a: PotentialContest, b: PotentialContest) => {
  // Compare by sport first
  const priorityA = sportOrder[a.Sport] || Number.MAX_SAFE_INTEGER
  const priorityB = sportOrder[b.Sport] || Number.MAX_SAFE_INTEGER
  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  // If sport leagues are the same, compare by MatchTime
  return a.MatchTime.toMillis() - b.MatchTime.toMillis()
}

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
      const sortedContests = contestsArray.sort(sortPotentialContests)
      setPotentialContests(sortedContests)
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
