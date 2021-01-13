const fs = require('fs');
const path = require('path');

// write down contracts that you wish to deploy one-by-one (names only, no .sol extension)
// after the run, find the ABIs and addresses in frontend/src/contracts
const contracts = ["Calc"];

// DO NOT MODIFY CODE BELOW UNLESS ABSOLUTELY NECESSARY
async function publishContract(contractName, chainId) {
  // deploy the contract
  const contractFactory = artifacts.require(contractName);
  const contract = await contractFactory.new();

  console.log(contractName + " contract address: " + contract.address);

  // copy the contract JSON file to front-end and add the address field in it
  fs.copyFileSync(
    path.join(__dirname, "../artifacts/contracts/" + contractName + ".sol/" + contractName + ".json"), //source
    path.join(__dirname, "../frontend/src/contracts/" + contractName + ".json") // destination
  );

  // check if addresses.json already exists
  let exists = fs.existsSync(path.join(__dirname, "../frontend/src/contracts/addresses.json"));

  // if not, created the file
  if (!exists) {
    fs.writeFileSync(
      path.join(__dirname, "../frontend/src/contracts/addresses.json"), 
      "{}"
    ); 
  }

  // update the addresses.json file with the new contract address
  let addressesFile = fs.readFileSync(path.join(__dirname, "../frontend/src/contracts/addresses.json"));
  let addressesJson = JSON.parse(addressesFile);

  if (!addressesJson[contractName]) {
    addressesJson[contractName] = {};
  }

  addressesJson[contractName][chainId] = contract.address;

  fs.writeFileSync(
    path.join(__dirname, "../frontend/src/contracts/addresses.json"), 
    JSON.stringify(addressesJson)
  ); 
}

async function main() {
  let accounts = await web3.eth.getAccounts();
  let deployer = accounts[0];

  let chainId = await web3.eth.getChainId();
  console.log("Chain ID:", chainId);

  console.log(
    "Deploying contracts with the account:",
    deployer
  );

  for (cont of contracts) {
    await publishContract(cont, chainId);
  }
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
