export const fetchCurrentScoreContestSourceFromGithub = async (): Promise<string> => {
	try {
		const response = await fetch("https://raw.githubusercontent.com/ospex-org/ospex-source-files-and-other/master/src/contestScoring.js")
		if (!response.ok) throw new Error("Failed to fetch source code from GitHub.")
		return await response.text()
	} catch (error) {
		console.error("Error fetching source code from GitHub:", error)
		return "" // Return an empty string in case of error
	}
}