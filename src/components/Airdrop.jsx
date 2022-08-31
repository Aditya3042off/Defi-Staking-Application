import React,{useState,useEffect} from 'react'
import { clearInterval } from 'timers';

//timer startTime countDown

const Airdrop = (props) => {

    const [time,setTime] = useState({});
    const [seconds,setSeconds] = useState(20);

    let timer = 0;

    function secondsToTime(time) {
        let hours,minutes,seconds_left;

        hours = Math.floor(time / 3600);
        let minutes_dividend = time % 3600;

        minutes = Math.floor(minutes_dividend / 60);
        let seconds_dividend = minutes_dividend % 60;

        seconds_left = seconds_dividend;

        return {hours,minutes,seconds:seconds_left};
    }

    function countDown(){
        console.log(seconds);
        let seconds_left = seconds-1;
        setSeconds(prevSeconds => seconds-1);
        setTime(prevObj => secondsToTime(seconds_left));

        if(seconds_left == 0) clearInterval(timer);
    }

    function startTime(){
        if(timer == 0 && seconds > 0){
            timer = setInterval(countDown,1000);
        }
    }

    useEffect(() => {
        let timeObj = secondsToTime(seconds);
        setTime(prevObj => timeObj);
        startTime();
    },[])

    useEffect(() => {
        if(seconds == 20 && props.stakingBalance >= "50000000000000000000"){
            startTime();
        }
    },[props.stakingBalance])

    useEffect(()=> {

        async function issueTokens(){
            if(seconds == 0) {
                //issuing Tokens
                let ownerAddress = await props.decentralBank.methods.owner().call();
                props.decentralBank.methods.issueTokens().send({from:ownerAddress.toString()}).on('transactionHash',(hash) => {
                    let timeObj = secondsToTime(20);
                    setTime(prevObj => timeObj);
                    setSeconds(20);
                })
            }
        }

        issueTokens();
    },[seconds])

  return (
    <div style={{color:'black'}}>
        {time.minutes}:{time.seconds}
    </div>
  )
}

export default Airdrop