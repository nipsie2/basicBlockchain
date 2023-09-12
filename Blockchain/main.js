const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
         while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++; 
            this.hash = this.calculateHash();
         } 
         console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2023", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0; 
        for (const block of this.chain){
            for (const trans of block.transactions) {
                if (trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

        if (currentBlock.hash !== currentBlock.calculateHash()){
            return false;
        }
        
        if (currentBlock.previousHash !== previousBlock.hash){
            return false;
        }
    }

        return true;
    }
}

let nipsieCoin = new Blockchain();
nipsieCoin.createTransaction(new Transaction('address1', 'address2', 100));
nipsieCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the mining process...');
nipsieCoin.minePendingTransactions('address3');

console.log('\n Balance of hanif is ', nipsieCoin.getBalanceOfAddress('address3'));

console.log('\n Starting the mining process again...');
nipsieCoin.minePendingTransactions('address3');

console.log('\n Balance of hanif is ', nipsieCoin.getBalanceOfAddress('address3'));
// console.log("Mining block 1...");
// nipsieCoin.addBlock(new Block(1, "05/04/2023", { amount: 4 }));

// console.log("Mining block 2...");
// nipsieCoin.addBlock(new Block(2, "07/04/2023", { amount: 8 }));

// console.log("Is blockchain valid? " + nipsieCoin.isChainValid());

// nipsieCoin.chain[1].data = { amount: 100 };
// nipsieCoin.chain[1].hash = nipsieCoin.chain[1].calculateHash();

// console.log("Is blockchain valid? " + nipsieCoin.isChainValid());
//console.log(JSON.stringify(nipsieCoin, null, 4));