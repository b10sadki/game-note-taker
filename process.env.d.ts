type ProcessEnvShouldBeSuppliedByResources = {
FLOOT_DATABASE_URL: string;
OPENAI_API_KEY: string;
RAWG_API_KEY: string;
NODE_ENV: string;
}

// Override the global process variable
declare var process: {
  env: ProcessEnvShouldBeSuppliedByResources;
};
