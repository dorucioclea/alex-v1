import {
  Account,
  Chain,
  Clarinet,
  Tx,
  types,
} from "https://deno.land/x/clarinet@v0.13.0/index.ts";



class MS_FWP_WSTX_USDA_5050 {
  chain: Chain;
  deployer: Account;

  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
    //this.wallet_1 = wallet_1;
  }

  propose(startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-50-50", "propose", [
            types.uint(startBlockHeight),
            types.utf8(proposeTitle),
            types.utf8(proposeURL),
            types.uint(feeRateX),
            types.uint(feeRateY),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-50-50", "vote-for", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-50-50", "vote-against", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }

  endProposal(proposalID: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-50-50", "end-proposal", [
            types.uint(proposalID),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }

    returnVotesToMember(contractCaller: Account, token: string, proposalID: number, member: string) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-50-50", "return-votes-to-member", [
            types.principal(token),
            types.uint(proposalID),
            types.principal(member)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }    
}
export { MS_FWP_WSTX_USDA_5050 };

class MS_FWP_ALEX_USDA_5050 {
  chain: Chain;
  deployer: Account;

  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
    //this.wallet_1 = wallet_1;
  }

  propose(startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-50-50", "propose", [
            types.uint(startBlockHeight),
            types.utf8(proposeTitle),
            types.utf8(proposeURL),
            types.uint(feeRateX),
            types.uint(feeRateY),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-50-50", "vote-for", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-50-50", "vote-against", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }

  endProposal(proposalID: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-50-50", "end-proposal", [
            types.uint(proposalID),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }

    returnVotesToMember(contractCaller: Account, token: string, proposalID: number, member: string) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-50-50", "return-votes-to-member", [
            types.principal(token),
            types.uint(proposalID),
            types.principal(member)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }    
}
export { MS_FWP_ALEX_USDA_5050 };

class MS_FWP_ALEX_USDA_SIMPLE {
  chain: Chain;
  deployer: Account;

  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
    //this.wallet_1 = wallet_1;
  }

  propose(startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-simple", "propose", [
            types.uint(startBlockHeight),
            types.utf8(proposeTitle),
            types.utf8(proposeURL),
            types.uint(feeRateX),
            types.uint(feeRateY),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-simple", "vote-for", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-simple", "vote-against", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }

  endProposal(proposalID: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-simple", "end-proposal", [
            types.uint(proposalID),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }

    returnVotesToMember(contractCaller: Account, token: string, proposalID: number, member: string) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-alex-usda-simple", "return-votes-to-member", [
            types.principal(token),
            types.uint(proposalID),
            types.principal(member)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }    
}
export { MS_FWP_ALEX_USDA_SIMPLE };

class MS_FWP_WSTX_USDA_SIMPLE {
  chain: Chain;
  deployer: Account;

  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
    //this.wallet_1 = wallet_1;
  }

  propose(startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-simple", "propose", [
            types.uint(startBlockHeight),
            types.utf8(proposeTitle),
            types.utf8(proposeURL),
            types.uint(feeRateX),
            types.uint(feeRateY),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-simple", "vote-for", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-simple", "vote-against", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }

  endProposal(proposalID: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-simple", "end-proposal", [
            types.uint(proposalID),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }

    returnVotesToMember(contractCaller: Account, token: string, proposalID: number, member: string) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-fwp-wstx-usda-simple", "return-votes-to-member", [
            types.principal(token),
            types.uint(proposalID),
            types.principal(member)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }    
}
export { MS_FWP_WSTX_USDA_SIMPLE };

class MS_YTP_YIELD_WBTC {
chain: Chain;
deployer: Account;

constructor(chain: Chain, deployer: Account) {
  this.chain = chain;
  this.deployer = deployer;
}

propose(expiry: number, startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-ytp-yield-wbtc", "propose", [
          types.uint(expiry),
          types.uint(startBlockHeight),
          types.utf8(proposeTitle),
          types.utf8(proposeURL),
          types.uint(feeRateX),
          types.uint(feeRateY),
        ], this.deployer.address),
      ]);
      return block.receipts[0].result;
  }

voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-ytp-yield-wbtc", "vote-for", [
          types.principal(token),
          types.uint(proposalID),
          types.uint(amount)
        ], contractCaller.address),
      ]);
      return block.receipts[0].result;
  }

voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-ytp-yield-wbtc", "vote-against", [
          types.principal(token),
          types.uint(proposalID),
          types.uint(amount)
        ], contractCaller.address),
      ]);
      return block.receipts[0].result;
  }

endProposal(proposalID: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-ytp-yield-wbtc", "end-proposal", [
          types.uint(proposalID),
        ], this.deployer.address),
      ]);
      return block.receipts[0].result;
  }
}
export { MS_YTP_YIELD_WBTC };


class MS_CRP_USDA_WBTC {
chain: Chain;
deployer: Account;

constructor(chain: Chain, deployer: Account) {
  this.chain = chain;
  this.deployer = deployer;
}

propose(contractCaller: Account, expiry: number, startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-crp-usda-wbtc", "propose", [
          types.uint(expiry),
          types.uint(startBlockHeight),
          types.utf8(proposeTitle),
          types.utf8(proposeURL),
          types.uint(feeRateX),
          types.uint(feeRateY),
        ], contractCaller.address),
      ]);
      return block.receipts[0].result;
  }

voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-crp-usda-wbtc", "vote-for", [
          types.principal(token),
          types.uint(proposalID),
          types.uint(amount)
        ], contractCaller.address),
      ]);
      return block.receipts[0].result;
  }

voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-crp-usda-wbtc", "vote-against", [
          types.principal(token),
          types.uint(proposalID),
          types.uint(amount)
        ], contractCaller.address),
      ]);
      return block.receipts[0].result;
  }

endProposal(proposalID: number) {
    let block = this.chain.mineBlock([
        Tx.contractCall("multisig-crp-usda-wbtc", "end-proposal", [
          types.uint(proposalID),
        ], this.deployer.address),
      ]);
      return block.receipts[0].result;
  }
}
export { MS_CRP_USDA_WBTC };

class MS_CRP_WBTC_USDA {
  chain: Chain;
  deployer: Account;
  
  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
  }
  
  propose(contractCaller: Account, expiry: number, startBlockHeight: number, proposeTitle: string, proposeURL: string, feeRateX: number, feeRateY: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-crp-wbtc-usda", "propose", [
            types.uint(expiry),
            types.uint(startBlockHeight),
            types.utf8(proposeTitle),
            types.utf8(proposeURL),
            types.uint(feeRateX),
            types.uint(feeRateY),
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteFor(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-crp-wbtc-usda", "vote-for", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  voteAgainst(contractCaller: Account, token: string, proposalID: number, amount: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-crp-wbtc-usda", "vote-against", [
            types.principal(token),
            types.uint(proposalID),
            types.uint(amount)
          ], contractCaller.address),
        ]);
        return block.receipts[0].result;
    }
  
  endProposal(proposalID: number) {
      let block = this.chain.mineBlock([
          Tx.contractCall("multisig-crp-wbtc-usda", "end-proposal", [
            types.uint(proposalID),
          ], this.deployer.address),
        ]);
        return block.receipts[0].result;
    }
  }
  export { MS_CRP_WBTC_USDA };
