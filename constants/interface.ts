export interface modalData {
  heading: string,
  subheading: string,
  id: number,
  positionType?: number
}
  
export interface contest {
  id: string,
  awayScore: number,
  homeScore: number,
  contestCreator: string,
  rundownId: string,
  sportspageId: string,
  leagueId: number,
  league: string,
  awayTeamId: number,
  awayTeam: string,
  homeTeamId: number,
  homeTeam: string,
  eventTime: number,
  contestStatus: string,
  speculations: speculation[]
}
  
export interface speculation {
  id: string,
  contestId: string,
  lockTime: number,
  speculationScorer: string,
  theNumber: number,
  speculationCreator: string,
  upperAmount: number,
  lowerAmount: number,
  winSide: string,
  speculationStatus: string
  positions: position[]
}

export interface position {
  id: string,
  speculationId: string
  userId: string,
  amount: number,
  contributedUponCreation: number,
  contributedUponClaim: number,
  positionType: string,
  claimed: boolean,
  amountClaimed: number,
}

export interface userPosition {
  id: string
  speculationId: string
  userId: string
  amount: number
  contributedUponCreation: number
  contributedUponClaim: number
  positionType: string
  claimed: boolean
  amountClaimed: number
  speculation: {
    id: string
    contestId: string
    lockTime: number
    speculationScorer: string
    theNumber: number
    speculationCreator: string
    upperAmount: number
    lowerAmount: number
    winSide: string
    speculationStatus: string
    contest: {
      id: string
      awayScore: number
      homeScore: number
      contestCreator: string
      rundownId: string
      sportspageId: string
      leagueId: number
      league: string
      awayTeamId: number
      awayTeam: string
      homeTeamId: number
      homeTeam: string
      eventTime: number
      contestStatus: string
    }
  }
}
