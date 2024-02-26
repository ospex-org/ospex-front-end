import { Timestamp } from "firebase/firestore"
import { signInAnonymously } from "firebase/auth"
import { SpeculationMoneylineAddress, SpeculationSpreadAddress, SpeculationTotalAddress } from "../constants/addresses"
import { Contract } from "ethers"
import { auth } from "../utils/firebase"
import { updateSpeculationStatus } from "./updateSpeculationStatus"

interface CreateSpeculationParams {
  contestId: string
  MatchTime: Timestamp
  theNumber?: string
  speculationScorer: string
  cfpContract: Contract | undefined | null,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void
}

export const createSpeculation = async ({
  contestId,
  MatchTime,
  theNumber = "0",
  speculationScorer,
  cfpContract,
  startWaiting,
  stopWaiting,
  onModalOpen,
  onModalClose
}: CreateSpeculationParams): Promise<void> => {

  let adjustedNumber = theNumber
  if (speculationScorer === SpeculationSpreadAddress) {
    adjustedNumber = Math.floor(parseFloat(theNumber)).toString()
  } else if (speculationScorer === SpeculationTotalAddress) {
    adjustedNumber = Math.round(parseFloat(theNumber)).toString()
  } else if (speculationScorer === SpeculationMoneylineAddress) {
    adjustedNumber = "0"
  }

  try {
    await signInAnonymously(auth)
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("Failed to sign in anonymously")
    }

    const idToken = await currentUser.getIdToken()
    startWaiting()
    onModalOpen()

    await updateSpeculationStatus({
      contestId,
      MatchTime: MatchTime.toMillis(),
      adjustedNumber,
      speculationScorer,
      status: 'Pending',
      idToken,
    })

    const createSpeculationTx = await cfpContract!.createSpeculation(
      Number(contestId),
      MatchTime.seconds,
      speculationScorer,
      Number(adjustedNumber)
    )
    await createSpeculationTx.wait()

  } catch (error) {
    console.error("Error calling setSpeculationStatus:", error)
    const currentUser = auth.currentUser
    await updateSpeculationStatus({
      contestId,
      MatchTime: MatchTime.toMillis(),
      adjustedNumber,
      speculationScorer,
      status: 'Error',
      idToken: await currentUser?.getIdToken(),
    })
    throw error
  } finally {
    stopWaiting()
    onModalClose()
  }
}