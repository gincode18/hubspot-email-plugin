/**
 * Service for interacting with the HubSpot API
 */
import axios from 'axios';
import config from '../config/index.js';
import { formatAxiosError } from '../utils/errorHandler.js';

/**
 * Fetches a new access token using the refresh token
 * 
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<string>} - Promise that resolves to the access token
 */
async function fetchAccessToken(refreshToken) {
  try {
    const url = `${config.hubspot.baseUrl}/oauth/v1/token`;
    
    console.log("================================================");
    console.log(refreshToken);
    console.log("================================================");


    const data = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.hubspot.clientId,
      client_secret: config.hubspot.clientSecret,
      refresh_token: refreshToken,
    });

    const requestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response = await axios.post(url, data.toString(), requestConfig);
    return response.data.access_token;
  } catch (error) {
    throw formatAxiosError(error, 'Error fetching access token');
  }
}

/**
 * Creates an axios instance with the provided access token
 * 
 * @param {string} accessToken - The access token
 * @returns {axios.AxiosInstance} - Configured axios instance
 */
function createHubspotClient(accessToken) {
  return axios.create({
    baseURL: config.hubspot.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
}

/**
 * Sends a published marketing email to a specific contact
 * 
 * @param {string} emailId - The numeric ID of the published marketing email from HubSpot
 *                          Can be found in the URL when editing the email:
 *                          https://app.hubspot.com/email/{PORTAL_ID}/edit/{EMAIL_ID}/settings
 * @param {string} recipientEmail - The email address of the recipient
 * @param {Object} contactProperties - Dynamic properties to include in the email
 * @param {Object} customProperties - Custom properties to include in the email template
 * @returns {Promise<Object>} - Promise that resolves to the response containing send status
 */
async function sendMarketingEmail(emailId, recipientEmail, contactProperties = {}, customProperties = {}) {
  try {
    const accessToken = await fetchAccessToken(config.hubspot.refreshToken);
    const hubspotClient = createHubspotClient(accessToken);
    
    const payload = {
      emailId: parseInt(emailId, 10), // Ensure emailId is a number
      message: {
        to: recipientEmail,
      },
      contactProperties: contactProperties,
      customProperties: customProperties
    };

    // Using the correct v4 endpoint for single send
    const response = await hubspotClient.post(
      '/marketing/v4/email/single-send',
      payload
    );

    console.log("================================================");
    console.log(response.data);
    console.log("================================================");

    return {
      status: response.status,
      statusId: response.data.statusId, // New field from v4 API
      requestedAt: response.data.requestedAt,
      data: response.data
    };
  } catch (error) {
    throw formatAxiosError(error, 'Error sending marketing email');
  }
}

export {
  sendMarketingEmail,
  fetchAccessToken
};