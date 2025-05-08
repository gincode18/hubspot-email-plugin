/**
 * Utility functions for logging messages to the console
 */
import chalk from 'chalk';

/**
 * Formats a timestamp string for logging
 * @returns {string} - Formatted timestamp
 */
function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Logs a success message with optional details
 * 
 * @param {string} message - The main success message
 * @param {Object} details - Optional details to include in the log
 */
function logSuccess(message, details = null) {
  const timestamp = getTimestamp();
  console.log(chalk.green(`[${timestamp}] ✓ SUCCESS: ${message}`));
  
  if (details) {
    console.log(chalk.green('Details:'));
    Object.entries(details).forEach(([key, value]) => {
      console.log(chalk.green(`  ${key}: ${value}`));
    });
  }
}

/**
 * Logs an error message with optional error object
 * 
 * @param {string} message - The main error message
 * @param {Error} error - Optional error object for detailed logging
 */
function logError(message, error = null) {
  const timestamp = getTimestamp();
  console.log(chalk.red(`[${timestamp}] ✗ ERROR: ${message}`));
  
  if (error) {
    if (error.isAxiosError) {
      // Handle axios errors with more details
      console.log(chalk.red(`Details: ${error.message}`));
      
      if (error.hubspotErrorDetails) {
        console.log(chalk.red('HubSpot API Response:'));
        console.log(chalk.red(JSON.stringify(error.hubspotErrorDetails, null, 2)));
      }
    } else {
      // Handle regular errors
      console.log(chalk.red(`Details: ${error.message}`));
      if (error.stack) {
        console.log(chalk.red('Stack trace:'));
        console.log(chalk.red(error.stack.split('\n').slice(1, 4).join('\n')));
      }
    }
  }
}

/**
 * Logs an info message
 * 
 * @param {string} message - The info message
 */
function logInfo(message) {
  const timestamp = getTimestamp();
  console.log(chalk.blue(`[${timestamp}] ℹ INFO: ${message}`));
}

/**
 * Logs a warning message
 * 
 * @param {string} message - The warning message
 */
function logWarning(message) {
  const timestamp = getTimestamp();
  console.log(chalk.yellow(`[${timestamp}] ⚠ WARNING: ${message}`));
}

export {
  logSuccess,
  logError,
  logInfo,
  logWarning
};