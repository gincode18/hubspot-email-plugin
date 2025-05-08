/**
 * Main entry point for the HubSpot email sender application
 */
const { sendMarketingEmail } = require('./services/hubspotService');
const { logSuccess, logError } = require('./utils/logger');
const config = require('./config');

async function main() {
  try {
    // Contact properties to use in the email
    const contactProperties = {
      firstname: config.recipient.firstName,
      // Add any other properties you want to use in the email template
    };

    console.log('Sending marketing email...');
    
    // Send the email
    const result = await sendMarketingEmail(
      config.hubspot.emailId,
      config.recipient.email,
      contactProperties
    );

    // Log success message with details
    logSuccess('Email sent successfully!', {
      messageId: result.messageId,
      status: result.status,
      to: config.recipient.email
    });
  } catch (error) {
    // Log error message with details
    logError('Failed to send email', error);
    process.exit(1);
  }
}

// Run the application
main();