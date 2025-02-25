import {
  ONE_8,
  Clarinet,
  Tx,
  types,
  assertEquals,
  prepareStandardTest,
  contractPrincipal,
  extractBounds,
  extractParameters,
  determineApower
} from "./models/alex-tests-launchpad-v1-1.ts";
import type { Chain, Account, StandardTestParameters } from "./models/alex-tests-launchpad-v1-1.ts";
import {
  determineWinners,
  determineLosers,
  IdoParameters,
  IdoParticipant,
} from "../scripts/launchpad.ts";

const parameters = {
  totalIdoTokens: 40000,
  idoOwners: undefined,
  ticketsForSale: 801,
  idoTokensPerTicket: 50,
  pricePerTicketInFixed: 5000000000,
  activationThreshold: 1,
  ticketRecipients: undefined,  
  registrationStartHeight: 10,
  registrationEndHeight: 20,
  claimEndHeight: 30,
  apowerPerTicketInFixed: [10000000000, 10000000000, 10000000000, 10000000000, 10000000000],
  tierThreshold: 10,
  registrationMaxTickets: 999999999999
};

Clarinet.test({
  name: "Launchpad: only owner can create pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const [deployer, accountA, accountB, accountC, accountD, accountE, accountF, accountG] = [
      "deployer", "wallet_1", "wallet_2", "wallet_3", "wallet_4", "wallet_5", "wallet_6", "wallet_7"
    ].map((wallet) => accounts.get(wallet)!);

    let params =
      {
        ...parameters,
        idoOwner: accountA
      };

    const block = chain.mineBlock([
      Tx.contractCall("alex-launchpad-v1-1", "create-pool", [
        types.principal(contractPrincipal(deployer, "token-wban")),
        types.principal(contractPrincipal(deployer, "token-wstx")),
        types.tuple({
          "ido-owner": types.principal(params.idoOwner.address),
          "ido-tokens-per-ticket": types.uint(params.idoTokensPerTicket),
          "price-per-ticket-in-fixed": types.uint(params.pricePerTicketInFixed),
          "activation-threshold": types.uint(params.activationThreshold),
          "registration-start-height": types.uint(params.registrationStartHeight),
          "registration-end-height": types.uint(params.registrationEndHeight),
          "claim-end-height": types.uint(params.claimEndHeight),
          "apower-per-ticket-in-fixed": types.list(params.apowerPerTicketInFixed.map(e => { return types.uint(e) })),
          "tier-threshold": types.uint(params.tierThreshold),
          "registration-max-tickets": types.uint(params.registrationMaxTickets)
        }),
      ], accountA.address),
    ]);
    block.receipts[0].result.expectErr().expectUint(1000);   
    }
});

