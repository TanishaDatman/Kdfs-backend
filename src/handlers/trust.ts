// src/handlers/trust.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ReputationScore } from '../models/ReputationScore';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { bin, last4 } = event.queryStringParameters || {};
  if (!bin || !last4) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing bin or last4' })
    };
  }

  const record = await ReputationScore.findOne({ where: { bin, last4 } });

  return {
    statusCode: 200,
    body: JSON.stringify(record || { trust_score: 0 })
  };
};
