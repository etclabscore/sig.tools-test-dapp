# Chain Code Tools

A tool to setup chain code deployment workflows & run them.


The tool has 2 main 'modes'. A builder mode which allows you to construct chain code deployment workflows & their steps, and a 'commander' mode which allows you administrate and run workflows. 

## Definitions

### What is chain code? 

It's the EVM byte code that is written to an address on chain which provides some programmatic functionality to its users.

### What is a deployment workflow? 

It's a sequence of steps and the inputs & outputs for each step which yields a collection of deployed chain code. It is the minimally-complete set of steps required for an individual project or component of a project.

## BUILDER MODE

Builder mode allows the user to construct chain code deployment workflows. These are sequences of steps to perform, along with how they recieve their inputs, and where to send their outputs. 

Builder mode allows you to construct complicated chain code deploys. For example, deployments which have dependencies on eachothers' results. 

Builder mode also allows you to provide a standardized interface description (in ABI format), allowing easy use of the code later.

### Using builder mode

***

> As a chain code developer, I want to describe the deployment of one fragment of my project.

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
    
***

> As a chain code developer, I want to describe how deployments of my projects fragments are strung together to make a complete deployment. 

- define chain code workflows
  - visually construct a pipeline of code fragment deploys, connecting their inputs and outputs.
    - able to add in 'hold' steps which require human approval before continuing.
      - configure what to display at this phase - provided outputs and inputs of all code fragment deploys.

***

## COMMANDER MODE

Commander mode allows you to run workflows that you have created / imported. It shows you what workflows you can run, and allows you to create contexts for a given workflow. Once a context has been assigned to a workflow, Commander mode lets you run that pipeline. Commander mode displays a list of running pipelines, and previously run pipelines. It allows you to inspect the pipeline, displaying successes and failures in a visually appealing way, along with debugging logs for each step of each pipeline. 

### Using commander mode

***

> As a project administrator, I would like to set the deployment address, configure the network to use, and deploy my project's code.

- create deployment contexts
  - storing address to use for deployment, what network to use, environment specific data, etc.
- provide a dashboard of runnable workflows.
  - run a workflow -> starts signing and sending tx's w/ sig tools & configured service runner

***

> As a project administrator, I would like to view the workflows I have run in the past, and inspect their logs
- provide a history of workflows run

***
  
#### stretch goals

***

> As a project user, I would like to view important on-chain metrics to my project
- provide a dashboard to explore previously successfully run deploys
  - configure what is displayed

***

> As a project user, I would like to be able to download generated code for using the chain code

- export clients for multiple languages

***

### Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.