Clarinet.test({
  name: "Launchpad: only ido-owner/approved-address can add-to-positions",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const [deployer, accountA, accountB, accountC, accountD, accountE, accountF, accountG] = [
      "deployer", "wallet_1", "wallet_2", "wallet_3", "wallet_4", "wallet_5", "wallet_6", "wallet_7"
    ].map((wallet) => accounts.get(wallet)!);

    let params =
      {
        ...parameters,
        idoOwner: accountA
      };

    const first = chain.mineBlock([
      Tx.contractCall("alex-launchpad-v1-1", "create-pool", 
        [
          types.principal(contractPrincipal(deployer, "token-wban")),
          types.principal(contractPrincipal(deployer, "token-wstx")),
          types.tuple({
            "ido-owner": types.principal(params.idoOwner.address),
            "ido-tokens-per-ticket": types.uint(params.idoTokensPerTicket),
            "price-per-ticket-in-fixed": types.uint(params.pricePerTicketInFixed),
            "activation-threshold": types.uint(params.activationThreshold),
            "registration-start-height": types.uint(params.registrationStartHeight),
            "registration-end-height": types.uint(params.registrationEndHeight),
            "claim-end-height": types.uint(params.claimEndHeight),
            "apower-per-ticket-in-fixed": types.list(params.apowerPerTicketInFixed.map(e => { return types.uint(e) })),
            "tier-threshold": types.uint(params.tierThreshold),
            "registration-max-tickets": types.uint(params.registrationMaxTickets)
          }),
        ], deployer.address),
    ]);
    
    const idoId = Number(first.receipts[0].result.expectOk().replace(/\D/g, ""));

    const second = chain.mineBlock([
      Tx.contractCall("alex-launchpad-v1-1", "add-to-position", 
        [
          types.uint(idoId), 
          types.uint(params.ticketsForSale), 
          types.principal(contractPrincipal(deployer, "token-wban"))
        ], accountB.address),
    ]);
    second.receipts[0].result.expectErr().expectUint(1000);

    const approved_operator = accountC;
    const third = chain.mineBlock([
      Tx.contractCall("alex-launchpad-v1-1", "add-approved-operator", 
        [
          types.principal(approved_operator.address)
        ], deployer.address),
      Tx.contractCall("token-banana", "mint-fixed", 
        [
          types.uint(params.totalIdoTokens * params.ticketsForSale * ONE_8), 
          types.principal(approved_operator.address)
        ], deployer.address),
      Tx.contractCall("alex-launchpad-v1-1", "add-to-position", 
        [
          types.uint(idoId), 
          types.uint(params.ticketsForSale), 
          types.principal(contractPrincipal(deployer, "token-wban"))
        ], approved_operator.address),      
    ]);
    third.receipts[2].result.expectOk();
  }
});

Clarinet.test({
  name: "Launchpad: registration is allowed only once",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const [deployer, accountA, accountB, accountC, accountD, accountE, accountF, accountG] = [
      "deployer", "wallet_1", "wallet_2", "wallet_3", "wallet_4", "wallet_5", "wallet_6", "wallet_7"
    ].map((wallet) => accounts.get(wallet)!);

      const ticketRecipient = { recipient: accountG, amount: 1 };

      const params: StandardTestParameters = 
        {
          ...parameters,
          idoOwner: accountA,
          ticketRecipients: [ticketRecipient]
        };
        
      const preparation = prepareStandardTest(chain, params, deployer);
      preparation.blocks.map((block) =>
        block.receipts.map(({ result }) => result.expectOk())
      );

      const { idoId } = preparation;
      
      chain.mineEmptyBlockUntil(parameters.registrationStartHeight);

      const block = chain.mineBlock([
        Tx.contractCall("alex-launchpad-v1-1", "register",
          [
            types.uint(idoId),
            types.uint(ticketRecipient.amount),
            types.principal(contractPrincipal(deployer, "token-wstx")),
          ], ticketRecipient.recipient.address),
        Tx.contractCall("alex-launchpad-v1-1", "register",
          [
            types.uint(idoId),
            types.uint(ticketRecipient.amount),
            types.principal(contractPrincipal(deployer, "token-wstx")),
          ], ticketRecipient.recipient.address),          
        ]);
      block.receipts[0].result.expectOk();
      block.receipts[1].result.expectErr().expectUint(10001);
  },
});

Clarinet.test({
  name: "Launchpad: attempt to register more than max fails",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const [deployer, accountA, accountB, accountC, accountD, accountE, accountF, accountG] = [
      "deployer", "wallet_1", "wallet_2", "wallet_3", "wallet_4", "wallet_5", "wallet_6", "wallet_7"
    ].map((wallet) => accounts.get(wallet)!);

      const ticketRecipient = { recipient: accountG, amount: 2 };

      const params: StandardTestParameters = 
        {
          ...parameters,
          idoOwner: accountA,
          ticketRecipients: [ticketRecipient],
          registrationMaxTickets: 1
        };
        
      const preparation = prepareStandardTest(chain, params, deployer);
      preparation.blocks.map((block) =>
        block.receipts.map(({ result }) => result.expectOk())
      );

      const { idoId } = preparation;
      
      chain.mineEmptyBlockUntil(parameters.registrationStartHeight);

      const block = chain.mineBlock([
        Tx.contractCall("alex-launchpad-v1-1", "register",
          [
            types.uint(idoId),
            types.uint(ticketRecipient.amount),
            types.principal(contractPrincipal(deployer, "token-wstx")),
          ], ticketRecipient.recipient.address),          
        ]);
      block.receipts[0].result.expectErr().expectUint(2048);
  },
});


