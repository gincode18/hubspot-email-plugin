/**
 * Configuration management for the application
 */
import dotenv from 'dotenv';
dotenv.config();

const config = {
  hubspot: {
    clientId: process.env.HUBSPOT_CLIENT_ID,
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
    refreshToken: process.env.HUBSPOT_REFRESH_TOKEN,
    emailId: process.env.HUBSPOT_EMAIL_ID,
    baseUrl: 'https://api.hubapi.com'
  },
  recipient: {
    email: process.env.RECIPIENT_EMAIL,
    firstName: process.env.RECIPIENT_FIRSTNAME
  }
};

// Validate required configuration
function validateConfig() {
  const requiredVars = [
    { key: 'HUBSPOT_CLIENT_ID', value: config.hubspot.clientId },
    { key: 'HUBSPOT_CLIENT_SECRET', value: config.hubspot.clientSecret },
    { key: 'HUBSPOT_REFRESH_TOKEN', value: config.hubspot.refreshToken },
    { key: 'HUBSPOT_EMAIL_ID', value: config.hubspot.emailId },
    { key: 'RECIPIENT_EMAIL', value: config.recipient.email }
  ];
  
  const missingVars = requiredVars
    .filter(v => !v.value)
    .map(v => v.key);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
  }
}

// Validate configuration on load
try {
  validateConfig();
} catch (error) {
  console.error(`Configuration Error: ${error.message}`);
  console.log('Tip: Copy .env.example to .env and fill in your values.');
  process.exit(1);
}

export default config;