import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './contracts/contract.json';

const contractAddress = "0xC6FB0EB12beB01CcbcF61299199856d70e86Bd81";
const usdcAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const abi = contract.abi;
const erc20abi = contract.erc20abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [donee, setDonee] = useState('');
  const [tax, setTax] = useState('');
  const [amount, setAmount] = useState('');

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamast installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found!");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address:", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        const usdcContract = new ethers.Contract(usdcAddress, erc20abi, signer);

        console.log("Initialize payment");
        await usdcContract.approve(contractAddress, 20*1000000)
        let nftTxn = await nftContract.purchaseTicket(20*1000000);
        // let nftTxn = await nftContract.hiddenURI();
        // console.log(nftTxn);

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, transaction hash: ${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exit");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='btn btn-wallet-connect'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='btn btn-mint-nft'>
        Buy Ticket!
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="div-wallet-address">
        Wallet Address: {currentAccount ? currentAccount : "No Wallet Connected"}
      </div>
      <div className="div-wallet-button">
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      {/* Donee Address: <input type="text" id="donee"  onChange={e => setDonee(e.target.value)} />
      Tax percent: <input type="text" id="tax" onChange={e => setTax(e.target.value)}  />
      Amount: <input type="text" id="amount" onChange={e => setAmount(e.target.value)}  /> */}
    </div>
  );
}

export default App;
