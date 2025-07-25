// src/handlers/health.ts
export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'ok', service: 'fraud-detector' })
  };
};
