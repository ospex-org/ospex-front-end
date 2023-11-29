import { ethers } from "ethers"
import type { NextApiRequest, NextApiResponse } from "next"
import { JsonRpcProviderUrl, SecretsUrl } from "../../constants/addresses"
import { donId, routerAddress } from "../../constants/functions"
import { SecretsManager } from "@chainlink/functions-toolkit"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) {
    return res.status(500).json({ error: "Server configuration error" })
  }
  try {
    const provider = new ethers.providers.JsonRpcProvider(JsonRpcProviderUrl)
    const wallet = new ethers.Wallet(privateKey)
    const signer = wallet.connect(provider)
    const secretsManager = new SecretsManager({
      signer,
      functionsRouterAddress: routerAddress,
      donId,
    })
    await secretsManager.initialize()
    const encryptedSecretsUrls = await secretsManager.encryptSecretsUrls([
      SecretsUrl,
    ])
    res.status(200).json({ encryptedSecretsUrls })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "An unexpected error occurred; please check server-side logs.",
    })
  }
}
