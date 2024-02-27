interface ContestStatusUpdateBody {
  jsonoddsID: string
	status: string
  idToken?: string
}

export const updateContestStatus = async ({
  jsonoddsID,
	status,
  idToken
}: ContestStatusUpdateBody): Promise<void> => {
	try {
		const response = await fetch('/api/set-contest-status', {
			method: 'POST',
			headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
			body: JSON.stringify({ jsonoddsID, status }),
		})

		console.log('response:', response)

		if (!response.ok) {
			throw new Error(`Failed to update contest status to ${status}`)
		}
	} catch (error) {
		console.error(`Error updating contest status to ${status}:`, error)
		throw error
	}
}