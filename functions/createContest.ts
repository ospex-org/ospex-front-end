import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getEncryptedSecretsUrls } from "../scripts/getEncryptedSecretsUrls"
import { linkTokenAddress, subscriptionId } from "../constants/functions"
import { ContestOracleResolvedAddress, ScoreContestHash } from "../constants/addresses"
import { auth } from "../utils/firebase"
import { signInAnonymously } from "firebase/auth"
import { updateContestStatus } from "./updateContestStatus"

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
): Promise<void> => {
  let transactionTimeout: NodeJS.Timeout | null = null

  try {

    if (!provider || !contestOracleResolvedContract) {
      throw new Error("Provider or contract is undefined")
    }

    await signInAnonymously(auth)
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("Failed to sign in anonymously")
    }

    const idToken = await currentUser.getIdToken()
    await updateContestStatus({ jsonoddsID, status: 'Pending', idToken })
    startWaiting()
    onModalOpen()
    transactionTimeout = setTimeout(async () => {
      // Transaction didn't proceed in time, revert state
      await updateContestStatus({
        jsonoddsID,
        status: 'Ready',
        idToken
      })
      onModalClose()
      stopWaiting()
    }, 300000) // 5 minutes timeout
    const encryptedSecretsUrls = await getEncryptedSecretsUrls()
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
        ScoreContestHash,
        encryptedSecretsUrls,
        subscriptionId,
        gasLimit,
        { gasLimit: 1000000 }
      )
    await createContestTx.wait()
  } catch (error) {
    console.error("an error has occurred:", error)
    const currentUser = auth.currentUser
    await updateContestStatus({
      jsonoddsID,
      status: 'Ready',
      idToken: await currentUser?.getIdToken()
    })
  } finally {
    if (transactionTimeout) {
      clearTimeout(transactionTimeout)
    }
    onModalClose()
    stopWaiting()
  }
}

