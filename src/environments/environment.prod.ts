// This file configures production environment variables
export const environment = {
  production: true,
  apiUrl:
    'https://qxh9w8hhyi.execute-api.eu-west-2.amazonaws.com/production/api',
  assetUrl:
    'https://storefront-images-058264347310.s3.eu-west-2.amazonaws.com/assets/',
  useBackendImages: true, // Always use S3/backend in production
  debug: false,
};
