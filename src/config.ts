interface Config {
    dynamoDbTableName: string;
    serviceRegion: string;
  }
  
  // Validate and assign environment variables
  const config: Config = {
    dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME as string,
    serviceRegion: process.env.SERVICE_REGION as string,
  };
  
  // Runtime validation to ensure necessary environment variables are set
  if (!config.dynamoDbTableName || !config.serviceRegion) {
    throw new Error('One or more required environment variables are not set.');
  }
  
  export default config;