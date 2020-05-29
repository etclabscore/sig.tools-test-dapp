import React, { useState, useEffect } from "react";
import { ObjectT84Ta8SE as IAvailableServices } from "@etclabscore/jade-service-runner-client";
import { MuiThemeProvider, AppBar, Toolbar, Typography, IconButton, Tooltip, CssBaseline, Grid, Button, TextField, CardHeader, CardContent, Card, Box } from "@material-ui/core"; //tslint:disable-line
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
import { useQueryParams, StringParam } from "use-query-params";
import { hexToBigInt, hexToNumber } from "@etclabscore/eserialize";
import Account from "../components/Account";

const MyApp: React.FC = () => {
  const darkMode = useDarkMode();
  const { t } = useTranslation();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const [selectedNetwork, setSelectedNetworkState] = useState();
  const [serviceRunner, serviceRunnerUrl, setServiceRunnerUrl, availableServices]: [ServiceRunner | undefined, string, any, IAvailableServices[]] = useServiceRunner(process.env.REACT_APP_SERVICE_RUNNER_URL || "https://services.jade.builders"); //tslint:disable-line
  const [erpc, setCoreGethUrlOverride] = useCoreGeth(serviceRunner, serviceRunnerUrl, "1.11.2", "mainnet");
  const [state, send, myStateMachineService]: [any, any, any] = useMachine<IContext, any>(appMachine, { devTools: true }); //tslint:disable-line
  const [networks, setNetworks] = useState<any[]>([]);
  const [query, setQuery] = useQueryParams({
    network: StringParam,
    rpcUrl: StringParam,
  });
  const handleSetEtherValue = (e: any) => {
    send("SET_ETHER", e.target.value);
  };

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
  }, [erpc]);

  useEffect(() => {
    if (!networks || networks.length === 0) {
      return;
    }
    if (query.rpcUrl) {
      return;
    }
    if (networks && query.network) {
      const foundNetwork = networks.find((net) => net.name === query.network);
      setSelectedNetworkState(foundNetwork);
    } else {
      setSelectedNetworkState(networks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networks, query.network]);

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

  const handleWrap = () => {
    send("WRAP");
  };

  const handleUnwrap = () => {
    send("UNWRAP");
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
              <Tooltip title={t("Toggle Dark Mode")}>
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
        <div id={state.value} />
        <Grid container alignContent="center" justify="space-around" direction="row">
          <Grid>
            {state.matches("connecting") && <Button disabled>Connecting...</Button>}
            {<Button
              id="connect"
              variant="contained"
              onClick={handleConnect}>
              Connect to <b>🔐sig.tools</b>
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
          {/* <TextField
            variant="outlined"
            label="Amount (in ETC)"
            value={state.context.etherValue}
            onChange={handleSetEtherValue}
          />
          <Grid container justify="center" alignItems="center">
            <Button variant="contained" color="primary" onClick={handleWrap}>Wrap</Button>
            <Button variant="contained" color="secondary" onClick={handleUnwrap}>Unwrap</Button>
          </Grid> */}
        </Grid>
      </div>
    </MuiThemeProvider >
  );
};

export default MyApp;
