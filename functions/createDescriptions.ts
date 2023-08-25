import { SpeculationMoneylineAddress, SpeculationSpreadAddress, SpeculationTotalAddress } from "../constants/addresses"
import { contest, speculation, position } from "../constants/interface"

export function createSpeculationDescriptions(speculation:speculation, contest:contest) {
	let upperSpeculationTranslation: string, lowerSpeculationTranslation: string, speculationQuestion: string
	if (contest && speculation) {
		switch (speculation.speculationScorer) {
			case SpeculationSpreadAddress.toLowerCase():
				upperSpeculationTranslation = speculation.theNumber < 0 ? 
					`${contest.awayTeam} win by ${Math.abs(speculation.theNumber)} or more: Yes` : 
					`${contest.homeTeam} win by ${Math.abs(speculation.theNumber) + 1} or more: No`
				lowerSpeculationTranslation = speculation.theNumber < 0 ? 
					`${contest.awayTeam} win by ${Math.abs(speculation.theNumber)} or more: No` : 
					`${contest.homeTeam} win by ${Math.abs(speculation.theNumber) + 1} or more: Yes`
					speculationQuestion = speculation.theNumber < 0 ?
					`${contest.awayTeam} win by ${Math.abs(speculation.theNumber)} or more` : 
					`${contest.homeTeam} win by ${Math.abs(speculation.theNumber) + 1} or more`
					return {upperSpeculationTranslation, lowerSpeculationTranslation, speculationQuestion}
				case SpeculationTotalAddress.toLowerCase():
					if (contest.league === 'MLB') {
						upperSpeculationTranslation = `Final score is ${speculation.theNumber} or more runs`
						lowerSpeculationTranslation = `Final score is under ${speculation.theNumber} runs`
						speculationQuestion = `Final score is ${speculation.theNumber} or more runs`
						return {upperSpeculationTranslation, lowerSpeculationTranslation, speculationQuestion}
					} else if (contest.league === 'NHL') {
						upperSpeculationTranslation = `Final score is ${speculation.theNumber} or more goals`
						lowerSpeculationTranslation = `Final score is under ${speculation.theNumber} goals`
						speculationQuestion = `Final score is ${speculation.theNumber} or more goals`
						return {upperSpeculationTranslation, lowerSpeculationTranslation, speculationQuestion}
					} else {
						upperSpeculationTranslation = `Final score is ${speculation.theNumber} or more points`
						lowerSpeculationTranslation = `Final score is under ${speculation.theNumber} points`
						speculationQuestion = `Final score is ${speculation.theNumber} or more points`
						return {upperSpeculationTranslation, lowerSpeculationTranslation, speculationQuestion}
					}
					case SpeculationMoneylineAddress.toLowerCase():
						upperSpeculationTranslation = `${contest.awayTeam} to win`
						lowerSpeculationTranslation = `${contest.homeTeam} to win`
						speculationQuestion = `${contest.homeTeam} to win?`
						return {upperSpeculationTranslation, lowerSpeculationTranslation, speculationQuestion}
					}
	}
}

export function createPositionDescriptions(speculation:speculation, positions:position[]) {
	const upperAmount = Number(BigInt(speculation.upperAmount) / BigInt(1e6))
	const lowerAmount = Number(BigInt(speculation.lowerAmount) / BigInt(1e6))
	const totalAmount = upperAmount + lowerAmount
	let upperPositionTranslation: string, lowerPositionTranslation: string
	if (speculation.speculationScorer == SpeculationTotalAddress.toLowerCase() && upperAmount && lowerAmount) {
		upperPositionTranslation = `1 wins ${(((upperAmount + lowerAmount) / upperAmount) - 1).toFixed(2)} USDC`
		lowerPositionTranslation = `1 wins ${(((upperAmount + lowerAmount) / lowerAmount) - 1).toFixed(2)} USDC`
		return {upperPositionTranslation, lowerPositionTranslation, totalAmount}
	} else if (speculation.speculationScorer !== SpeculationTotalAddress.toLowerCase() && upperAmount && lowerAmount) {
		upperPositionTranslation = `1 wins ${(((upperAmount + lowerAmount) / lowerAmount) - 1).toFixed(2)} USDC`
		lowerPositionTranslation = `1 wins ${(((upperAmount + lowerAmount) / upperAmount) - 1).toFixed(2)} USDC`
		return {upperPositionTranslation, lowerPositionTranslation, totalAmount}
	} else if ((speculation.speculationScorer !== SpeculationTotalAddress.toLowerCase() && upperAmount && !lowerAmount) || 
							(speculation.speculationScorer == SpeculationTotalAddress.toLowerCase() && !upperAmount && lowerAmount)) {
		upperPositionTranslation = `No speculations`
		lowerPositionTranslation = ``
		return {upperPositionTranslation, lowerPositionTranslation, totalAmount}
	} else if ((speculation.speculationScorer !== SpeculationTotalAddress.toLowerCase() && !upperAmount && lowerAmount) || 
							(speculation.speculationScorer == SpeculationTotalAddress.toLowerCase() && upperAmount && !lowerAmount)) {
		upperPositionTranslation = ``
		lowerPositionTranslation = `No speculations`
		return {upperPositionTranslation, lowerPositionTranslation, totalAmount}
	} else {
		upperPositionTranslation = `No speculations`
		lowerPositionTranslation = `No speculations`
		return {upperPositionTranslation, lowerPositionTranslation, totalAmount}
	}
}
