# HubSpot Email Sender

This application allows you to send HubSpot marketing emails with custom content via API calls.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

3. Create a `.env` file with the following variables:
   ```
   HUBSPOT_CLIENT_ID=your_client_id
   HUBSPOT_CLIENT_SECRET=your_client_secret
   HUBSPOT_REFRESH_TOKEN=your_refresh_token
   HUBSPOT_EMAIL_ID=your_email_id
   RECIPIENT_EMAIL=default_recipient_email
   RECIPIENT_FIRSTNAME=default_recipient_firstname
   HUBSPOT_REDIRECT_URL=your_redirect_url
   ```

## Using Custom Properties in HubSpot Email Templates

To use custom properties in your HubSpot email template:

1. In the HubSpot Marketing Email editor, open your template
2. Add custom property placeholders using HubL syntax:
   ```
   {{ custom.content }}
   ```

3. This will display the value of the `content` property that you send in your API call

Example template snippet:
```html
<p>Hello {{ contact.firstname }},</p>
<p>{{ custom.content }}</p>
<p>Best regards,<br>Your Company</p>
```

## Sending Emails

### Using the API

1. Start the server:
   ```
   npm start
   ```
   or for development with auto-reload:
   ```
   npm run dev
   ```

2. Send a POST request to `http://localhost:3000/api/send-email`:
   ```json
   {
     "email": "recipient@example.com",
     "content": "Hey, We have a great deal for you!"
   }
   ```

### Using the Example Script

Run the example script:
```
npm run example
```

This will send an email with the default custom content to your default recipient.

### Using the Direct Send Script

You can also use the direct send script:
```
npm run send
```

## Available Scripts

- `npm start` - Start the server (runs app.js)
- `npm run dev` - Start the server with nodemon for development
- `npm run example` - Run the example script with default custom content
- `npm run send` - Run the direct send script (index.js)

## Features

- Send published marketing emails to specific contacts
- Include dynamic contact properties in emails
- Comprehensive error handling
- Detailed logging of success and failure
- OAuth authentication with HubSpot

## Prerequisites

- Node.js (v14 or higher)
- HubSpot account with API access
- Published marketing email template

## Configuration

- `HUBSPOT_CLIENT_ID`: Your HubSpot client ID
- `HUBSPOT_CLIENT_SECRET`: Your HubSpot client secret
- `HUBSPOT_REFRESH_TOKEN`: Your HubSpot refresh token
- `HUBSPOT_EMAIL_ID`: The ID of the published marketing email to send
- `RECIPIENT_EMAIL`: The email address of the recipient
- `RECIPIENT_FIRSTNAME`: The first name of the recipient (used as a dynamic property)
- `HUBSPOT_REDIRECT_URL`: Your OAuth redirect URL

## Error Handling

The application provides detailed error messages for different scenarios:
- API authentication errors
- Network connectivity issues
- Invalid email ID or recipient errors
- HubSpot API validation errors

## License

MIT