import { Timestamp } from "firebase/firestore"

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
  jsonoddsId: string,
  contestCreationId?: string,
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
  speculationId: string,
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
      jsonoddsId: string
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

export interface EncryptedSecretsUrlsResponse {
  encryptedSecretsUrls: string
}

export interface PotentialContest {
  id: string
  jsonoddsID: string
  rundownID: string
  sportspageID: number
  Sport: number
  AwayTeam: string
  HomeTeam: string
  MatchTime: Timestamp
  OddType: string
  PointSpreadAway: string
  TotalNumber: string
  Created: boolean
  contestId?: string
  status: string
}

export interface CreatedSpeculation {
  id: string
  contestId: string
  lockTime: Timestamp
  speculationCreator: string
  speculationId: string
  speculationScorer: string
  theNumber: number
  status: string
}

export interface user {
  id: string;
  totalSpeculated: number;
  totalClaimed: number;
  totalClaimable: number;
  totalContributed: number;
  totalLost: number;
  totalPending: number;
  wins: number;
  losses: number;
  ties: number;
  net: number;
}
