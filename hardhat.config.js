/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const privateKey = 'PRIVATE KEY HERE'
require('@nomiclabs/hardhat-ethers');

task(`deployLibs`, `Deploy Chainlink Libs`)
    .setAction(
        async () => {
            const DeviationFlaggingValidator = await ethers.getContractFactory("DeviationFlaggingValidator");
            const Flags = await ethers.getContractFactory("Flags");
            const LinkToken = await ethers.getContractFactory("LinkToken");
            const SimpleReadAccessController = await ethers.getContractFactory("SimpleReadAccessController");

            const link = await LinkToken.deploy();
            const rac = await SimpleReadAccessController.deploy();
            const flags = await Flags.deploy(rac.address);
            // Setting the value of 100,000 is equivalent to tolerating a 100%
            const validator = await DeviationFlaggingValidator.deploy(flags.address, 5000);

            console.log("LinkToken deployed to:", link.address);
            console.log("SimpleReadAccessController deployed to:", rac.address);
            console.log("Flags deployed to:", flags.address);
            console.log("Validator deployed to:", validator.address);
        }
    );

task(`deployAggregator`, `Deploy Chainlink Aggregator`)
    .addParam("min", "lower bound of submission value")
    .addParam("max", "upper bound of submission value")
    .addParam("decimals", "decimals to offset the answer")
    .addParam("description", "for example: ETH / USD")
    .addParam("oracle", "the address which could submit answer")
    .addParam("admin", "the address which could withdraw payment of according oracle")
    .addParam("link", "the address of LinkToken")
    .addParam("validator", "the address of DeviationFlaggingValidator")
    .setAction(
        async (args) => {
            const FluxAggregator = await ethers.getContractFactory("FluxAggregator");
            /**
             * @notice set up the aggregator with initial configuration
             * @param _link The address of the LINK token
             * @param _paymentAmount The amount paid of LINK paid to each oracle per submission, in wei (units of 10⁻¹⁸ LINK)
             * @param _timeout is the number of seconds after the previous round that are
             * allowed to lapse before allowing an oracle to skip an unfinished round
             * @param _validator is an optional contract address for validating
             * external validation of answers
             * @param _minSubmissionValue is an immutable check for a lower bound of what
             * submission values are accepted from an oracle
             * @param _maxSubmissionValue is an immutable check for an upper bound of what
             * submission values are accepted from an oracle
             * @param _decimals represents the number of decimals to offset the answer by
             * @param _description a short description of what is being reported
             */
            // constructor(
            //     address _link,
            //     uint128 _paymentAmount,
            //     uint32 _timeout,
            //     address _validator,
            //     int256 _minSubmissionValue,
            //     int256 _maxSubmissionValue,
            //     uint8 _decimals,
            //     string memory _description
            // )
            const aggregator = await FluxAggregator.deploy(args.link, 0, 60, args.validator, args.min, args.max, args.decimals, args.description);
            await aggregator.changeOracles([], [args.oracle], [args.admin], 1, 1, 0);

            console.log("Aggregator deployed to:", aggregator.address);
        }
    );

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                },
            },
            {
                version: "0.4.24",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                },
            },
        ],
    },
    networks:{
        coinex: {
            url: 'https://rpc2.coinex.net/',
            chainId: 52,
            gasPrice: 500000000000,
            accounts: [privateKey],
        },
    }
};
