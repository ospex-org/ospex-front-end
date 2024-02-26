interface SpeculationStatusUpdateBody {
	contestId: string
	MatchTime: number
	adjustedNumber: string
	speculationScorer: string
	status: string
  idToken?: string
}

export const updateSpeculationStatus = async ({
	contestId,
	MatchTime,
	adjustedNumber,
	speculationScorer,
	status,
  idToken,
}: SpeculationStatusUpdateBody): Promise<void> => {
	try {
		const response = await fetch('/api/set-speculation-status', {
			method: 'POST',
			headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
			body: JSON.stringify({ contestId, MatchTime, adjustedNumber, speculationScorer, status }),
		})

		if (!response.ok) {
			throw new Error(`Failed to update speculation status to ${status}`)
		}
	} catch (error) {
		console.error(`Error updating speculation status to ${status}:`, error)
		throw error
	}
}