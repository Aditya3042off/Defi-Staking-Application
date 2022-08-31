const DecentralBank = artifacts.require('decentralBank');

module.exports = async function issueRewards(callback) {
    let decentralBank = await DecentralBank.deployed();
    await decentralBank.issueTokens();
    console.log('rewards have been issued');
    callback();
}