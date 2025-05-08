# HubSpot Marketing Email Sender

A Node.js application that sends published marketing emails to contacts using the HubSpot Marketing Email API.

## Features

- Send published marketing emails to specific contacts
- Include dynamic contact properties in emails
- Comprehensive error handling
- Detailed logging of success and failure

## Prerequisites

- Node.js (v14 or higher)
- HubSpot account with API access
- Published marketing email template

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template and add your HubSpot API key, email ID, and recipient details:
   ```
   HUBSPOT_API_KEY=your_api_key_here
   HUBSPOT_EMAIL_ID=your_email_id_here
   RECIPIENT_EMAIL=recipient@example.com
   RECIPIENT_FIRSTNAME=John
   ```
4. Run the application:
   ```
   npm start
   ```

## Configuration

- `HUBSPOT_API_KEY`: Your HubSpot API key
- `HUBSPOT_EMAIL_ID`: The ID of the published marketing email to send
- `RECIPIENT_EMAIL`: The email address of the recipient
- `RECIPIENT_FIRSTNAME`: The first name of the recipient (used as a dynamic property)

## Error Handling

The application provides detailed error messages for different scenarios:
- API authentication errors
- Network connectivity issues
- Invalid email ID or recipient errors
- HubSpot API validation errors

## License

MIT