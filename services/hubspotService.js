/**
 * Service for interacting with the HubSpot API
 */
const axios = require('axios');
const config = require('../config');
const { formatAxiosError } = require('../utils/errorHandler');

// Base URL for HubSpot API
const API_BASE_URL = 'https://api.hubapi.com';

// Create axios instance with common configuration
const hubspotClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.hubspot.apiKey}`
  }
});

/**
 * Sends a published marketing email to a specific contact
 * 
 * @param {string} emailId - The ID of the published marketing email
 * @param {string} recipientEmail - The email address of the recipient
 * @param {Object} contactProperties - Dynamic properties to include in the email
 * @returns {Promise<Object>} - Response containing the status of the email send
 */
async function sendMarketingEmail(emailId, recipientEmail, contactProperties = {}) {
  try {
    // Prepare request payload
    const payload = {
      emailId: emailId,
      message: {
        to: recipientEmail,
        // You can add CC, BCC, etc. here if needed
      },
      contactProperties: contactProperties,
      customProperties: {
        // Add any custom properties here if needed
      }
    };

    // Send request to HubSpot API
    const response = await hubspotClient.post(
      '/marketing/v4/transactional/single-email/send',
      payload
    );

    return {
      status: response.status,
      messageId: response.data.requestId || 'unknown',
      data: response.data
    };
  } catch (error) {
    // Format and throw a more descriptive error
    throw formatAxiosError(error, 'Error sending marketing email');
  }
}

module.exports = {
  sendMarketingEmail
};