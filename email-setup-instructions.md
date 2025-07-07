# Email Setup Instructions

To enable email functionality in the quote system, you need to create a `.env` file in the root directory with the following environment variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Setup Steps:

1. **Create .env file**: Create a new file called `.env` in the root directory of your project
2. **Add your Gmail address**: Replace `your-email@gmail.com` with your actual Gmail address
3. **Generate App Password**:
   - Go to your Google Account settings
   - Enable 2-factor authentication if not already enabled
   - Go to Security > App passwords
   - Generate a new app password for this application
   - Use that 16-character password (without spaces) as the EMAIL_PASS value

## Example .env file:

```
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd1234efgh5678
```

After creating this file, the email functionality will work for sending quotes to clients.
