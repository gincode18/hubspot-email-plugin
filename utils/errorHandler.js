/**
 * Utility functions for handling and formatting errors
 */

/**
 * Formats an Axios error into a more readable and informative error object
 * 
 * @param {Error} error - The error object from Axios
 * @param {string} contextMessage - A message describing what was happening when the error occurred
 * @returns {Error} - A new error with formatted message
 */
function formatAxiosError(error, contextMessage = 'API Error') {
  let errorMessage = `${contextMessage}: `;
  
  if (error.response) {
    // The request was made and the server responded with an error status
    const status = error.response.status;
    const hubspotError = error.response.data.message || 
                         error.response.data.error || 
                         JSON.stringify(error.response.data);
    
    errorMessage += `Status ${status} - ${hubspotError}`;
    
    // Add validation errors if they exist
    if (error.response.data.validationResults) {
      const validationErrors = error.response.data.validationResults
        .map(result => result.message)
        .join(', ');
      
      errorMessage += ` | Validation errors: ${validationErrors}`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage += 'No response received from server. Please check your internet connection and try again.';
  } else {
    // Something happened in setting up the request
    errorMessage += error.message || 'Unknown error occurred';
  }

  // Create a new error with the formatted message
  const formattedError = new Error(errorMessage);
  formattedError.originalError = error;
  formattedError.isAxiosError = true;
  
  // Add specific HubSpot error details if available
  if (error.response?.data) {
    formattedError.hubspotErrorDetails = error.response.data;
  }
  
  return formattedError;
}

export {
  formatAxiosError
};