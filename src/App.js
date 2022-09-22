import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './contracts/contract.json';

const contractAddress = "0x3E79C89f479824Bc24b9eAD73EB8c55F322FE963";
const abi = contract.abi;
const nftabi = contract.nftabi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [inputValues, setInputValues] = useState({});

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamast installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const { chainId } = await provider.getNetwork();
    
    if(chainId !== 2000){
        try {
            // check if the chain to connect to is installed
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7D0' }], // chainId must be in hexadecimal numbers
            });
        } catch (error) {
            // This error code indicates that the chain has not been added to MetaMask
            // if it is not, then install it into the user MetaMask
            if (error.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x7D0',
                                rpcUrls: ['https://rpc01-sg.dogechain.dog/'],
                                chainName: "DogeChain",
                                nativeCurrency: {
                                    name: "Wrapped DOGE",
                                    symbol: "WDOGE",
                                    decimals: 18,
                                }
                            },
                        ],
                    });
                } catch (addError) {
                    console.error(addError)
                    alert("Operation failed. Choose the Doge Chain on your wallet")
                    return
                }
            } else {
                console.error(error)
                alert("Operation failed. Choose the Doge Chain on your wallet")
                return
            }
            
        }
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

  const approveNFT = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const colContract = new ethers.Contract(inputValues['tokenaddress'], nftabi, signer);

        console.log("Initialize payment");
        let appTxn = await colContract.approve(contractAddress, inputValues['ids1'].split(',')[0]);
        await appTxn.wait();
        
      } else {
        console.log("Ethereum object does not exit");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const approveAll = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const colContract = new ethers.Contract(inputValues['tokenaddress'], nftabi, signer);

        let appTxn = await colContract.setApprovalForAll(contractAddress, true);
        await appTxn.wait();
        
      } else {
        console.log("Ethereum object does not exit");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const bulkList = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        
        let nftTxn = await nftContract.bulkList(inputValues['tokenaddress'], inputValues['ids1'].split(','), inputValues['startprice'], inputValues['endprice'], inputValues['endblock'], inputValues['type']);
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

  const bid = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.bid(inputValues['order1'], {
          gasLimit: 300000,
          value: inputValues['price1'],
        });
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

  const buyItNow = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.buyItNow(inputValues['order2'], {
          gasLimit: 300000,
          value: inputValues['price2'],
        });
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

  const claim = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.claim(inputValues['order3']);
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

  const bulkClaim = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.bulkClaim(inputValues['ids2'].split(','));
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

  const cancelOrder = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.cancelOrder(inputValues['order4']);
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

  const bulkCancel = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.bulkCancel(inputValues['ids3'].split(','));
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

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.purchaseTicket(20*1000000);
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

  const changeInput = (e) => {
    // e.target
    setInputValues({...inputValues, [e.target.name]: e.target.value});
  }

  const afterConnection = () => {
    return (
      <>
        <div>
          <input type="text" placeholder='token address' name="tokenaddress" onChange={changeInput} value={inputValues['tokenaddress']?inputValues['tokenaddress']:''}></input>&nbsp;
          <input type="text" placeholder='ids' name="ids1" onChange={changeInput} value={inputValues['ids1']?inputValues['ids1']:''}></input>&nbsp;
          <input type="number" placeholder='start price' name="startprice" onChange={changeInput} value={inputValues['startprice']?inputValues['startprice']:''}></input>&nbsp;
          <input type="number" placeholder='end price' name="endprice" onChange={changeInput} value={inputValues['endprice']?inputValues['endprice']:''}></input>&nbsp;
          <input type="number" placeholder='end block' name="endblock" onChange={changeInput} value={inputValues['endblock']?inputValues['endblock']:''}></input>&nbsp;
          <input type="number" placeholder='type' name="type" onChange={changeInput} value={inputValues['type']?inputValues['type']:''}></input>&nbsp;
          <button onClick={approveNFT} className='btn btn-mint-nft'>
            Approve
          </button>
          <button onClick={approveAll} className='btn btn-mint-nft'>
            Approve For All
          </button>
          <button onClick={bulkList} className='btn btn-mint-nft'>
            Bulk List
          </button>
        </div>
        <div style={{marginTop: 10}}>
          <input type="text" placeholder='order 0x...' name="order1" onChange={changeInput} value={inputValues['order1']?inputValues['order1']:''}></input>&nbsp;
          <input type="number" placeholder='price ' name="price1" onChange={changeInput} value={inputValues['price1']?inputValues['price1']:''}></input>&nbsp;
          <button onClick={bid} className='btn btn-mint-nft'>
            Bid
          </button>
        </div>
        <div style={{marginTop: 10}}>
          <input type="text" placeholder='order 0x...' name="order2" onChange={changeInput} value={inputValues['order2']?inputValues['order2']:''}></input>&nbsp;
          <input type="number" placeholder='price' name="price2" onChange={changeInput} value={inputValues['price2']?inputValues['price2']:''}></input>&nbsp;
          <button onClick={buyItNow} className='btn btn-mint-nft'>
            Buy It Now
          </button>
        </div>
        <div style={{marginTop: 10}}>
          <input type="text" placeholder='order 0x...' name="order3" onChange={changeInput} value={inputValues['order3']?inputValues['order3']:''}></input>&nbsp;
          <button onClick={claim} className='btn btn-mint-nft'>
            Claim
          </button>
        </div>
        <div style={{marginTop: 10}}>
          <input type="text" placeholder='ids' name="ids2" onChange={changeInput} value={inputValues['ids2']?inputValues['ids2']:''}></input>&nbsp;
          <button onClick={bulkClaim} className='btn btn-mint-nft'>
            Bulk Claim
          </button>
        </div>
        <div style={{marginTop: 10}}>
          <input type="text" placeholder='order 0x...' name="order4" onChange={changeInput} value={inputValues['order4']?inputValues['order4']:''}></input>&nbsp;
          <button onClick={cancelOrder} className='btn btn-mint-nft'>
            Cancel Order
          </button>
        </div>
        <div style={{marginTop: 10}}>
          <input type="text" placeholder='ids' name="ids3" onChange={changeInput} value={inputValues['ids3']?inputValues['ids3']:''}></input>&nbsp;
          <button onClick={bulkCancel} className='btn btn-mint-nft'>
            Bulk Cancel
          </button>
        </div>
      </>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <h1>Hi I am Aleksei from Upwork. I can not access my upwork since it needs verification again. can we contact via email? alex.budancev111@gmail.com Thanks. sorry for the inconvenience</h1>
      <div className="div-wallet-address">
        Wallet Address: {currentAccount ? currentAccount : "No Wallet Connected"}
      </div>
      <div className="div-wallet-button">
        {currentAccount ? afterConnection() : connectWalletButton()}
      </div>
      {/* Donee Address: <input type="text" id="donee"  onChange={e => setDonee(e.target.value)} />
      Tax percent: <input type="text" id="tax" onChange={e => setTax(e.target.value)}  />
      Amount: <input type="text" id="amount" onChange={e => setAmount(e.target.value)}  /> */}
    </div>
  );
}

export default App;
