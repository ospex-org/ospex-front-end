export const ContestOracleResolvedAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_link",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			}
		],
		"name": "ContestUnableToBeScoredManually",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "oracle1",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "oracle2",
				"type": "uint8"
			}
		],
		"name": "OracleJobsNotDifferent",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			}
		],
		"name": "ScoreContestNotInReadyStatus",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			}
		],
		"name": "TimerHasNotExpired",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "rundownId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "sportspageId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "contestCreator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "contestCriteria",
				"type": "uint64"
			}
		],
		"name": "ContestCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "awayScore",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "homeScore",
				"type": "uint32"
			}
		],
		"name": "ContestScored",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SCOREMANAGER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contestCreationTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contestCriteria1",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contestCriteria2",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contestId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contestTimerInterval",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contestTimers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contests",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "awayScore",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "homeScore",
				"type": "uint32"
			},
			{
				"internalType": "address",
				"name": "contestCreator",
				"type": "address"
			},
			{
				"internalType": "enum ContestStatus",
				"name": "contestStatus",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "rundownId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "sportspageId",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_rundownId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_sportspageId",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_oracleForCreationValidation1",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_oracleForCreationValidation2",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_oracleForContestScoring1",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_oracleForContestScoring2",
				"type": "uint8"
			}
		],
		"name": "createContest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_oracleAddress",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_jobId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			}
		],
		"name": "createOracle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint64",
				"name": "_result",
				"type": "uint64"
			}
		],
		"name": "fulfillCriteria",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint32",
				"name": "_result",
				"type": "uint32"
			}
		],
		"name": "fulfillScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getContest",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "awayScore",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "homeScore",
						"type": "uint32"
					},
					{
						"internalType": "address",
						"name": "contestCreator",
						"type": "address"
					},
					{
						"internalType": "uint8[2]",
						"name": "scoringOracles",
						"type": "uint8[2]"
					},
					{
						"internalType": "enum ContestStatus",
						"name": "contestStatus",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "rundownId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "sportspageId",
						"type": "string"
					}
				],
				"internalType": "struct Contest",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "oracleId",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "oracles",
		"outputs": [
			{
				"internalType": "address",
				"name": "oracleAddress",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "jobId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "requestMapping",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "scoreContest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "_awayScore",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "_homeScore",
				"type": "uint32"
			}
		],
		"name": "scoreContestManually",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_oracle",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			}
		],
		"name": "updateFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newContestTimerInterval",
				"type": "uint256"
			}
		],
		"name": "updateTimer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]