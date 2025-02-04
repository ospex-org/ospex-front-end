// goerli as of 5/14/2023, solidity version 0.8.13
/*
export const ContestOracleResolvedAddress = '0xb21f25274e873240f0CEe29B8548C551B307BAc3'
export const CFPv1Address = '0x2c7e3Ad326CBF590C7cACFB3eB1a68d09b9Ae420'
export const SpeculationSpreadAddress = '0xAb7db4FD0a5DFa6F5D39C67F6800E2c778286c33'
export const SpeculationTotalAddress = '0x8B047213ed5076aCB51BFF9Fce56ACcBD5474Ba4'
export const SpeculationMoneylineAddress = '0x3A17B3887C28307C754D5be272F56d216f35a459'
export const USDCAddress = '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc'
export const JsonRpcProviderUrl = 'https://eth-goerli.g.alchemy.com/v2/987gt3TTkj5F4WYbz9mq5ZKytO8BRLNb'
*/

// polygon mumbai w/ functions as of 8/26/2023, solidity version 0.8.18
// export const ContestOracleResolvedAddress = '0x0B556C3650a01Bc779F7afF1f6Bf11166276C9Cb'
// export const CFPv1Address = '0xdfa8538C3eb080959fe357C904798f40753722b2'
// export const SpeculationSpreadAddress = '0x65E155D929eB524BBcA3e0c8982c5fFfC50193b4'
// export const SpeculationTotalAddress = '0x9d1FCC4d4813796cC3239Ea3cEf07444904bfaEA'
// export const SpeculationMoneylineAddress = '0x919C4d11D8bB0c47Ff20DCE7250DE596B78F3E1c'
// export const USDCAddress = '0xd33602ce228adbc90625e4fc8071aae0cad11fe9'
// export const JsonRpcProviderUrl = 'https://polygon-mumbai.g.alchemy.com/v2/8dx7bOITLIXUAIwpMIy_rIGzdlES8hhl'

// polygon mumbai w/ functions upgrade to 8.19 + new functions code with changes to secrets and DON public key (or lack thereof)
// export const ContestOracleResolvedAddress = '0x84e07fF9B7eA7933554C33f9644B8AdAB6b531e2'
// export const CFPv1Address = '0x830f55Ae31D3CdDA4ff06805C01b621b57C7B4f6'
// export const SpeculationSpreadAddress = '0xbFD75B69E14D2071288D49e05691AEAE99d1B212'
// export const SpeculationTotalAddress = '0x177DB22cc0dd946Fe65B9C5dECaAdaDC0cCd0B70'
// export const SpeculationMoneylineAddress = '0xd9DE2d788A9ED0dd0F41B4BE4d3b807EFdACb041'
// export const USDCAddress = '0xd33602ce228adbc90625e4fc8071aae0cad11fe9'
// export const JsonRpcProviderUrl = 'https://polygon-mumbai.g.alchemy.com/v2/8dx7bOITLIXUAIwpMIy_rIGzdlES8hhl'

// polygon mumbai w/ functions upgrade to 8.19 + new functions code with changes to secrets and DON public key (or lack thereof) (take 3)
// export const ContestOracleResolvedAddress = '0x3bb30a30a1256E72C3f43bBCa1A2D68065F6E44f'
// export const CFPv1Address = '0x161944b13236897A1967a9Da79F402C5e79181C6'
// export const SpeculationSpreadAddress = '0xbA3A1C2E412fd5d92640cb84Af58085d85420354'
// export const SpeculationTotalAddress = '0x45AB6E309304142fEB7C1F0Fce9D6EE12a28A69D'
// export const SpeculationMoneylineAddress = '0x5b28bB0b1b5B2CdBc2852b99d997d25fe53F43c7'
// export const USDCAddress = '0xd33602ce228adbc90625e4fc8071aae0cad11fe9'
// export const JsonRpcProviderUrl = 'https://polygon-mumbai.g.alchemy.com/v2/8dx7bOITLIXUAIwpMIy_rIGzdlES8hhl'
// export const ContestCreatorAddress = '0xA8eb19F9B7c2b2611C1279423A0CB2aee3735320'
// export const SpeculationCreatorAddress = '0xA8eb19F9B7c2b2611C1279423A0CB2aee3735320'

// polygon mainnet deployment 11/30/2023
// export const ContestOracleResolvedAddress = '0x6342692B76273554beb4Ce1284ac6a92Ef645e79'
// export const CFPv1Address = '0x4fE4732953Ccfb58976B4fab8A8623876Fa2A44E'
// export const SpeculationSpreadAddress = '0x3c56194ED3C9F0400Bff6D4E04B396904EE96E75'
// export const SpeculationTotalAddress = '0x29b2e956B50AfF3292f75FE2C40105AA6560a847'
// export const SpeculationMoneylineAddress = '0x81cFc0Fd2360aC2E9A6EFe6A680fBF2E42074AD0'
// export const USDCAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
// export const JsonRpcProviderUrl = 'https://polygon-mainnet.g.alchemy.com/v2/MCwR7_IJpLl2ke3uGB3Ru2sFbejLtBJF'
// export const ContestCreatorAddress = '0x9B6b9Fa7fDb867a425d9507FFc013D74e70e6822'
// export const SpeculationCreatorAddress = '0x9B6b9Fa7fDb867a425d9507FFc013D74e70e6822'
// export const SecretsUrl = 'https://green-considerable-whitefish-752.mypinata.cloud/ipfs/QmStrMPyzjsaeZC5at9nRjznGFGdjkandWZhB8LkEgshRL'

// polygon mainnet deployment 2/14/2024 (slight change to set contest scoring hash when contest is created)
export const ContestOracleResolvedAddress = '0x415713dD8Db291a48957237eFb860c948F804197'
export const CFPv1Address = '0x904029883412427994a4d32e496d0e7f5743e193'
export const SpeculationSpreadAddress = '0x7aa2dC75A5aD5d99EEa28d344c2d8f7cF622d3E2'
export const SpeculationTotalAddress = '0x4be070cb3f4c6ce07fec0586e3d7453b5dce33e3'
export const SpeculationMoneylineAddress = '0xd77ba5b3883315c4c25c7adb52575680824b4b6a'
export const USDCAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
export const JsonRpcProviderUrl = 'https://polygon-mainnet.g.alchemy.com/v2/MCwR7_IJpLl2ke3uGB3Ru2sFbejLtBJF'
export const ContestCreatorAddress = '0x9B6b9Fa7fDb867a425d9507FFc013D74e70e6822'
export const SpeculationCreatorAddress = '0x9B6b9Fa7fDb867a425d9507FFc013D74e70e6822'
export const SecretsUrl = 'https://green-considerable-whitefish-752.mypinata.cloud/ipfs/QmStrMPyzjsaeZC5at9nRjznGFGdjkandWZhB8LkEgshRL'
export const ScoreContestHash = '0xcb2a11db3190c322239b52afb3caefccfccd850566834819b012c5520f8d31cd'
export const ScoreContestHashAlt = '0x52663b3662221e75812415d8bd14931e91b8162836b5a1a63e7bcac9b13e7c17'