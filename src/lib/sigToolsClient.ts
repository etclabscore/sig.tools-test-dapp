
import PostMessageWindowTransport from "./postMessageWindowTransport";

let transport: PostMessageWindowTransport | undefined;
let id = 0;

const sigToolsAuth = {
  connect: (url: string) => {
    transport = new PostMessageWindowTransport(url);
    return transport.connect();
  },
  close: () => {
    transport?.close();
  },
  sign: async (dataToSign: string, address: string, chainId: string) => {
    const signMessageID = id++;
    const result = await transport?.sendData({
      internalID: signMessageID,
      request: {
        id: signMessageID,
        jsonrpc: "2.0",
        method: "sign",
        params: [
          dataToSign,
          address,
          chainId,
        ],
      } as any,
    });
    return result;
  },
  signTypedData: async (typedData: any, address: string, chainId: string) => {
    const signMessageID = id++;
    const result = await transport?.sendData({
      internalID: signMessageID,
      request: {
        id: signMessageID,
        jsonrpc: "2.0",
        method: "signTypedData",
        params: [
          typedData,
          address,
          chainId,
        ],
      } as any,
    });
    return result;
  },
  signTransaction: async (transaction: any, chainId: string) => {
    const signTransactionID = id++;
    const result = await transport?.sendData({
      internalID: signTransactionID,
      request: {
        id: signTransactionID,
        jsonrpc: "2.0",
        method: "signTransaction",
        params: [
          transaction,
          chainId,
        ],
      } as any,
    });
    return result;
  },
  requestPermissions: async (permissions: any) => {
    const requestPermissionID = id++;
    const successPermissions = await transport?.sendData({
      internalID: requestPermissionID,
      request: {
        id: requestPermissionID,
        jsonrpc: "2.0",
        method: "requestPermissions",
        params: [permissions],
      } as any,
    });
    return successPermissions;
  },
  listAccounts: async () => {
    const listAccountsID = id++;
    const accounts = await transport?.sendData({
      internalID: listAccountsID,
      request: {
        id: listAccountsID,
        jsonrpc: "2.0",
        method: "listAccounts",
        params: [],
      } as any,
    });
    return accounts;
  },
};

export default sigToolsAuth;
