import * as admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

const { Timestamp } = admin.firestore

interface SpeculationStatusRequest {
  contestId: string
  MatchTime: admin.firestore.Timestamp
  adjustedNumber: number
  speculationScorer: string
  status: string
}

interface SpeculationStatusResponse {
  success: boolean;
  message: string;
  error?: string;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SpeculationStatusResponse>) {
  // Extract the Firebase Auth token sent from the frontend
  const authToken = req.headers.authorization?.split('Bearer ')[1]
  if (!authToken) {
    return res.status(401).json({ success: false, message: "Unauthorized, no auth token provided." })
  }

  const { contestId, MatchTime, adjustedNumber, speculationScorer, status }: SpeculationStatusRequest = req.body

  try {
    // Verify the Firebase Auth token
    const decodedToken = await admin.auth().verifyIdToken(authToken)
    if (decodedToken) {
      const speculationIdentifier = `${contestId}-${speculationScorer.toLowerCase()}`
      const speculationRef = admin.firestore().collection('speculations').doc(speculationIdentifier)

      const updatedSpeculation: {
        contestId: string,
        MatchTime: admin.firestore.Timestamp,
        adjustedNumber: number,
        speculationScorer: string,
        status: string,
        pendingTime?: admin.firestore.Timestamp,
      } = {
        contestId,
        MatchTime,
        adjustedNumber,
        speculationScorer: speculationScorer.toLowerCase(),
        status,
      }

      if (status === 'Pending') {
        updatedSpeculation.pendingTime = Timestamp.now()
      }
      await speculationRef.set(updatedSpeculation)

      res.status(200).json({ success: true, message: "Speculation created successfully and status updated." })
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized, invalid or expired auth token." })
    }
  } catch (error) {
    console.error("Error creating speculation:", error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    res.status(500).json({ success: false, message: "Failed to create speculation.", error: errorMessage })
  }
}
