# Video Game Note Taker and Solution Generator
        
A taking notes and solutions helper for video games augmented with AI generation

Made with Floot.

# Instruction

For security reasons, the env.json file is not populated - you will need to generate or retrive the values yourself. For JWT secrets, you need to generate it with

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the value.

For Floot Database, you need to request a pg_dump from support and upload it to your own postgres database, then fill up the connection string value.

Floot OAuth will not work in self-hosting environments.

For other exteranal services, retrive your API keys and fill up the values.

Then, you can build and start the service with this:

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
