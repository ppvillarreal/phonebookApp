interface Config {
  dynamoDbTableName: string;
  serviceRegion: string;
}

// Check if the environment is development
const isDevelopment: boolean = process.env.NODE_ENV === 'development';

// Set default values for local development
const defaultConfig: Config = {
  dynamoDbTableName: 'phonebookContacts',
  serviceRegion: 'us-west-2',
};

// Assign environment variables or use default values for local development
const config: Config = {
  dynamoDbTableName: isDevelopment ? defaultConfig.dynamoDbTableName : (process.env.DYNAMODB_TABLE_NAME as string),
  serviceRegion: isDevelopment ? defaultConfig.serviceRegion : (process.env.SERVICE_REGION as string),
};

// Runtime validation to ensure necessary environment variables are set
if (!config.dynamoDbTableName || !config.serviceRegion) {
  throw new Error('One or more required environment variables are not set.');
}

export default config;