/**
 * Configuration management for the application
 */
require('dotenv').config();

const config = {
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY,
    emailId: process.env.HUBSPOT_EMAIL_ID
  },
  recipient: {
    email: process.env.RECIPIENT_EMAIL,
    firstName: process.env.RECIPIENT_FIRSTNAME
  }
};

// Validate required configuration
function validateConfig() {
  const requiredVars = [
    { key: 'HUBSPOT_API_KEY', value: config.hubspot.apiKey },
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

module.exports = config;