import gql from "graphql-tag"

export const contestsGteCurrentTime = gql`
  query getContests($eventTime: Int!) {
    contests(where: {eventTime_gte: $eventTime}) {
      id
      awayScore
      homeScore
      contestCreator
      rundownId
      sportspageId
      jsonoddsId
      contestCreationId
      leagueId
      league
      awayTeamId
      awayTeam
      homeTeamId
      homeTeam
      eventTime
      contestStatus
      speculations {
        id
        contestId
        lockTime
        speculationScorer
        theNumber
        speculationCreator
        upperAmount
        lowerAmount
        winSide
        speculationStatus
        positions {
          id
          speculationId
          userId
          amount
          contributedUponCreation
          contributedUponClaim
          positionType
          claimed
          amountClaimed
        }
      }
    }
  }
`

export const addressSpecificPositions = gql`
  query getPositions($userId: String!) {
    positions(where: {userId: $userId}) {
      id
      speculationId
      userId
      amount
      contributedUponCreation
      contributedUponClaim
      positionType
      claimed
      amountClaimed
      speculation {
        id
        contestId
        lockTime
        speculationScorer
        theNumber
        speculationCreator
        upperAmount
        lowerAmount
        winSide
        speculationStatus
        contest {
          id
          awayScore
          homeScore
          contestCreator
          rundownId
          sportspageId
          jsonoddsId
          contestCreationId
          leagueId
          league
          awayTeamId
          awayTeam
          homeTeamId
          homeTeam
          eventTime
          contestStatus
        }
      }
    }
  }
`

export const contestsLtCurrentTime = gql`
  query getContests($currentTime: Int!) {
    contests(where: {eventTime_lt: $currentTime}) {
      id
      awayScore
      homeScore
      contestCreator
      rundownId
      sportspageId
      jsonoddsId
      contestCreationId
      leagueId
      league
      awayTeamId
      awayTeam
      homeTeamId
      homeTeam
      eventTime
      contestStatus
    }
  }
`

export const contestById = gql`
  query getContestById($id: ID!) {
    contests(where: {id: $id}) {
      id
      awayScore
      homeScore
      contestCreator
      rundownId
      sportspageId
      jsonoddsId
      contestCreationId
      leagueId
      league
      awayTeamId
      awayTeam
      homeTeamId
      homeTeam
      eventTime
      contestStatus
      speculations {
        id
        contestId
        lockTime
        speculationScorer
        theNumber
        speculationCreator
        upperAmount
        lowerAmount
        winSide
        speculationStatus
        positions {
          id
          speculationId
          userId
          amount
          contributedUponCreation
          contributedUponClaim
          positionType
          claimed
          amountClaimed
          user {
            id
            totalSpeculated
            totalClaimed
            totalClaimable
            totalContributed
            totalLost
            totalPending
          }
        }
      }
    }
  }
`

export const userTotals = gql`
  query getUsers($Id: String!) {
    users(where: {id: $Id}) {
      id
      totalSpeculated
      totalClaimed
      totalClaimable
      totalContributed
      totalLost
      totalPending
      wins
      losses
      ties
      net
    }
  }
`
