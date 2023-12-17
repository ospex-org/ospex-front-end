import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const { address } = req.query
  const apiKey = process.env.REACT_APP_UNSTOPPABLE_DOMAINS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error" })
  }
  try {
    const response = await fetch(`https://api.unstoppabledomains.com/resolve/reverse/${address}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
    const data = await response.json()
    res.status(200).json({ domain: data.meta.domain })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "An unexpected error occurred; please check server-side logs.",
    })
  }
}
