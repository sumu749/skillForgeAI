Clerk Google OAuth Setup

Follow these steps to enable Google Sign-In for SkillForge AI (Clerk):

1. Create OAuth credentials in Google Cloud Console
    - Go to https://console.cloud.google.com/apis/credentials
    - Create an OAuth 2.0 Client ID (choose "Web application").
    - Add authorized redirect URIs. Clerk will show the recommended redirect URI in the Clerk dashboard; typical values:
        - `https://<YOUR_DOMAIN>/.auth/callback` or the exact URI shown by Clerk for the project
        - `http://localhost:3000/.auth/callback` (for local testing if using localhost)
    - Save the Client ID and Client Secret.

2. Configure Clerk Social Connections
    - Open your Clerk project dashboard (https://dashboard.clerk.dev).
    - Go to **Settings → Social connections**.
    - Enable **Google** and paste the Client ID and Client Secret from Google Cloud.
    - Save changes.

3. Set environment variables in the deployed site
    - In Vercel (or your host), set the Clerk keys as described in the README (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, etc.).
    - No extra environment variables are required specifically for Google beyond the Clerk project configuration.

4. Verify on the deployed URL
    - Visit your live site (e.g., `https://your-site.example`) and open the sign-in page (`/sign-in`).
    - The Google Sign-In button should appear automatically when social connections are enabled.
    - Test the sign-in flow and ensure that the redirect returns to your app and logs the user in.

Notes

- If the Google button does not appear, double-check the redirect URIs in Google Cloud and that the Clerk project is the same one your app uses (matching publishable key).
- For production, ensure the production domain is included in the Google OAuth authorized domains.

If you want me to add a short checklist to the README or create a deploy script, tell me which deployment provider you're using (Vercel, Netlify, etc.).
