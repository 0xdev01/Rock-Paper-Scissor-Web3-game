const contractAddress = "0xEeF3A6B70A1c2815cC3c902C4c45836cFcb70424"; //адрес контракта
const contractABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"Received","type":"event"},{"inputs":[],"name":"depositContract","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"depositPlayer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"contractBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_playerChoice","type":"string"},{"internalType":"uint256","name":"_gameBet","type":"uint256"}],"name":"play","outputs":[{"internalType":"string","name":"gameOutcome","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
let contract;
let signer;
  
const provider = new ethers.providers.Web3Provider(window.ethereum);

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


// deposit BNB to a player
async function depositPlayer() {
    const amount = document.getElementById("deposit").value;
    const setDepositPromise = contract.depositPlayer({ value: ethers.utils.parseEther(amount)});
    await setDepositPromise;
}

// withdraw BNB 
async function withdrawPlayer() {
    const setWithdrawPromise = contract.withdraw();
    await setWithdrawPromise;
}

// play function
async function play() {
    const playerChoice = document.getElementById("inputChoice").value;
    console.log(playerChoice);
    const amountBet = document.getElementById("inputBet").value;
    console.log(amountBet);
    // convert to ether
    const amountInEth = ethers.utils.parseEther(amountBet);
    // store the result
    var result = document.getElementById("result");
   // start a new game
    const setPlayPromise = contract.play(playerChoice, amountInEth);
    await setPlayPromise;
    console.log(setPlayPromise);  
}

