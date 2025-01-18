export const fetchCurrentScoreContestSourceFromGithubAlt = async (): Promise<string> => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/ospex-org/ospex-source-files-and-other/master/src/contestScoringAlt.js")
    if (!response.ok) throw new Error("Failed to fetch alternative source code from GitHub.")
    return await response.text()
  } catch (error) {
    console.error("Error fetching alternative source code from GitHub:", error)
    return "" // Return an empty string in case of error
  }
} 