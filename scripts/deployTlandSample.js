// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers, network } = require("hardhat")
// The script required to upload metadata to IPFS

// Optionally, do contract verification (for demo purposes, but this could be as a separate script `verify.js`)
require("@nomiclabs/hardhat-etherscan")
/**
 * Primary script to deploy the NFT, first pushing images to IPFS and saving the CIDs to a metadata object.
 * Then, creating both a 'main' and 'attributes' metadata table to INSERT metadata into for each NFT token.
 */
async function main() {
	// Define the account that will be signing txs for table creates/writes & contract deployment
	const [signer] = await ethers.getSigners()
	console.log(`\nDeploying to network '${network.name}' with account ${signer.address}`)

    const mainName = 'samples_80001_5722'
	// Set the Tableand gateway as the `baseURI` where a `tokenId` will get appended upon `tokenURI` calls
	// Note that `mode=list` will format the metadata per the ERC721 standard
	const tablelandBaseURI = `https://testnets.tableland.network/query?mode=list&s=`
	// Get the contract factory to create an instance of the  TwoTablesNFT contract
	const SampleNFT = await ethers.getContractFactory("Pack")
	// Deploy the contract, passing `tablelandBaseURI` in the constructor's `baseURI` and using the Tableland gateway
	// Also, pass the table's `name` to write to storage in the smart contract
	const sampleNFT = await SampleNFT.deploy(tablelandBaseURI, mainName)
	// For contract verification purposes, wait for 5 confirmations before proceeeding
	// Otherwise, just use `await twoTablesNFT.deployed()`
	await sampleNFT.deployTransaction.wait(5)

	// Log the deployed address and call the getter on `baseURIString` (for demonstration purposes)
	console.log(`\nSampleNFT contract deployed on ${network.name} at: ${sampleNFT.address}`)
	/*const baseURI = await PackNFT.baseURIString()
	console.log(`PackNFT is using baseURI: ${baseURI}`)*/

	// Finally, verify the contract on Polygonscan
	// This is optional, and instead, can be done is a separate script `verifyTwoTables.js`
	try {
		console.log("\nVerifying contract...")
		await hre.run("verify:verify", {
			address: sampleNFT.address,
			constructorArguments: [tablelandBaseURI, mainName],
		})
	} catch (err) {
		if (err.message.includes("Reason: Already Verified")) {
			console.log(
				`Contract is already verified! Check it out on Polygonscan: https://mumbai.polygonscan.com/address/${videoNFT.address}`
			)
		}
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})