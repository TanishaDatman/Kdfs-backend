// // src/handlers/score.ts

// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { callPython } from '../services/pythonService';
// import { Collection } from '../models/Collection';
// import { Op } from 'sequelize';

// export const handler: APIGatewayProxyHandler = async (event) => {
//   try {
//     const { shopper_id, merchant_id, id } = event.queryStringParameters || {};

//     const where: any = {};

//     // Convert comma-separated query params to arrays
//     if (shopper_id) {
//       const ids = shopper_id.split(',').map((v) => v.trim());
//       where.shopper_id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
//     }

//     if (merchant_id) {
//       const ids = merchant_id.split(',').map((v) => v.trim());
//       where.merchant_id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
//     }

//     if (id) {
//       const ids = id.split(',').map((v) => v.trim());
//       where.id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
//     }

//     const collections = await Collection.findAll({ where });

//     if (collections.length === 0) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ message: 'No collections found matching the criteria.' })
//       };
//     }

//     const inputData = collections.map((item) => ({
//       id: item.id,
//       total_sales_count: item.total_sales,
//       successful_sales_count: item.total_sales,
//       refund_count: item.total_refunds,
//       chargeback_count: item.total_chargebacks,
//       total_sales_amount: item.total_sale_amount,
//       refund_amount: item.total_refund_amount,
//       chargeback_amount: item.total_chargeback_amount,
//       fraud_score: item.fraud_score ?? 50
//     }));

//     const scoredResults = await callPython('rules_layer2.py', inputData);

//     for (const result of scoredResults) {
//       await Collection.update(
//         {
//           fraud_score: result.score,
//           layer2_status: result.layer2_status
//         },
//         { where: { id: result.id } }
//       );
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         updated: scoredResults.length,
//         ids: scoredResults.map((r:any) => r.id)
//       })
//     };
//   } catch (err: any) {
//     console.error('Score error:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Scoring failed', detail: err.message })
//     };
//   }
// };










// src/handlers/score.ts

// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { callPython } from '../services/pythonService';
// import { Collection } from '../models/Collection';
// import { Op } from 'sequelize';
// import { sequelize } from '../models';

// export const handler: APIGatewayProxyHandler = async (event) => {
//     await sequelize.authenticate();

//   try {
//     const body = event.body ? JSON.parse(event.body) : {};
//     const { shopper_id, merchant_id, id } = body || {};

//     const where: any = {};

//     if (shopper_id) {
//       const ids = shopper_id.split(',').map((v: string) => v.trim());
//       where.shopper_id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
//     }

//     if (merchant_id) {
//       const ids = merchant_id.split(',').map((v: string) => v.trim());
//       where.merchant_id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
//     }

//     if (id) {
//       const ids = id.split(',').map((v: string) => v.trim());
//       where.id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
//     }

//     const collections = await Collection.findAll({ where });

//     if (collections.length === 0) {
//       await sequelize.close();
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ message: 'No collections found matching the criteria.' })
//       };
//     }

//     const inputData = collections.map((item) => ({
//       id: item.id,
//       total_sales_count: item.total_sales,
//       successful_sales_count: item.total_sales,
//       refund_count: item.total_refunds,
//       chargeback_count: item.total_chargebacks,
//       total_sales_amount: item.total_sale_amount,
//       refund_amount: item.total_refund_amount,
//       chargeback_amount: item.total_chargeback_amount,
//       fraud_score: item.fraud_score ?? 50
//     }));

//     const scoredResults = await callPython('rules_layer2.py', inputData);

//     for (const result of scoredResults) {
//       await Collection.update(
//         {
//           fraud_score: result.score,
//           layer2_status: result.layer2_status
//         },
//         { where: { id: result.id } }
//       );
//     }

//     await sequelize.close();
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         updated: scoredResults.length,
//         ids: scoredResults.map((r: any) => r.id)
//       })
//     };
//   } catch (err: any) {
//     console.log('🔌 Closing DB connection...');
//     await sequelize.close();
//     console.log('✅ DB connection closed.');
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Scoring failed', detail: err.message })
//     };
//   }
// };








import { APIGatewayProxyHandler } from 'aws-lambda';
import { callPython } from '../services/pythonService';
import { Collection } from '../models/Collection';
import { Op } from 'sequelize';
import { sequelize } from '../models';

export const handler: APIGatewayProxyHandler = async (event) => {
  await sequelize.authenticate();

  try {
    console.log(event)
    const body = event.body ? JSON.parse(event.body) : {};
    const { shopper_id, merchant_id, id, bin, last_4 } = body || {};

    const where: any = {};

    console.log(bin,last_4)

    // 👉 Exclusive filter if bin + last_4 is provided
    if (bin && last_4) {
      console.log("inside last_4 and bin")
      where.bin = bin;
      where.last_4 = last_4;
    } else {
      if (shopper_id) {
        const ids = shopper_id.split(',').map((v: string) => v.trim());
        where.shopper_id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
      }

      if (merchant_id) {
        const ids = merchant_id.split(',').map((v: string) => v.trim());
        where.merchant_id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
      }

      if (id) {
        const ids = id.split(',').map((v: string) => v.trim());
        where.id = ids.length > 1 ? { [Op.in]: ids } : ids[0];
      }
    }

    const collections = await Collection.findAll({ where });

    if (collections.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: '❌ No collections found matching the criteria.' })
      };
    }

    console.log(`📥 Found ${collections.length} matching collections`);

    const inputData = collections.map((item, index) => {
      const data = {
        id: item.id,
        total_sales_count: item.total_sales,
        successful_sales_count: item.total_sales,
        refund_count: item.total_refunds,
        chargeback_count: item.total_chargebacks,
        total_sales_amount: item.total_sale_amount,
        refund_amount: item.total_refund_amount,
        chargeback_amount: item.total_chargeback_amount,
        fraud_score: item.layer1_score ?? 50
      };
      console.log(`🔍 Record ${index + 1}:`, data);
      return data;
    });

    console.log("Input data",inputData)

    const rawResults = await callPython('rules_layer2.py', inputData);

    const scoredResults = rawResults.map((result: any) => {
      let status = '';

      if (result.ml_prediction === 'fraud') {
        status = 'd';
      } else if (result.ml_prediction === 'good') {
        status = 'a';
      } else if (result.ml_prediction === 'review') {
        status = 'r'
      }

      return {
        id: result.id,
        // fraud_score: result.score,
        layer2_status: status
      };
    });

    for (const result of scoredResults) {
      await Collection.update(
        {
          layer1_score: result.fraud_score,
          layer2_status: result.layer2_status
        },
        { where: { id: result.id } }
      );
      console.log(`✅ Updated ID ${result.id} with score ${result.fraud_score} and status ${result.layer2_status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `✅ Successfully updated fraud scores for ${scoredResults.length} collection(s).`,
        updated_count: scoredResults.length,
        updated_ids: scoredResults.map((r:any) => r.id),
        updates: scoredResults
      })
    };
  } catch (err: any) {
    console.log('❌ Scoring failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Scoring failed', detail: err.message })
    };
  }
};








