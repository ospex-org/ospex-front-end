import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useAddressResolution } from "../../hooks/useAddressResolution"
import { useUserQueryResults } from "../../hooks/useUserQueryResults"
import { client } from "../../utils/apolloClient"

const UserProfile: React.FC = () => {
  const router = useRouter()
  const { username } = router.query

  //   useEffect(() => {
  //     if (typeof username !== "string" || !username) {
  //       router.push("/404")
  //     }
  //   }, [username, router])

  const resolvedAddress = useAddressResolution(
    typeof username === "string" ? username : ""
  )

  const { userContests, userSpeculations, userPositions } = useUserQueryResults(
    client,
    resolvedAddress
  )

  return (
    <div>
      <h1>User Profile: {username}</h1>
      <h1>Resolved Address: {resolvedAddress}</h1>
      <div>
        <h2>Contests</h2>
        <ul>
          {userContests.map((contest, index) => (
            <li key={index}>
              {contest.league} - {contest.homeTeam}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Speculations</h2>
        <ul>
          {userSpeculations.map((speculation, index) => (
            <li key={index}>
              {speculation.winSide} - {speculation.speculationStatus}
            </li> // Replace 'name' and 'detail' with actual properties
          ))}
        </ul>
      </div>
      <div>
        <h2>Positions</h2>
        <ul>
          {userPositions.map((position, index) => (
            <li key={index}>
              {position.positionType} - {position.claimed}
            </li> // Replace 'name' and 'detail' with actual properties
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UserProfile
