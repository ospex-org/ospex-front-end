import { useState, useEffect } from 'react'
import { db } from '../utils/firebase'
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { CreatedSpeculation } from '../constants/interface'

const useCreatedSpeculations = () => {
  const [createdSpeculations, setCreatedSpeculations] = useState<CreatedSpeculation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const now = Timestamp.fromDate(new Date())
    const speculationsQuery = query(
      collection(db, 'speculations'),
      where('lockTime', '>', now),
      orderBy('lockTime', 'asc')
    )

    const unsubscribe = onSnapshot(speculationsQuery, (querySnapshot) => {
      const speculationsArray: CreatedSpeculation[] = []
      querySnapshot.forEach((doc) => {
        const speculation = { ...doc.data(), id: doc.id } as CreatedSpeculation
        speculationsArray.push(speculation)
      })
      setCreatedSpeculations(speculationsArray)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching speculations:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { createdSpeculations, loading }
}

export default useCreatedSpeculations
