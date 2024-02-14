export const translateLeague = (leagueNumber: number): string => {
  const leagueMap: { [key: number]: string } = {
    0: "MLB",
    1: "NBA",
    2: "NCAAB",
    3: "NCAAF",
    4: "NFL",
    5: "NHL",
    8: "WNBA",
    11: "MMA",
    24: "CFL"
  }
  return leagueMap[leagueNumber] || "Other"
}
