# Chain Code Tools

A collection of tools for smart contract development, monitoring and integration.

## Features

- Deploy chain code with an ABI and other meta-data. 
- prove ownership of of chain code & add an ABI for existing chain code.
- monitor usage of chain code
- view current state of chain code registers.
- visual breakdown of op-codes in chain code
- access ABI's for any chain code address (via json-rpc api)


### dev reqs

#### backend

we need an api that stores the abis. It will also provide an api to prove address ownership while adding said abi. Therefor, the backend should provide the methods:

`getChallenge(addr, nonce) -> Challenge`
*user signs Challenge*

`addAnnotations(annotations, onChainAddr, SignedChallenge) -> `
*abi is added, challenge no longer valid*
if this is a new onChainAddr, add the addr to the state poller.

#### Public API utilities

##### decompile
returns the bytecode, decompiled into a preferred language.
`decompile(onChainAddr, "yul")`
`decompile(onChainAddr, "solidity")`

##### getAbi
returns the abi for the specified address
`getAbi(onChainAddr)`


-------------------------

usecases

1. user writes smart contract in solidity
1. user copies compiled output (bytecode) into smart contract deploy tool
1. user annotates the byte code by:
1. upload abi + deploy
1. sig.tools pops up to sign transaction w/ chain code
   1. sig.tools calls back with signed raw tx
   1. send raw tx to current configured network
   1. get tx id
   1. poll for tx in a block
   1. when found, get receipt
   1. note receipt to address (the contract address)
   1. save annotations for that address
1. after the loading screen finished, user is popped into their chain code dashboard
  1. dashboard is configurable - add / delete sections. 
  1. adding a section lets you chose a section layout (number, string) attaching it to a function
  
  
  
1. user make json-rpc calls to encode function calls open-rpc -> chain code functions -> eth_signTx(addr, { chain_id: 123, from: balh, to: balh, data: RESULT_FROM_RPC_CALL })
   1. localhost:31231 :  { method: balance
                           params: (0x231231) -> 0x12341231231 -> send it




-------------------

other idea:

### BUILDER MODE
- define code fragment deploy:
  - enter requirements:
    - inputs
    - context
  - enter in compiled output
  - enter in abi
  - enter in constructor arguments
    - allows mapping of context / environment ontop constructor args
  - define what to output from this code fragment 
    - given transaction receipt, block the deploy is included in, etc. 

- define chain code workflows
  - create deployment contexts
    - storing address to use for deployment, any other metadata
  - visually construct a pipeline of code fragment deploys, connecting their inputs and outputs, adding contexts.
    - able to add in 'hold' steps which require human approval before continuing.
      - configure what to display at this phase - provided outputs and inputs of all code fragment deploys.

### COMMANDER MODE
- provide a dashboard of runnable workflows.
  - run a workflow -> starts signing and sending tx's w/ sig tools & configured service runner
- provide a history of workflows run
- provide a dashboard to explore previously successfully run deploys
  - configure what is displayed
- **export clients for multiple languages

### Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.
