import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const { domain } = req.query
  const apiKey = process.env.REACT_APP_UNSTOPPABLE_DOMAINS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error" })
  }
  try {
    const response = await fetch(`https://api.unstoppabledomains.com/resolve/domains/${domain}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
    const data = await response.json()
    if (data.meta && data.meta.owner) {
      res.status(200).json({ address: data.meta.owner })
    } else {
      res.status(404).json({ error: "Domain owner not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "An unexpected error occurred; please check server-side logs.",
    })
  }
}
