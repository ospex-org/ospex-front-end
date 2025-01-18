import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getEncryptedSecretsUrls } from "../../scripts/getEncryptedSecretsUrls"
import { linkTokenAddress, subscriptionId } from "../../constants/functions"
import { ContestOracleResolvedAddress, ScoreContestHashAlt } from "../../constants/addresses"
import { auth } from "../../utils/firebase"
import { signInAnonymously } from "firebase/auth"
import { updateContestStatus } from "../updateContestStatus"

export const scoreContestAlt = async (
  contestId: string,
  jsonoddsID: string,
  source: string,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void,
  provider: JsonRpcProvider | undefined | null,
  contestOracleResolvedContract: Contract | undefined | null
): Promise<void> => {
  try {

    if (!provider || !contestOracleResolvedContract) {
      throw new Error("Provider or contract is undefined")
    }

    // Currently not updating page with Firestore contest status
    // await signInAnonymously(auth)
    // const currentUser = auth.currentUser
    // if (!currentUser) {
    //   throw new Error("Failed to sign in anonymously")
    // }

    // const idToken = await currentUser.getIdToken()

    // await updateContestStatus({ jsonoddsID, status: 'Pending', idToken })
    startWaiting()
    onModalOpen()
    const encryptedSecretsUrls = await getEncryptedSecretsUrls()
    const gasLimit = 300000
    const linkAmount = ethers.utils.parseUnits("0.0125", 18)
    const IERC20_ABI = [
      "function approve(address spender, uint256 amount) external returns (bool)",
    ]
    const linkTokenContract = new ethers.Contract(
      linkTokenAddress,
      IERC20_ABI,
      provider.getSigner()
    )
    const approvalTx = await linkTokenContract.approve(
      ContestOracleResolvedAddress,
      linkAmount
    )
    await approvalTx.wait()
    const sourceHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(source));
    console.log({
      sourceHash,
      ScoreContestHashAlt,
      source: source.substring(0, 100) + "..."
    });
    const scoreContestTx =
      await contestOracleResolvedContract!.scoreContest(
        contestId,
        source,
        encryptedSecretsUrls,
        subscriptionId,
        gasLimit,
        { gasLimit: 1000000 }
      )
    await scoreContestTx.wait()
  } catch (error) {
    console.error("an error has occurred:", error)
    // Currently not updating page with Firestore contest status    
    // const currentUser = auth.currentUser
    // await updateContestStatus({
    //   jsonoddsID,
    //   status: 'Ready',
    //   idToken: await currentUser?.getIdToken()
    // })
  } finally {
    stopWaiting()
    onModalClose()
  }
}
