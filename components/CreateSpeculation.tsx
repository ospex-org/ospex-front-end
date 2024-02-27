import React, { useContext } from "react"
import {
  Box,
  Button,
  Divider,
  AccordionPanel,
  useColorMode,
  SkeletonText,
} from "@chakra-ui/react"
import router from "next/router"
import { PotentialContest } from "../constants/interface"
import { SpeculationMoneylineAddress, SpeculationSpreadAddress, SpeculationTotalAddress } from "../constants/addresses"
import useCreatedSpeculations from "../hooks/useCreatedSpeculations"
import { createSpeculation } from "../functions/createSpeculation"
import { ProviderContext } from "../contexts/ProviderContext"

interface CreateSpeculationProps {
  contest: PotentialContest
  index: number
  onModalOpen: () => void
  onModalClose: () => void
}

export const CreateSpeculation: React.FC<CreateSpeculationProps> = ({
  contest, index, onModalOpen, onModalClose
}) => {
  const { provider, cfpContract, isWaiting, startWaiting, stopWaiting } = useContext(ProviderContext)
  const { createdSpeculations, loading: loadingSpeculations } = useCreatedSpeculations()
  const { colorMode } = useColorMode()

  const checkSpeculationStatus = (speculationType: string, contestId: string) => {
    let address: string
    switch (speculationType) {
      case "spread":
        address = SpeculationSpreadAddress
        break
      case "moneyline":
        address = SpeculationMoneylineAddress
        break
      case "total":
        address = SpeculationTotalAddress
        break
      default:
        console.log("Unknown speculation type:", speculationType)
        return { created: false, status: "" }
    }
    const speculation = createdSpeculations.find(speculation =>
      speculation.contestId === contestId && speculation.speculationScorer.toLowerCase() === address.toLowerCase()
    )
    return {
      created: !!speculation,
      status: speculation?.status || "",
    }
  }

  const navigateHome = () => {
    router.push('/')
  }

  const renderSpeculationButton = (typeOfSpeculation: string, label: string) => {
    const { created, status } = checkSpeculationStatus(typeOfSpeculation, contest.contestId!)
    let currentOdds: string
    let scorerAddress: string
    let theNumber: string

    if (typeOfSpeculation === "spread") {
      currentOdds = `Current line: ${Number(contest.PointSpreadAway) < 0 ? 
        `${contest.AwayTeam} ${contest.PointSpreadAway}` : 
        `${contest.HomeTeam} -${Number(contest.PointSpreadAway)}`
      }`
      scorerAddress = SpeculationSpreadAddress
      theNumber = contest.PointSpreadAway
    } else if (typeOfSpeculation === "total") {
      currentOdds = `Current total: ${contest.TotalNumber}`
      scorerAddress = SpeculationTotalAddress
      theNumber = contest.TotalNumber
    } else {
      currentOdds = ""
      scorerAddress = SpeculationMoneylineAddress
      theNumber = "0"
    }

    if (created && status === "Pending") {
      return <SkeletonText mt='2' noOfLines={2} spacing='4' skeletonHeight='2' />
    } else if (created && status === "Created") {
      return (
        <Box
          fontSize="small"
          fontWeight="semibold"
          onClick={navigateHome}
          _hover={{ cursor: "pointer" }}
        >
          {label} Speculation Created: See Contests
        </Box>
      )
    } else {
      return (
        <Box
          fontSize="small"
          fontWeight="semibold"
        >
          {currentOdds}
          {typeOfSpeculation !== "moneyline" ? <br /> : <></>}
          <Button
            isLoading={isWaiting}
            isDisabled={!provider || isWaiting}
            fontWeight="bold"
            variant="outline"
            size="sm"
            mt="2"
            borderColor="gray.300"
            bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
            color={colorMode === "light" ? "black" : "white"}
            mb={1.5}
            _hover={
              colorMode === "light"
                ? { bg: "black", borderColor: "black", color: "white" }
                : { bg: "white", borderColor: "white", color: "black" }
            }
            onClick={() => {
              createSpeculation({
                contestId: contest.contestId!, 
                MatchTime: contest.MatchTime, 
                theNumber, 
                speculationScorer: scorerAddress,
                cfpContract, 
                startWaiting, 
                stopWaiting, 
                onModalOpen, 
                onModalClose
              })
            }}
          >
            Create {label} Speculation
          </Button>
        </Box>
      )
    }
  }

  return (
    <AccordionPanel p={0}>
      <Divider my="2" />
      {renderSpeculationButton("spread", "Spread")}
      <Divider my="2" />
      {renderSpeculationButton("moneyline", "Moneyline")}
      <Divider my="2" />
      {renderSpeculationButton("total", "Total")}
    </AccordionPanel>
  )
}