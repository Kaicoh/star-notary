const StarNotary = artifacts.require('StarNotary');

let accounts;

contract('StarNotary', (accs) => {
    accounts = accs;
});

it('can create a Star', async () => {
    const tokenId = 1;
    const instance = await StarNotary.deployed();

    await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] });

    const starName = await instance.tokenIdToStarInfo.call(tokenId);
    assert.equal(starName, 'Awesome Star!');
});

it('lets user1 put up their star for sale', async () => {
    const instance = await StarNotary.deployed();
    const user1 = accounts[1];
    const starId = 2;
    const starPrice = web3.utils.toWei('.01', 'ether');

    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });

    const retrievedPrice = await instance.starsForSale.call(starId);
    assert.equal(retrievedPrice, starPrice);
});

it('lets user1 get the funds after the sale', async () => {
    const instance = await StarNotary.deployed();
    const user1 = accounts[1];
    const user2 = accounts[2];
    const starId = 3;
    const starPrice = web3.utils.toWei('.01', 'ether');
    const balance = web3.utils.toWei('.05', 'ether');

    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });

    const balanceOfUser1Before = await web3.eth.getBalance(user1);

    await instance.buyStar(starId, { from: user2, value: balance });

    const balanceOfUser1After = await web3.eth.getBalance(user1);

    assert.equal(
        Number(balanceOfUser1Before) + Number(starPrice),
        Number(balanceOfUser1After),
    );
});

it('lets user2 buy a star, if it is put up for sale', async () => {
    const instance = await StarNotary.deployed();
    const user1 = accounts[1];
    const user2 = accounts[2];
    const starId = 4;
    const starPrice = web3.utils.toWei('.01', 'ether');
    const balance = web3.utils.toWei('.05', 'ether');

    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    await instance.buyStar(starId, { from: user2, value: balance });

    const starOwner = await instance.ownerOf.call(starId);
    assert.equal(starOwner, user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
    const instance = await StarNotary.deployed();
    const user1 = accounts[1];
    const user2 = accounts[2];
    const starId = 5;
    const starPrice = web3.utils.toWei('.01', 'ether');
    const balance = web3.utils.toWei('.05', 'ether');

    await instance.createStar('awesome star', starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });

    const balanceOfUser2Before = await web3.eth.getBalance(user2);

    await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });

    const balanceOfUser2After = await web3.eth.getBalance(user2);

    assert.equal(
        Number(balanceOfUser2Before) - Number(balanceOfUser2After),
        Number(starPrice),
    );
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
    // 1. create a Star with different tokenId
    // 2. Call the name and symbol properties in your Smart Contract
    // and compare with the name and symbol provided
    const instance = await StarNotary.deployed();
    const tokenName = await instance.name.call();
    const tokenSymbol = await instance.symbol.call();
    assert.equal(tokenName, 'Udacity Blackchain Star');
    assert.equal(tokenSymbol, 'UBS');
});

it('lets 2 users exchange stars', async () => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
});

it('lets a user transfer a star', async () => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
});

it('lookUptokenIdToStarInfo test', async () => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
});
