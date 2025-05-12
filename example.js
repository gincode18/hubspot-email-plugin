/**
 * Example script showing how to send an email with custom content
 */
import { sendMarketingEmail } from './services/hubspotService.js';
import { logSuccess, logError } from './utils/logger.js';
import config from './config/index.js';

async function sendCustomEmail(recipientEmail, customContent) {
  try {
    // Contact properties
    const contactProperties = {
      firstname: config.recipient.firstName,
    };

    // Custom properties for the email template
    const customProperties = {
      content: customContent
    };

    console.log(`Sending marketing email with custom content to ${recipientEmail}...`);
    
    // Send the email with custom properties
    const result = await sendMarketingEmail(
      config.hubspot.emailId,
      recipientEmail,
      contactProperties,
      customProperties
    );

    logSuccess('Email sent successfully!', {
      statusId: result.statusId,
      status: result.status,
      to: recipientEmail,
      customContent: customContent
    });
    
    return result;
  } catch (error) {
    logError('Failed to send custom email', error);
    throw error;
  }
}

// Example usage:
// Run this script directly to send a test email

  const customContent = "Hey, We have a great deal for you!";
  const recipientEmail = process.env.RECIPIENT_EMAIL || config.recipient.email;
  
  sendCustomEmail(recipientEmail, customContent)
    .then(() => console.log('Example completed successfully'))
    .catch(() => process.exit(1));

export { sendCustomEmail }; 