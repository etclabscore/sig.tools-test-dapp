import React from "react";
import { Card, CardHeader, Typography, Button, CardContent } from "@material-ui/core";
import { hexToBigInt } from "@etclabscore/eserialize";

interface IProps {
  onSend?: (account: any) => void;
  onSign?: (account: any) => void;
  onSignTypedData?: (account: any) => void;
  account?: any;
}

const Account: React.FC<IProps> = (props) => {
  const handleSend = () => {
    if (props.onSend) {
      props.onSend(props.account);
    }
  };
  const handleSign = () => {
    if (props.onSign) {
      props.onSign(props.account);
    }
  };
  const handleSignTypedData = () => {
    if (props.onSignTypedData) {
      props.onSignTypedData(props.account);
    }
  };

  return (
    <Card>
      <CardHeader title={props.account.name} />
      <CardContent>
        <Typography variant="body1">{props.account?.address}</Typography>
        <Typography variant="body1">{hexToBigInt(props.account?.balance ?? "0x0").toString()} ETC</Typography>
        <span id="send"><Button onClick={handleSend}>Send 1 Ether</Button></span>
        <span id="sign"><Button className="sign" onClick={handleSign}>Sign "Hello"</Button></span>
        <span id="signtypeddata"><Button className="signtypeddata" onClick={handleSignTypedData}>SignTypedData</Button></span>
      </CardContent>
    </Card>
  );
};

export default Account;
