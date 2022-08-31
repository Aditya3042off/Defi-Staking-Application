import React, {useState,useEffect} from 'react'
import Web3 from 'web3';

import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';

import Navbar from './Navbar';
import Main from './Main';
import ParticleSettings from './ParticleSettings';

const App = () => {

   const [accountAddr,setAccountAddr] = useState('0x0');
   const [tether,setTether] = useState({});
   const [rwd,setRWD] = useState({});
   const [decentralBank,setDecentralBank] = useState({});
   const [tetherBalance,setTetherBalance] = useState('0');
   const [rwdBalance,setRWDBalance] = useState('0');
   const [stakingBalance,setStakingBalance] = useState('0');
   const [isLoading,setIsLoading] = useState(true);

   async function loadWeb3() {
    if(window.ethereum){
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    }
    else if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('no web3 browser detected.Try using MetaMask');
    }
   }

   async function loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    setAccountAddr(prevAccountAddr => account[0]);
    const networkId = await web3.eth.net.getId();

    // Load Tether Contract
    const tetherData = Tether.networks[networkId];
    if(tetherData){
        const _tether = new web3.eth.Contract(Tether.abi,tetherData.address);
        setTether(_tether);
        let _tetherBalance = await _tether.methods.balanceOf(account[0]).call();
        setTetherBalance(prevTetherBalance => _tetherBalance.toString());
    }
    else {
        window.alert('Error! Tether contract not deployed - no detected network!');
    }

    // Load RWD Contract
    const rwdData = RWD.networks[networkId];
    if(rwdData){
        const _rwd = new web3.eth.Contract(RWD.abi,rwdData.address);
        setRWD(_rwd);
        let _rwdBalance = await _rwd.methods.balanceOf(account[0]).call();
        setRWDBalance(prevRWDBalance => _rwdBalance.toString());
    }
    else {
        window.alert('Error! RWD contract not deployed - no detected network!');
    }

    // Load Decentral Bank Contract
    const decentralBankData = DecentralBank.networks[networkId];
    if(decentralBankData){
        const _decentralBank = new web3.eth.Contract(DecentralBank.abi,decentralBankData.address);
        setDecentralBank(_decentralBank);
        let _stakingBalance = await _decentralBank.methods.stakingBalance(account[0]).call();
        setStakingBalance(prevStakingBalance => _stakingBalance.toString());
    }
    else {
        window.alert('Error! Decentral Bank contract not deployed - no detected network!');
    }

    setIsLoading(false);
   }

   useEffect(() => {
    loadWeb3();
    loadBlockchainData();
   },[])

   function stakeTokens(amount) {
    setIsLoading(true);
    tether.methods.approve(decentralBank._address,amount).send({from:accountAddr}).on('transactionHash',(hash) => {
        decentralBank.methods.depositTokens(amount).send({from:accountAddr}).on('transactionHash',(hash) => {
            setIsLoading(false);
        })
    })
   }

   function unstakeTokens() {
    setIsLoading(true);

    decentralBank.methods.unstakeTokens().send({from:accountAddr}).on('transactionHash',(hash) => {
        setIsLoading(false);
    })
   }

  return (
    <div className='App' style={{position: 'relative'}}>
        <div style={{position: 'absolute'}}>
            <ParticleSettings />
        </div>
        <Navbar account={accountAddr}/>
        <div className='conatiner-fluid mt-5'>
            <div className='row'>
                <main role='main' className='col-lg-12 mr-auto ml-auto' style={{maxWidth:'600px',minHeight:'100vm'}}>
                    <div>
                        {isLoading ? <p id='loader' className='text-center' style={{margin:'30px',color:'white'}}><b>LOADING PLEASE...</b></p>
                        : <Main unstakeTokens={unstakeTokens} stakeTokens={stakeTokens} 
                                tetherBalance={tetherBalance} rwdBalance={rwdBalance} 
                                stakingBalance={stakingBalance} decentralBank={decentralBank}/>}
                    </div>
                </main>
            </div>
        </div>

    </div>
  )
}

export default App;