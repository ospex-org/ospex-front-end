import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getEncryptedSecretsUrls } from "../scripts/getEncryptedSecretsUrls"
import { linkTokenAddress, subscriptionId } from "../constants/functions"
import { ContestOracleResolvedAddress } from "../constants/addresses"

export const scoreContest = async (
  contestId: string,
  source: string,
  startWaiting: () => void,
  stopWaiting: () => void,
  onModalOpen: () => void,
  onModalClose: () => void,
  provider: JsonRpcProvider | undefined | null,
  contestOracleResolvedContract: Contract | undefined | null
) => {
  if (provider) {
    ; (async () => {
      try {
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
        onModalClose()
      } catch (error) {
        console.error("an error has occurred:", error)
        onModalClose()
      } finally {
        stopWaiting()
      }
    })()
  }
}
