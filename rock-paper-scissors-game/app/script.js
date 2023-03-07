const contractAddress = "0xDAcE033093d82EA0C3c641108D201A6Fee227d4e"; //адрес контракта
const contractABI = [{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"Received","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"airdropBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewardsBalance","type":"uint256"},{"indexed":false,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"playerBalance","type":"uint256"},{"indexed":false,"internalType":"string","name":"gameOutcome","type":"string"}],"name":"Stats","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"FreeMintLimits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositAirdropToContract","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"depositEthToContract","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositPlayer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositRewardsToContract","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getAirdropsBalance","outputs":[{"internalType":"uint256","name":"airdropBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"contractBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewardsBalance","outputs":[{"internalType":"uint256","name":"rewardsBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_playerChoice","type":"string"},{"internalType":"uint256","name":"_gameBet","type":"uint256"}],"name":"play","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let contract;
let signer;


//Connect to Polygon Mumbai chain
const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);

// to connect web3 wallet
const connectWallet = async () => {
    const { ethereum } = window;
    if (ethereum.isMetaMask) {
    provider.send("eth_requestAccounts", []).then(() => {
      provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
      });
    });
    } else {
      setMsg("Please, Install MetaMask");
    }
};


// mint free RPS to a player
async function mint() {
 let setMintPromise = await contract.mint();
 await setMintPromise.wait();
 getStats();
}

// deposit RPS to a player
async function depositPlayer() {
    let amount = document.getElementById("depositPlayer").value;
    let depositPromise = await contract.depositPlayer(amount);
    await depositPromise.wait();
    clearInput("depositPlayer");
    getStats();
}

// withdraw RPS
async function withdrawPlayer() {
    let amount = document.getElementById("withdraw").value;
    const setWithdrawPromise = contract.withdraw(amount);
    await setWithdrawPromise;
    clearInput("withdraw");
    getStats();
}

let playerChoice;

// select
function choice(pick) {
  if (pick == 1) {
    playerChoice = "rock";
  } else if (pick == 2) {
    playerChoice = "paper";
  } else {
    playerChoice = "scissors";
  }
}

function clearInput(input){
  var getValue= document.getElementById(input);
    if (getValue.value !="") {
        getValue.value = "";
    }
}

async function getStats() {
  let queryResult =  await contract.queryFilter('Stats', await provider.getBlockNumber() - 10000, await provider.getBlockNumber());
  let queryResultRecent = queryResult[queryResult.length-1]

  let airdropBalance = await queryResultRecent.args.airdropBalance.toString();
  let rewardsBalance = await queryResultRecent.args.rewardsBalance.toString();
  let player = await queryResultRecent.args.player.toString();
  let playerBalance = await queryResultRecent.args.playerBalance.toString();
  let statsLogs = `
  Player: ${player}, 
  Balance: ${playerBalance} $RPS , 
  Airdrop Balance ${airdropBalance} $RPS,
  Rewards Balance ${rewardsBalance} $RPS
  `;
  console.log(statsLogs);
  let stats = document.getElementById("stats");
  stats.innerText = statsLogs;

}

async function getResults() {
  let queryResult =  await contract.queryFilter('Stats', await provider.getBlockNumber() - 10000, await provider.getBlockNumber());
  let queryResultRecent = queryResult[queryResult.length-1]
  let gameOutcome = await queryResultRecent.args.gameOutcome.toString();

  let resultsLogs = `
  Game is ${gameOutcome}
  `;
  console.log(resultsLogs);
  let results = document.getElementById("results");
  results.innerText = resultsLogs;

}


// play function
async function play() {
    const playerSelect = playerChoice;
    console.log(playerSelect);
    const amount = document.getElementById("inputBet").value;
    console.log(amount);
    let results = await contract.play(playerSelect, amount);
    const res = await results.wait();
    console.log(res);
    
    getResults();
    getStats();
    clearInput("inputBet");

}

