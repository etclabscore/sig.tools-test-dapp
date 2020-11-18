# Chain Code Tools

A tool to setup chain code deployment pipelines & run them.

The tool has 2 main 'modes'. A builder mode which allows you to construct chain code deployment pipelines, and a 'commander' mode which allows you run and administrate running pipelines. 

### BUILDER MODE

Builder mode allows the user to construct chain code deployment pipelines. These are sequences of steps to perform, along with how they recieve their inputs, and where to send their outputs. Builder mode will allow you to construct complicated chain code deploys, for example, deployments which have dependencies on eachothers' results. Builder mode also allows you to provide a standardized interface description (in ABI format), allowing easy use of the code later.

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
  - visually construct a pipeline of code fragment deploys, connecting their inputs and outputs.
    - able to add in 'hold' steps which require human approval before continuing.
      - configure what to display at this phase - provided outputs and inputs of all code fragment deploys.

### COMMANDER MODE

Commander mode allows you to run pipelines that you have created / imported. It shows you what pipelines you can run, and allows you to create contexts for a given pipeline. Once a context has been assigned to a pipeline, Commander mode lets you run that pipeline. Commander mode displays a list of running pipelines, and previously run pipelines. It allows you to inspect the pipeline, displaying successes and failures in a visually appealing way, along with debugging logs for each step of each pipeline. 

- create deployment contexts
  - storing address to use for deployment, what network to use, environment specific data, etc.
- provide a dashboard of runnable workflows.
  - run a workflow -> starts signing and sending tx's w/ sig tools & configured service runner
- provide a history of workflows run
- provide a dashboard to explore previously successfully run deploys
  - configure what is displayed
- **export clients for multiple languages

### Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.
