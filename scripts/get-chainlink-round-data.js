const hre = require('hardhat')
const debug = require('debug')('op:get-chainlink-round-data')
const colors = require('colors/safe')

// Kovan ETH/USD | Decimals 8 | Heartbeat 24h | Deviation 1%
const ETH_USD = '0x9326BFA02ADD2366b30bacB125260Af641031331'

async function getChainlinkRoundData() {
    const feedAddress = process.env.ADDRESS ?? ETH_USD
    debug('Data feed address: %s (ENV: "ADDRESS")', feedAddress)


    const feed = await hre.ethers.getContractAt(
        'AggregatorV2V3Interface',
        feedAddress
    );
    const decimals = await feed.decimals()
    debug('Data feed decimals: %d', decimals)

    const desc = await feed.description()
    debug('Data feed description: %s', desc)

    const round = process.env.ROUND || await feed.latestRound()
    debug('Query round: %s (ENV: "ROUND")', round)

    const {
        roundId,
        answer,
        startedAt,
        updatedAt,
        answeredInRound,
    } = await feed.getRoundData(round)
    debug('Round data: %O', {
        roundId: roundId.toString(),
        answer: `${answer.toString()} (${hre.ethers.utils.formatUnits(answer, decimals)})`,
        startedAt: `${startedAt}`,
        updatedAt: `${updatedAt}`,
        answeredInRound: `${answeredInRound}`,
    })
}

getChainlinkRoundData()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })