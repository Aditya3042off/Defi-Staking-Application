import React,{useState} from 'react'
import tether from '../tether.png'

import Airdrop from './Airdrop';

const Main = (props) => {

    const [amount,setAmount] = useState('0');

    function depositSubmitHandler(evt) {
        evt.preventDefault();
        let amountToStake = window.web3.utils.toWei(amount,'Ether');
        props.stakeTokens(amountToStake);
        setAmount(prevAmount => '0');
    }

    function withdrawSubmitHandler(evt) {
        evt.preventDefault();
        props.unstakeTokens();
    }

  return (
    <div id='content' className='mt-3'>
        <table className='table text-muted text-center'>
            <thead>
                <tr style={{color:'white'}}>
                    <th scope='col'>Staking Balance</th>
                    <th scope='col'>Reward Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{color:'white'}}>
                    <td>{window.web3.utils.fromWei(props.stakingBalance,'Ether')} USDT</td>
                    <td>{window.web3.utils.fromWei(props.rwdBalance,'Ether')} RWD</td>
                </tr>
            </tbody>
        </table>
        <div className='mb-2 card' style={{opacity:'0.9'}}>
            <form action="" className='mb-3' onSubmit={depositSubmitHandler}>
                <div style={{borderSpace:'0 1em'}}>
                    <label htmlFor="" className='float-left' style={{marginLeft:"15px"}}><b>Stake Tokens</b></label>
                    <span className='float-right' style={{marginRight:'8px'}}>Balance: {window.web3.utils.fromWei(props.tetherBalance,'Ether')}</span>
                    <div className='input-group mb-4'>
                        <input type="text" placeholder='0' value={amount} onChange={(evt)=>{setAmount(evt.target.value)}} required />
                        <div className='input-group-open'>
                            <div className='input-group-text'>
                                <img src={tether} alt="tether" height='32' />
                                &nbsp;&nbsp;&nbsp;USDT
                            </div>
                        </div>
                    </div>
                    <button type='submit' className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
                </div>
            </form>
            <button className='btn btn-primary btn-lg btn-block' type='submit' onClick={withdrawSubmitHandler}>WITHDRAW</button>
            <div className='card-body text-center' style={{color:'blue'}}>
                <b>AIRDROP <Airdrop stakingBalance={props.stakingBalance} decentralBank = {props.decentralBank}/></b>
            </div>
        </div>
    </div>
  )
}

export default Main