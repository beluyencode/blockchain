const hash = require('crypto-js/sha256');

class Block {
    constructor(prevHash, data) {
        this.prevHash = prevHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.calculateHash();
        this.mineVar = 0;
    }

    //tạo hash
    calculateHash() {
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.mineVar).toString();
    }

    // hàm để đào và check độ hơp lệ của hash
    mine(difficulty) {
        //kiểm tra hash vừa tạo có hơp lệ hay không (hash phải bắt đầu bằng difficulty số 0)
        while (!this.hash.startsWith("0".repeat(difficulty))) {
            this.mineVar++;
            this.hash = this.calculateHash();
        }

    }
}

class BlockChain {
    constructor(difficulty) {
        const firstBlock = new Block("", { isFirstBlock: true });
        this.chain = [firstBlock];
        //độ khó khi hash
        this.difficulty = difficulty;
    }

    //thêm block
    addBlock(data) {
        const lastBlock = this.getLastBlock();
        const newBlock = new Block(lastBlock.hash, data);
        console.log("start mining");
        //bắt đầu điếm thời gian đào
        console.time("mine");
        newBlock.mine(this.difficulty);
        console.timeEnd("mine");
        console.log("end mining :", newBlock);
        this.chain.push(newBlock);
    }

    //lấy block cuối
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    //check block có hơp lệ không
    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var prevBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }

}



const test = new BlockChain(4);
console.log(test);

test.addBlock({
    from: "long",
    to: "nobody",
    amount: 100
});

test.addBlock({
    from: "nobody",
    to: "long",
    amount: 200
});

test.addBlock({
    from: "long",
    to: "nobody",
    amount: 3000
});


