import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getEncryptedSecretsUrls } from "../scripts/getEncryptedSecretsUrls"
import { linkTokenAddress, subscriptionId } from "../constants/functions"
import { ContestOracleResolvedAddress } from "../constants/addresses"
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db } from "../utils/firebase"

const getContestRef = async (jsonoddsID: string) => {
  const contestsRef = collection(db, 'contests')
  const q = query(contestsRef, where("jsonoddsID", "==", jsonoddsID))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) {
    throw new Error("Contest not found")
  }
  return querySnapshot.docs[0].ref
}

export const createContest = async (
  rundownID: string,
  sportspageID: string,
  jsonoddsID: string,
  source: string,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void,
  provider: JsonRpcProvider | undefined | null,
  contestOracleResolvedContract: Contract | undefined | null
) => {
  try {
    startWaiting()
    onModalOpen()
    const contestRef = await getContestRef(jsonoddsID)
    await updateDoc(contestRef, {
      status: 'Pending',
    })    
    const encryptedSecretsUrls =
      await getEncryptedSecretsUrls()
    const gasLimit = 300000
    const linkAmount = ethers.utils.parseUnits(
      "0.0125",
      18
    )
    const IERC20_ABI = [
      "function approve(address spender, uint256 amount) external returns (bool)",
    ]
    const linkTokenContract = new ethers.Contract(
      linkTokenAddress,
      IERC20_ABI,
      provider!.getSigner()
    )
    const approvalTx = await linkTokenContract.approve(
      ContestOracleResolvedAddress,
      linkAmount
    )
    await approvalTx.wait()
    const createContestTx =
      await contestOracleResolvedContract!.createContest(
        rundownID,
        sportspageID,
        jsonoddsID,
        source,
        encryptedSecretsUrls,
        subscriptionId,
        gasLimit,
        { gasLimit: 1000000 }
      )
    await createContestTx.wait()
    onModalClose()
  } catch (error) {
    console.error("an error has occurred:", error)
    const contestRef = await getContestRef(jsonoddsID)
    await updateDoc(contestRef, {
      status: 'Ready',
    })    
    onModalClose()
  } finally {
    stopWaiting()
  }
}
