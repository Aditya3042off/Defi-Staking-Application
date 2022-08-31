
const { default: Web3 } = require('web3');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai').use(require('chai-as-promised')).should();


contract('DecentralBank', ([owner,customer]) => {
    let tether, rwd,decentralBank;

    function convertTokens(number) {
        return web3.utils.toWei(number,'Ether');
    }

    before(async () => {
        //Load contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(tether.address,rwd.address);

        //Transfer all tokens to Decentral Bank
        await rwd.transfer(decentralBank.address,convertTokens('1000000'));

        //Transfer 100 USDT tokens to customer 
        await tether.transfer(customer,convertTokens('100'),{from:owner});

    })


    describe('Mock Tether Token', async() => {
        it('matches name successfully',async() => {
            const name = await tether.name();
            assert.equal(name,'Tether');
        })
    })

    describe('Reward Token', async() => {
        it('matches name successfully',async() => {
            const name = await rwd.name();
            assert.equal(name,'Reward Token');
        })
    })

    describe('Decentral Bank', async() => {
        it('matches name successfully',async() => {
            const name = await decentralBank.name();
            assert.equal(name,'Decentral Bank');
        })

        it('contains RWD Tokens', async() => {
            // this contract should contain 1 million RWD Tokens

            const decentralBankAddress = decentralBank.address;
            const decentralBankBalance = await rwd.balanceOf(decentralBankAddress);
            assert.equal(decentralBankBalance.toString(),convertTokens('1000000'));
        })
    })

    describe("Yield farming", async() => {
        it("rewards tokens for staking",async() => {
            let result;

            //check investor balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(),convertTokens('100'),'customer mock token balance before staking');

            //check staking for customer of 100 tokens
            await tether.approve(decentralBank.address,convertTokens('100'),{from: customer});
            await decentralBank.depositTokens(convertTokens('100'),{from: customer});

            //check updated balance of customer
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(),convertTokens('0'),'customer mock token balance after staking 100 tokens');

            //check updated balance of decentral bank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(),convertTokens('100'),'decentral bank mock token balance ');

            // Is staking balance
            result = await decentralBank.isStaked(customer);
            assert.isOk(result.toString(),'customer is staking balance');

            //Issue Tokens
            await decentralBank.issueTokens({from:owner});

            //Ensure only the owner can issue tokens
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            //checking if the customer got reward tokens
            result = await rwd.balanceOf(customer);
            assert.equal(result.toString(),convertTokens('100'),'customer reward token balance should be 100');

            //unstake tokens
            await decentralBank.unstakeTokens({from:customer});
            result = await decentralBank.isStaked(customer);
            assert.isNotOk(result,'customer is no longer staking so, isStaked should be false')

            //checking updatd tether balance of customer after unstaking
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(),convertTokens('100'),'customer mock token balance after unstaking 100 tokens');

            //check updated balance of decentral bank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(),convertTokens('0'),'decentral bank mock token balance after unstaking of customer');

        })
    })
})