import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getEncryptedSecretsUrls } from "../../scripts/getEncryptedSecretsUrls"
import { linkTokenAddress, subscriptionId } from "../../constants/functions"
import { ContestOracleResolvedAddress, ScoreContestHashAlt } from "../../constants/addresses"
import { auth } from "../../utils/firebase"
import { signInAnonymously } from "firebase/auth"
import { updateContestStatus } from "../updateContestStatus"

export const createContestAlt = async (
  rundownID: string,
  sportspageID: string,
  jsonoddsID: string,
  source: string,
  startWaiting: (buttonId: string) => void,
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

    await signInAnonymously(auth)
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("Failed to sign in anonymously")
    }

    const idToken = await currentUser.getIdToken()
    await updateContestStatus({ jsonoddsID, status: 'Pending', idToken })
    startWaiting("buttonId")
    onModalOpen()
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
    // const sourceHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(source));
    // Do not remove this console log, it is used to check the source hash
    // console.log({
    //   sourceHash,
    //   ScoreContestHashAlt,
    //   source: source.substring(0, 100) + "..."
    // });
    const createContestTx =
      await contestOracleResolvedContract!.createContest(
        rundownID,
        sportspageID,
        jsonoddsID,
        source,
        ScoreContestHashAlt,
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
    onModalClose()
    stopWaiting()
  }
}

