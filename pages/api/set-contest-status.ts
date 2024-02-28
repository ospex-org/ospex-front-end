import * as admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ContestStatusRequest {
  jsonoddsID: string
  status: string
}

interface ContestStatusResponse {
  success: boolean;
  message: string;
  error?: string;
}

if (admin.apps.length === 0) {
  // Parse the SERVICE_ACCOUNT_KEY environment variable
  const serviceAccount = process.env.SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.SERVICE_ACCOUNT_KEY)
      : undefined

  if (!serviceAccount) {
      console.error('Missing or invalid SERVICE_ACCOUNT_KEY environment variable')
      process.exit(1) // Exit if the service account key is not provided
  }

  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ContestStatusResponse>) {
  // Extract the Firebase Auth token sent from the frontend
  const authToken = req.headers.authorization?.split('Bearer ')[1]
  if (!authToken) {
    return res.status(401).json({ success: false, message: "Unauthorized, no auth token provided." })
  }

  const { jsonoddsID, status }: ContestStatusRequest = req.body

  try {
    // Verify the Firebase Auth token
    const decodedToken = await admin.auth().verifyIdToken(authToken)
    if (decodedToken) {
      const contestRef = admin.firestore().collection('contests').doc(jsonoddsID)

      await contestRef.update({
        status,
      })

      res.status(200).json({ success: true, message: "Contest status updated." })
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized, invalid or expired auth token." })
    }
  } catch (error) {
    console.error("Error updating contest:", error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    res.status(500).json({ success: false, message: "Failed to create speculation.", error: errorMessage })
  }
}
