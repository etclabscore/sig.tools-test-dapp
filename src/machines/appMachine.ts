import { createMachine, assign, spawn, Interpreter } from "xstate";
import sigToolsClient from "../lib/sigToolsClient";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { numberToHex, bigIntToHex, stringToHex } from "@etclabscore/eserialize";
import { Page } from "puppeteer";

const SIG_TOOLS_URL = "https://sig.tools";
const CONTRACT_ADDRESS = "0xAea8081026deB8d8E604Fb5b0A1E2A3f70981106";

export interface IContext {
  chainId?: string;
  erpc?: EthereumJSONRPC;
  etherValue: string;
  inProgress: boolean;
  accounts: any[];
  transaction: null | string;
  fields: {
    receiver: null | string,
    amount: null | string,
  };
}
export const rawAppMachine = {
  id: "appMachine",
  initial: "idle",
  context: {
    etherValue: "1",
    erpc: undefined,
    transaction: null,
    inProgress: false,
    accounts: [],
    fields: {
      receiver: null,
      amount: null,
    },
  },
  on: {
    ERPC: [
      {
        target: "fetchingChainId",
        actions: assign({
          erpc: (context: any, event: any) => {
            return event.erpc;
          },
        }),
      },
    ],
    SEND: {
      target: "sendTransaction",
    },
    SIGN: {
      target: "signMessage",
    },
    SIGN_TYPED_DATA: {
      target: "signTypedData",
    },
    CONNECT: {
      target: "connecting",
    },
  },
  states: {
    idle: {

    },
    connecting: {
      meta: {
        test: async (page: Page) => {
          await page.waitFor("#connecting");
        },
      },
      invoke: {
        id: "connecting.sig.tools",
        src: async (context: IContext, event: any) => {
          const connected = await sigToolsClient.connect(SIG_TOOLS_URL);
          const permissions = await sigToolsClient.requestPermissions({
            listAccounts: {},
          });
        },
        onDone: {
          target: "fetchingAccounts",
        },
        onError: "idle",
      },
    },
    fetchingAccounts: {
      invoke: {
        id: "fetchingAccounts.sig.tools",
        src: async (context: IContext, event: any) => {
          const accounts = await sigToolsClient.listAccounts();
          if (!context.erpc) {
            return accounts;
          }
          const blockNumber = await context.erpc?.eth_blockNumber();
          const ps = accounts.map(async (account: any) => {
            const balance = await context.erpc?.eth_getBalance(account.address, blockNumber);
            return {
              ...account,
              balance,
            };
          });
          return Promise.all(ps);
        },
        onDone: {
          target: "idle",
          actions: assign({ accounts: (context, event: any) => event.data }),
        },
        onError: "idle",
      },
    },
    fetchingChainId: {
      invoke: {
        id: "fetchingChainId.sig.tools",
        src: async (context: IContext, event: any) => {
          const chainId = await context.erpc?.eth_chainId();
          return chainId;
        },
        onDone: {
          target: "fetchingAccounts",
          actions: assign({ chainId: (context, event: any) => event.data }),
        },
        onError: "idle",
      },
    },
    connected: {
      meta: {
        test: async (page: Page) => {
          await page.waitFor("#connected");
        },
      },
    },
    signTypedData: {
      invoke: {
        id: "signTypedData.sig.tools",
        src: async (context: IContext, event: any) => {
          if (context.chainId) {
            const typedData = {
              types: {
                EIP712Domain: [
                  {
                    name: "name",
                    type: "string",
                  },
                  {
                    name: "version",
                    type: "string",
                  },
                  {
                    name: "chainId",
                    type: "uint256",
                  },
                  {
                    name: "verifyingContract",
                    type: "address",
                  },
                ],
                Person: [
                  {
                    name: "name",
                    type: "string",
                  },
                  {
                    name: "wallet",
                    type: "address",
                  },
                ],
                Mail: [
                  {
                    name: "from",
                    type: "Person",
                  },
                  {
                    name: "to",
                    type: "Person",
                  },
                  {
                    name: "contents",
                    type: "string",
                  },
                ],
              },
              primaryType: "Mail",
              domain: {
                name: "Ether Mail",
                version: "1",
                chainId: 1,
                verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
              },
              message: {
                from: {
                  name: event.name,
                  wallet: event.address,
                },
                to: {
                  name: "Bob",
                  wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                },
                contents: "Hello, Bob!",
              },
            };
            const signedMessage = await sigToolsClient.signTypedData(typedData, event.address, context.chainId || "");
            return signedMessage;
          }
        },
        onDone: {
          target: "idle",
          actions: assign({ signedTypedData: (context, event: any) => event.data }),
        },
        onError: "idle",
      },
    },
    signMessage: {
      invoke: {
        id: "signMessage.sig.tools",
        src: async (context: IContext, event: any) => {
          if (context.chainId) {
            const signedMessage = await sigToolsClient.sign(stringToHex("hello"), event.address, context.chainId || "");
            return signedMessage;
          }
        },
        onDone: {
          target: "idle",
          actions: assign({ signedMessage: (context, event: any) => event.data }),
        },
        onError: "idle",
      },
    },
    sendTransaction: {
      invoke: {
        id: "sendTransaction.sig.tools",
        src: async (context: IContext, event: any) => {
          if (context.chainId) {
            const signedTransaction = await sigToolsClient.signTransaction({
              from: event.address,
              gas: numberToHex(22000),
              value: bigIntToHex(BigInt(10000000000000000)),
              gasPrice: await context.erpc?.eth_gasPrice(),
              nonce: await context.erpc?.eth_getTransactionCount(event.address, await context.erpc?.eth_blockNumber()),
            }, context.chainId || "");
            return context.erpc?.eth_sendRawTransaction(signedTransaction).then(() => signedTransaction).catch((e) => {
              return signedTransaction;
            });
          }
        },
        onDone: {
          target: "idle",
          actions: assign({ signedTransaction: (context, event: any) => event.data }),
        },
        onError: "idle",
      },
    },
    // wrapping: {
    //   after: {
    //     30000: "idle",
    //   },
    //   invoke: {
    //     id: "wrapping.sig.tools",
    //     src: async (context: IContext, event: any) => {
    //       if (!context.erpc) {
    //         throw new Error("RPC not connected");
    //       }
    //       const chainId = await context.erpc.eth_chainId();
    //       const connected = await sigToolsClient.connect("https://sig.tools");
    //       const blockNumber = await context.erpc.eth_blockNumber();
    //       const rawTransaction = await sigToolsClient.signTransaction({
    //         from: context.accounts[0].address,
    //         value: bigIntToHex(BigInt(context.etherValue)),
    //         to: CONTRACT_ADDRESS,
    //         nonce: await context.erpc.eth_getTransactionCount(context.accounts[0].address, blockNumber),
    //         gasPrice: numberToHex(0),
    //         gas: numberToHex(310000),
    //         data: "0x0",
    //       }, chainId);
    //       return context.erpc.eth_sendRawTransaction(rawTransaction);
    //     },
    //     onDone: {
    //       target: "idle",
    //       actions: assign({ accounts: (context, event: any) => event.data }),
    //     },
    //     onError: "idle",
    //   },
    // },
  },
};

const appMachine = createMachine<any, any, any>(rawAppMachine);

// Machine instance with internal state
export default appMachine;
