import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { SpeculationMoneylineAddress, SpeculationSpreadAddress, SpeculationTotalAddress } from "../constants/addresses"
import { db } from "../utils/firebase"
import { Contract } from "ethers"

export const createSpreadSpeculation = async (
  contestId: string,
  MatchTime: Timestamp,
  theNumber: string,
  cfpContract: Contract | undefined | null,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void,
) => {
  try {
    startWaiting()
    onModalOpen()
    const speculationIdentifier = `${contestId}-${SpeculationSpreadAddress}`
    const speculationRef = doc(db, 'speculations', speculationIdentifier)
    const parseFloatTheNumber = parseFloat(theNumber)
    await setDoc(speculationRef, {
      contestId,
      lockTime: MatchTime,
      speculationScorer: SpeculationSpreadAddress,
      theNumber: parseFloatTheNumber,
      status: 'Pending',
    })
    const convertTheNumberForSpread = parseFloatTheNumber > 0 ? Math.ceil(parseFloatTheNumber) : Math.floor(parseFloatTheNumber)
    const createSpeculationTx = 
      await cfpContract!.createSpeculation(
        Number(contestId),
        MatchTime.seconds,
        SpeculationSpreadAddress,
        convertTheNumberForSpread
      )
    await createSpeculationTx.wait()
    onModalClose()
  } catch (error) {
    console.error("an error has occurred:", error)
    const speculationRef = doc(db, 'speculations', `${contestId}-${SpeculationSpreadAddress}`)
    await updateDoc(speculationRef, {
      status: 'Ready',
    })
    onModalClose()
  } finally {
    stopWaiting()
  }
}

export const createTotalSpeculation = async (
  contestId: string,
  MatchTime: Timestamp,
  theNumber: string,
  cfpContract: Contract | undefined | null,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void,
) => {
  try {
    startWaiting()
    onModalOpen()
    const speculationIdentifier = `${contestId}-${SpeculationTotalAddress}`
    const speculationRef = doc(db, 'speculations', speculationIdentifier)
    const parseFloatTheNumber = parseFloat(theNumber)
    await setDoc(speculationRef, {
      contestId,
      lockTime: MatchTime,
      speculationScorer: SpeculationTotalAddress,
      theNumber: parseFloatTheNumber,
      status: 'Pending',
    })
    const convertTheNumberForTotal = Math.round(parseFloatTheNumber)
    const createSpeculationTx = 
      await cfpContract!.createSpeculation(
        Number(contestId),
        MatchTime.seconds,
        SpeculationTotalAddress,
        convertTheNumberForTotal
      )
    await createSpeculationTx.wait()
    onModalClose()
  } catch (error) {
    console.error("an error has occurred:", error)
    const speculationRef = doc(db, 'speculations', `${contestId}-${SpeculationTotalAddress}`)
    await updateDoc(speculationRef, {
      status: 'Ready',
    })
    onModalClose()
  } finally {
    stopWaiting()
  }
}

export const createMoneylineSpeculation = async (
  contestId: string,
  MatchTime: Timestamp,
  cfpContract: Contract | undefined | null,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void,
) => {
  try {
    startWaiting()
    onModalOpen()
    const speculationIdentifier = `${contestId}-${SpeculationMoneylineAddress}`
    const speculationRef = doc(db, 'speculations', speculationIdentifier)
    await setDoc(speculationRef, {
      contestId,
      lockTime: MatchTime,
      speculationScorer: SpeculationMoneylineAddress,
      theNumber: 0,
      status: 'Pending',
    })
    const createSpeculationTx = 
      await cfpContract!.createSpeculation(
        Number(contestId),
        MatchTime.seconds,
        SpeculationMoneylineAddress,
        0
      )
    await createSpeculationTx.wait()
    onModalClose()
  } catch (error) {
    console.error("an error has occurred:", error)
    const speculationRef = doc(db, 'speculations', `${contestId}-${SpeculationMoneylineAddress}`)
    await updateDoc(speculationRef, {
      status: 'Ready',
    })
    onModalClose()
  } finally {
    stopWaiting()
  }
}