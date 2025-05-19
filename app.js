import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { sendCustomEmail } from './example.js';
import { logError } from './utils/logger.js';
import { fetchAccessToken } from './services/hubspotService.js';
dotenv.config();
const app = express();
const PORT = 3000;

export const hubsoptScopes = () => {
  const scopes = [
    "communication_preferences.read",
    "communication_preferences.read_write",
    "content",
    "crm.lists.read",
    "crm.lists.write",
    "crm.objects.appointments.read",
    "crm.objects.appointments.write",
    "crm.objects.carts.read",
    "crm.objects.carts.write",
    "crm.objects.commercepayments.read",
    "crm.objects.companies.read",
    "crm.objects.companies.write",
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "crm.objects.courses.read",
    "crm.objects.courses.write",
    "crm.objects.custom.read",
    "crm.objects.custom.write",
    "crm.objects.deals.read",
    "crm.objects.deals.write",
    "crm.objects.leads.read",
    "crm.objects.leads.write",
    "crm.objects.marketing_events.read",
    "crm.objects.marketing_events.write",
    "crm.objects.orders.read",
    "crm.objects.orders.write",
    "crm.objects.owners.read",
    "crm.objects.users.read",
    "crm.objects.users.write",
    "crm.pipelines.orders.read",
    "crm.pipelines.orders.write",
    "crm.schemas.appointments.read",
    "crm.schemas.appointments.write",
    "crm.schemas.companies.read",
    "crm.schemas.companies.write",
    "crm.schemas.contacts.write",
    "crm.schemas.custom.read",
    "marketing-email",
    "oauth"
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
    // optional_scope: ["marketing-email", "transactional-email"].join(" ")?.toString(),
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

// Route for sending custom emails
app.post("/send", async (req, res) => {
  try {
    const { email, content } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Custom content is required' });
    }
    
    // Send the email
    const result = await sendCustomEmail(email, content);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        to: email,
        statusId: result.statusId,
        requestedAt: result.requestedAt
      }
    });
  } catch (error) {
    logError('API error sending email', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});


// Get subscription types from HubSpot using refresh token flow
app.get("/subscriptions", async (req, res) => {
  try {
    // Step 1: Get fresh access token
    const accessToken = await fetchAccessToken(process.env.HUBSPOT_REFRESH_TOKEN);

    // Step 2: Call HubSpot API to get subscription definitions
    const response = await axios.get("https://api.hubapi.com/communication-preferences/v3/definitions", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Step 3: Return the definitions
    return res.status(200).json({
      success: true,
      subscriptions: response.data
    });

  } catch (error) {
    console.error("Error fetching subscription definitions:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription types",
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Send emails with POST request to http://localhost:${PORT}/send`);
  console.log(`Example request body: { "email": "recipient@example.com", "content": "Your custom message here" }`);
});
