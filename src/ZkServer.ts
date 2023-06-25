import express from "express";
import cors from "cors";
import { SismoConnectConfig, SismoConnectButton, SismoConnectResponse, AuthRequest, AuthType, SismoConnect, SismoConnectVerifiedResult } from "@sismo-core/sismo-connect-react";


const emailMemoryStore = new Map();

const config: SismoConnectConfig = {
  appId: "0x641812921a2d8a979edd0f47c70fd6c9",
};

const claimRequest = {
  groupId: "0x682544d549b8a461d7fe3e589846bb7b",
};

const authRequest = {
  authType: AuthType.VAULT,
}

const sismoConnect = SismoConnect({ config });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  const { email, SismoConnectResponse } = req.body;
  try {
    const verifiedAuths: SismoConnectVerifiedResult = await SismoConnect.verify(
      SismoConnectResponse,
      {
      authRequest,
      claimRequest,
    });
    const userId =  verifiedAuths[0].userId;

  } catch (e: any) {
    res.status(400).send({ status: "error", message: e.message });
  }
});

app.post("/reset", async (req, res) => {
  emailMemoryStore.clear();
  res.status(200).send({ status: "success" });
});

app.listen(process.env.PORT ?? 8080);
