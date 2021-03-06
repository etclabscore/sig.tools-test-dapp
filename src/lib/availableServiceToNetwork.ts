import {
  ObjectOfStringDoaGddGAStringDoaGddGAUnorderedSetOfObjectOfStringDoaGddGAStringDoaGddGAKieCSt44UIuKSje3U7AKQies as IAvailableServices,
  ObjectOfStringDoaGddGAStringDoaGddGAKieCSt44 as IEnvironment,
} from "@etclabscore/jade-service-runner-client";

interface INetwork {
  name: string;
  url: string;
  summary?: string;
  [k: string]: any;
}

export type TNetwork = INetwork;

const availableServiceToNetwork = (
  availableServices: IAvailableServices[],
  serviceRunnerUrl: string): TNetwork[] => {
  const availNetworks = availableServices.map((availableService: IAvailableServices) => {
    if (!availableService) {
      return [];
    }
    if (!availableService.environments) {
      return [];
    }
    return availableService.environments.map((env: IEnvironment) => {
      return {
        name: env.name,
        url: `${serviceRunnerUrl}/${availableService.name}/${env.name}/${availableService.version}`,
        service: availableService,
        summary: env.summary,
      };
    });
  });
  return ([] as any).concat(...availNetworks);
};

export default availableServiceToNetwork;
