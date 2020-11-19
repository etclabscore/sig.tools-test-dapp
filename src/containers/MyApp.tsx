import React, { useState, useEffect } from "react";
import { ObjectOfStringDoaGddGAStringDoaGddGAUnorderedSetOfObjectOfStringDoaGddGAStringDoaGddGAKieCSt44UIuKSje3U7AKQies as IAvailableServices } from "@etclabscore/jade-service-runner-client";
import { MuiThemeProvider, AppBar, Toolbar, Typography, IconButton, Tooltip, CssBaseline, Grid, Button, CardHeader, CardContent, Card } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { lightTheme, darkTheme } from "../themes/theme";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import { useMachine } from "@xstate/react";

import "./MyApp.css";
import appMachine, { IContext } from "../machines/appMachine";
import useCoreGeth from "../hooks/useCoreGeth";
import ServiceRunner from "@etclabscore/jade-service-runner-client";
import useServiceRunner from "../hooks/useServiceRunner";
import NetworkDropdown from "../components/NetworkDropdown";
import availableServiceToNetwork from "../lib/availableServiceToNetwork";
import { hexToNumber } from "@etclabscore/eserialize";
import Account from "../components/Account";

const MyApp: React.FC = () => {
  const darkMode = useDarkMode();
  const { t } = useTranslation();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const [selectedNetwork, setSelectedNetworkState] = useState();
  const [serviceRunner, serviceRunnerUrl, , availableServices]: [ServiceRunner | undefined, string, any, IAvailableServices[]] = useServiceRunner(process.env.REACT_APP_SERVICE_RUNNER_URL || "https://services.jade.builders"); //tslint:disable-line
  const [erpc, setCoreGethUrlOverride] = useCoreGeth(serviceRunner, serviceRunnerUrl, "1.11.17", "mainnet");
  const [state, send]: [any, any, any] = useMachine<IContext, any>(appMachine, { devTools: true }); //tslint:disable-line
  const [networks, setNetworks] = useState<any[]>([]);

  const setSelectedNetwork = async (network: any) => {
    if (serviceRunner) {
      setSelectedNetworkState(network);
      if (network.service) {
        await serviceRunner.installService(network.service.name, network.service.version);
        await serviceRunner.startService(network.service.name, network.service.version, network.name);
      }
    }
    setCoreGethUrlOverride(network.url);
  };

  useEffect(() => {
    if (availableServices && serviceRunnerUrl) {
      const n = availableServiceToNetwork(availableServices, serviceRunnerUrl);
      setNetworks(n);
    }
  }, [availableServices, serviceRunnerUrl]);

  useEffect(() => {
    send("ERPC", { erpc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erpc]);

  useEffect(() => {
    if (!networks || networks.length === 0) {
      return;
    }
    setSelectedNetworkState(networks[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networks]);

  const handleSignTypedData = (account: any) => {
    send("SIGN_TYPED_DATA", { ...account });
  };

  const handleSign = (account: any) => {
    send("SIGN", { ...account });
  };

  const handleSend = (account: any) => {
    send("SEND", { ...account });
  };

  const handleConnect = () => {
    send("CONNECT");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <Grid container alignContent="center" alignItems="center" justify="space-between">
            <Typography variant="h6">{t("Test Dapp")}</Typography>
            <Typography variant="caption">
              <Typography>Chain ID: {state.context.chainId ? hexToNumber(state.context.chainId) : null}</Typography>
            </Typography>
            <Grid item>
              <NetworkDropdown
                networks={networks}
                setSelectedNetwork={setSelectedNetwork}
                selectedNetwork={selectedNetwork}
              />
              <LanguageMenu />
              <Tooltip title={t("Toggle Dark Mode") as string}>
                <IconButton onClick={darkMode.toggle}>
                  {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div>
        <CssBaseline />
        <div id={state.value} data-testid={state.value}/>
        <Grid container alignContent="center" justify="space-around" direction="row">
          <Grid>
            {state.matches("connecting") && <Button data-testid="connecting">Connecting...</Button>}
            {<Button
              id="connect"
              variant="contained"
              onClick={handleConnect}>
              Connect to <b><span role="img" aria-label="key-lock-logo">🔐</span>sig.tools</b>
            </Button>}
            <Card>
              <CardHeader title="Accounts" />
              <CardContent>
                {state.context.accounts && state.context.accounts.map((account: any) =>
                  <Account
                    onSignTypedData={handleSignTypedData}
                    onSend={handleSend}
                    onSign={handleSign}
                    account={account}
                    key={account.address}
                  />,
                )
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card style={{ height: "100px", width: "300px" }}>
              <Typography>Signed Transaction</Typography>
              <pre style={{ overflowX: "auto" }}>
                <code>
                  {state.context.signedTransaction}
                </code>
              </pre>
            </Card>
            <Card style={{ height: "100px", width: "300px" }}>
              <Typography>Signed Message</Typography>
              <pre style={{ overflowX: "auto" }}>
                <code>
                  {state.context.signedMessage}
                </code>
              </pre>
            </Card>
            <Card style={{ height: "100px", width: "300px" }}>
              <Typography>Signed Typed Data</Typography>
              <pre style={{ overflow: "auto" }}>
                <code>
                  {JSON.stringify(state.context.signedTypedData, null, 4)}
                </code>
              </pre>
            </Card>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider >
  );
};

export default MyApp;
