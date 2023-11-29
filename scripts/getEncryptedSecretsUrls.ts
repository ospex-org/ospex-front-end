import { EncryptedSecretsUrlsResponse } from "../constants/interface"

export async function getEncryptedSecretsUrls(): Promise<string> {
  try {
    const response = await fetch('/api/create-contest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data: EncryptedSecretsUrlsResponse = await response.json()
    return data.encryptedSecretsUrls
  } catch (error) {
    console.error('Failed to fetch encryptedSecretsUrls:', error)
    throw error
  }
}
  