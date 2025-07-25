// // src/handlers/score.ts
// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { callPython } from '../services/pythonService';

// export const handler: APIGatewayProxyHandler = async (event:any) => {
//   try {
//     const body = JSON.parse(event.body || '{}');
//     const result = await callPython('rules_layer2.py', body);

//     return {
//       statusCode: 200,
//       body: JSON.stringify(result)
//     };
//   } catch (err: any) {
//     console.error('Score error:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Scoring failed' })
//     };
//   }
// };









// src/handlers/score.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { callPython } from '../services/pythonService';

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '[]'); // Expecting an array of items
    const result = await callPython('rules_layer2.py', body); // expects stdout to be pure JSON

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    console.error('❌ Score error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Scoring failed' }),
    };
  }
};
