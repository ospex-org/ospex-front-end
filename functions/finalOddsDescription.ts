import { speculation, position } from "../constants/interface"

interface OddsResult {
  finalOdds: number
  potentialWinningAmount: number
}

export const finalOddsDescription = (speculation: speculation, position: position): OddsResult | null => {
  const upperAmount = Number(speculation.upperAmount) / 1e6
  const lowerAmount = Number(speculation.lowerAmount) / 1e6
  const positionAmount = Number(position.amount) / 1e6

  let finalOdds: number

  if (position.positionType === "Away" || position.positionType === "Over") {
    finalOdds = (((upperAmount + lowerAmount) / upperAmount) - 1)
  } else if (position.positionType === "Home" || position.positionType === "Under") {
    finalOdds = (((upperAmount + lowerAmount) / lowerAmount) - 1)
  } else {
    console.error('Unexpected positionType:', position.positionType)
    return null
  }

  const potentialWinningAmount = positionAmount * finalOdds

  return { finalOdds, potentialWinningAmount }
}