Clarinet.test({
  name: "Launchpad: example claim walk test",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const [deployer, accountA, accountB, accountC, accountD, accountE, accountF, accountG] = [
      "deployer", "wallet_1", "wallet_2", "wallet_3", "wallet_4", "wallet_5", "wallet_6", "wallet_7"
    ].map((wallet) => accounts.get(wallet)!);

    let winners_list: number[] = [];

    for (let t = 0; t < 500; t += 120) {
      const registrationStartHeight = 10 + t;
      const registrationEndHeight = registrationStartHeight + 10;
      const claimEndHeight = registrationEndHeight + 100;

      const ticketRecipients = [
        { recipient: accountA, amount: 1 },
        { recipient: accountB, amount: 400 },
        { recipient: accountC, amount: 200 },
        { recipient: accountD, amount: 5000 },
        { recipient: accountE, amount: 101 },
        { recipient: accountF, amount: 10000 },
        { recipient: accountG, amount: 1 },
      ];

      const params: StandardTestParameters = 
        {
          ...parameters,
          totalIdoTokens: 40000,
          idoOwner: accountA,
          ticketsForSale: 801,
          idoTokensPerTicket: 50,
          pricePerTicketInFixed: 5000000000,
          activationThreshold: 1,          
          ticketRecipients: ticketRecipients,
          registrationStartHeight: registrationStartHeight,
          registrationEndHeight: registrationEndHeight,
          claimEndHeight: claimEndHeight,          
        };

      const preparation = prepareStandardTest(chain, params, deployer);
      preparation.blocks.map((block) =>
        block.receipts.map(({ result }) => result.expectOk())
      );

      const { idoId } = preparation;

      chain.mineEmptyBlockUntil(registrationStartHeight);
      const registrations = chain.mineBlock(
        ticketRecipients.map((entry) =>
          Tx.contractCall(
            "alex-launchpad-v1-1",
            "register",
            [
              types.uint(idoId),
              types.uint(entry.amount),
              types.principal(contractPrincipal(deployer, "token-wstx")),
            ],
            (entry.recipient as Account).address ||
              (entry.recipient as unknown as string)
          )
        )
      );
      registrations.receipts.map(({ result }) => result.expectOk());
      assertEquals(registrations.receipts.length, ticketRecipients.length);
      for (let i = 0; i < ticketRecipients.length; i++) {
        // console.log(registrations.receipts[i].events);
        registrations.receipts[i].events.expectSTXTransferEvent(
          ticketRecipients[i]["amount"] * parameters["pricePerTicketInFixed"] / ONE_8 * 1e6,
          ticketRecipients[i]["recipient"].address,
          deployer.address + ".alex-launchpad-v1-1"
        );

        // console.log(determineApower(ticketRecipients[i]["amount"], parameters["apowerPerTicketInFixed"], parameters["activationThreshold"]));
        registrations.receipts[i].events.expectFungibleTokenBurnEvent(
          determineApower(ticketRecipients[i]["amount"], parameters["apowerPerTicketInFixed"], parameters["activationThreshold"]),
          ticketRecipients[i]["recipient"].address,
          "apower"
        );
      }

      const bounds = registrations.receipts.map((receipt) =>
        extractBounds(receipt.result)
      );

      chain.mineEmptyBlockUntil(registrationEndHeight + 2);

      const parametersFromChain = chain.callReadOnlyFn(
        "alex-launchpad-v1-1",
        "get-offering-walk-parameters",
        [types.uint(idoId)],
        deployer.address
      );

      const idoParameters: IdoParameters = extractParameters(
        parametersFromChain.result
      );

      const idoParticipants: IdoParticipant[] = ticketRecipients.map(
        (entry, index) => ({
          participant: entry.recipient.address,
          ...bounds[index],
        })
      );

      // console.log(idoParameters);
      // console.log(idoParticipants);
      
      // console.log("determining winners...");
      const winners = determineWinners(idoParameters, idoParticipants);      
      // console.log(winners);
      let maxChunkSize = 200;
      for (
        let index = 0;
        index < winners.winners.length;
        index += maxChunkSize
      ) {
        let winners_sliced = winners.winners.slice(index, index + maxChunkSize);
        // console.log(winners_sliced[0], winners_sliced[winners_sliced.length - 1]);
        const claim = chain.mineBlock([
          Tx.contractCall(
            "alex-launchpad-v1-1",
            "claim-optimal",
            [
              types.uint(idoId),
              types.list(winners_sliced.map(types.principal)),
              types.principal(contractPrincipal(deployer, "token-wban")),
              types.principal(contractPrincipal(deployer, "token-wstx")),
            ],
            deployer.address
          ),
        ]);        
        // console.log(claim);
        // console.log(t, claim.receipts[0].result.expectOk(), winners.winners.length);
        winners_list.push(winners.winners.length);
        let events = claim.receipts[0].events;
        // console.log(index, claim.receipts[0].result);
        assertEquals(events.length, 1 + winners_sliced.length);
        events.expectSTXTransferEvent(
          ((parameters["pricePerTicketInFixed"] * winners_sliced.length) /
            ONE_8) *
            1e6,
          deployer.address + ".alex-launchpad-v1-1",
          accountA.address
        );
        for (let j = 1; j < events.length; j++) {
          events.expectFungibleTokenTransferEvent(
            parameters["idoTokensPerTicket"] * 1e6,
            deployer.address + ".alex-launchpad-v1-1",
            winners_sliced[j - 1],
            "banana"
          );
        }
      }
      chain.mineEmptyBlockUntil(claimEndHeight);

      // console.log("determining losers...");
      const losers = determineLosers(idoParameters, idoParticipants); 
      let losers_list = losers.losers.map(e => { return e.recipient });

      for(let index = 0; index < idoParticipants.length; index++){
        let participant = idoParticipants[index]['participant'];
        let won = winners.winners.indexOf(participant) == -1 ? 0 : winners.winners.lastIndexOf(participant) - winners.winners.indexOf(participant) + 1;
        let lost = losers_list.indexOf(participant) == -1 ? 0 : losers.losers[losers_list.indexOf(participant)]['amount'];
        console.log(
          participant, 
          "registered:", won + lost,
          "won:", won,
          "lost:", lost
        );
        assertEquals(ticketRecipients[index]['amount'], won + lost);
      }
                   
      maxChunkSize = 1;
      for (
        let index = 0;
        index < losers.losers.length;
        index += maxChunkSize
      ) {
        let losers_sliced = losers.losers.slice(index, index + maxChunkSize);
        // console.log(losers_sliced);
        const claim = chain.mineBlock([
          Tx.contractCall(
            "alex-launchpad-v1-1",
            "refund",
            [
              types.uint(idoId),
              types.list(losers_sliced.map(e => { return types.tuple({recipient: types.principal(e.recipient), amount: types.uint(e.amount * parameters["pricePerTicketInFixed"])})})),
              types.principal(contractPrincipal(deployer, "token-wstx")),
            ],
            deployer.address
          ),
        ]);

        let events = claim.receipts[0].events;
        // console.log(index, claim.receipts[0].result);
        assertEquals(events.length, losers_sliced.length);
        
        for (let j = 0; j < events.length; j++) {
          events.expectSTXTransferEvent(
            losers_sliced[j]['amount'] * parameters["pricePerTicketInFixed"] / ONE_8 * 1e6,
            deployer.address + ".alex-launchpad-v1-1",
            losers_sliced[j]['recipient'],
          );
        }
      }      
    }

    console.log(
      "min: ",
      Math.min(...winners_list),
      "median: ",
      winners_list.sort((a, b) => (a > b ? 1 : -1))[
        Math.floor(winners_list.length / 2)
      ],
      "mean: ",
      winners_list.reduce((sum, x) => sum + x, 0) / winners_list.length,
      "max: ",
      Math.max(...winners_list)
    );
  },
});
