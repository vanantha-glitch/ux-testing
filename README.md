This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Deployment Steps

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add password protection"
   git push
   ```

2. **Import project to Vercel**
   - Go to [Vercel](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js settings

3. **Set Password Protection**
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add a new environment variable:
     - **Name**: `PROTOTYPE_PASSWORD`
     - **Value**: Your desired password (e.g., `my-secure-password-123`)
   - Make sure to add it for **Production**, **Preview**, and **Development** environments as needed
   - Click **Save**

4. **Deploy**
   - Vercel will automatically deploy on push, or you can trigger a manual deployment
   - Once deployed, your site will be live and password-protected

### Password Protection

The prototype viewer is protected with HTTP Basic Authentication. When users visit your deployed site:

- They will see a browser-native password prompt
- The username can be anything (it's not validated)
- The password must match the `PROTOTYPE_PASSWORD` environment variable
- Once authenticated, users won't be prompted again for 7 days (stored in a secure cookie)

### Local Development

For local development, password protection is **disabled by default** (when `PROTOTYPE_PASSWORD` is not set). To test password protection locally:

1. Create a `.env.local` file in the project root
2. Add: `PROTOTYPE_PASSWORD=your-test-password`
3. Restart your development server

See [`.env.example`](.env.example) for reference.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
