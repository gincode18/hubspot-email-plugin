import express from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const app = express();
const PORT = 3000;

export const hubsoptScopes = () => {
  const scopes = [
    "oauth",
    "crm.schemas.contacts.write",
    "crm.objects.owners.read",
    "crm.objects.companies.read",
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "crm.lists.write",
    "crm.lists.read",
    "crm.objects.deals.read",
    "crm.objects.leads.read",
    "crm.objects.custom.read",
    "crm.schemas.custom.read",
  ];

  return scopes?.join(" ")?.toString();
};

app.use(express.json()); // for parsing application/json

// /init endpoint
app.get("/init", (req, res) => {
  const authParams = new URLSearchParams({
    client_id: process.env.HUBSPOT_CLIENT_ID,
    redirect_uri: process.env.HUBSPOT_REDIRECT_URL,
    scope: hubsoptScopes(),
    optional_scope: ["marketing-email", "transactional-email"].join(" ")?.toString(),
    response_type: "code",
  });
  const authUrl = `https://app.hubspot.com/oauth/authorize?${authParams.toString()}`;
  console.log({ authUrl });

  res.redirect(authUrl);
});

// /validate-callback endpoint
app.get("/validate-callback", async (req, res) => {
  const code = req.query.code;


  const payload = {
    client_id: process.env.HUBSPOT_CLIENT_ID,
    client_secret: process.env.HUBSPOT_CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: process.env.HUBSPOT_REDIRECT_URL,
  };

  // code -> refresh token
  // refresh -> refresh token

  // refresh -> access

  const url = `https://api.hubapi.com/oauth/v1/token`;
  const dataString = new URLSearchParams(payload).toString();

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const result = await axios.post(url, dataString, config);

  console.dir(result.data, { depth: null });
  res.status(200).send("connected")
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
