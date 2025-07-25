// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { Transaction } from '../models/Transaction';
// import { Collection, CollectionCreationAttributes } from '../models/Collection';
// import { sequelize } from '../models';
// import { parseBody } from '../utils/parseBody'; // helper for parsing JSON safely
// import { formatJsonListMerge } from '../utils/mergeUtils'; // custom util for merging arrays
// import { Op } from 'sequelize';
// import { subMinutes } from 'date-fns'; // for date math
// import { callPython } from '../services/pythonService'; // service to call Python scripts


// export const train: APIGatewayProxyHandler = async (event) => {
//   await sequelize.authenticate(); // ✅ ensures models are usable
//   try {
//     const data = parseBody(event.body);
//     const { bin, last_4 } = data;


//     if (!bin || !last_4) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Missing bin or last_4 in payload' })
//       };
//     }

//     // 🔁 Count transactions in last 10 minutes
//     const recentTxnCount = await Transaction.count({
//       where: {
//         bin,
//         last_4,
//         createdAt: { [Op.gte]: subMinutes(new Date(), 10) }
//       }
//     });

//     // 🔍 Call Layer 1 Python script
//     const ruleResult = await callPython('rules_layer1.py', {
//       ...data,
//       recent_txn_count: recentTxnCount
//     });
//     const layer1_status: 'a' | 'd' | 'r' = ruleResult.layer1_status;

//     // 💾 Save individual transaction
//     const createdTxn = await Transaction.create({
//       ...data,
//       raw_payload: data
//     });

//     // 📦 Save/update collection
//     const defaults: CollectionCreationAttributes = {
//       bin,
//       last_4,
//       country_code: data.country_code,
//       currency: data.currency,
//       names: [data.name],
//       emails: [data.email],
//       ip_addresses: [data.ip_address],
//       order_ids: [data.order_id],
//       shopper_ids: [data.shopper_id],
//       merchant_ids: [data.merchant_id],
//       total_sales: data.sale ? 1 : 0,
//       total_sale_amount: data.sale ? data.sale_amount : 0,
//       total_refunds: data.refund ? 1 : 0,
//       total_refund_amount: data.refund ? data.refund_amount : 0,
//       total_chargebacks: data.chargeback ? 1 : 0,
//       total_chargeback_amount: data.chargeback ? data.chargeback_amount : 0,
//       recent_txn_count: recentTxnCount,
//       layer1_status,
//       layer2_status: null,
//       last_updated: new Date()
//     };

//     const [collection, created] = await Collection.findOrCreate({
//       where: { bin, last_4 },
//       defaults
//     });

//     if (!created) {
//       collection.names = formatJsonListMerge(collection.names, data.name);
//       collection.emails = formatJsonListMerge(collection.emails, data.email);
//       collection.ip_addresses = formatJsonListMerge(collection.ip_addresses, data.ip_address);
//       collection.order_ids = formatJsonListMerge(collection.order_ids, data.order_id);
//       collection.shopper_ids = formatJsonListMerge(collection.shopper_ids, data.shopper_id);
//       collection.merchant_ids = formatJsonListMerge(collection.merchant_ids, data.merchant_id);

//       if (data.sale) {
//         collection.total_sales += 1;
//         collection.total_sale_amount += data.sale_amount || 0;
//       }
//       if (data.refund) {
//         collection.total_refunds += 1;
//         collection.total_refund_amount += data.refund_amount || 0;
//       }
//       if (data.chargeback) {
//         collection.total_chargebacks += 1;
//         collection.total_chargeback_amount += data.chargeback_amount || 0;
//       }

//       collection.recent_txn_count = recentTxnCount;
//       collection.layer1_status = layer1_status;
//       collection.last_updated = new Date();
//       await collection.save();
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Transaction and collection updated successfully',
//         transaction_id: createdTxn.id,
//         layer1_status
//       })
//     };

//   } catch (err) {
//     console.error('Train error:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Internal server error' })
//     };
//   }
// };
























// import { APIGatewayProxyHandler } from 'aws-lambda';
// import { Transaction } from '../models/Transaction';
// import { Collection, CollectionCreationAttributes } from '../models/Collection';
// import { sequelize } from '../models';
// import { parseBody } from '../utils/parseBody';
// import { formatJsonListMerge } from '../utils/mergeUtils';
// import { Op } from 'sequelize';
// import { subMinutes } from 'date-fns';
// import { callPython } from '../services/pythonService';

// export const train: APIGatewayProxyHandler = async (event) => {
//   console.log('🔧 Authenticating sequelize...');
//   await sequelize.authenticate();

//   try {
//     console.log('📥 Raw event body:', event.body);
//     const data = parseBody(event.body);
//     const { bin, last_4 } = data;
//     console.log('📦 Parsed input data:', data);

//     if (!bin || !last_4) {
//       console.warn('⚠️ Missing required fields: bin or last_4');
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Missing bin or last_4 in payload' })
//       };
//     }

//     console.log(`🔁 Counting transactions for BIN: ${bin}, Last 4: ${last_4}`);
//     const recentTxnCount = await Transaction.count({
//       where: {
//         bin,
//         last_4,
//         createdAt: { [Op.gte]: subMinutes(new Date(), 10) }
//       }
//     });
//     console.log('🔢 Recent transaction count:', recentTxnCount);

//     console.log('🚀 Calling Python script (Layer 1)...');
//     const ruleResult = await callPython('rules_layer1.py', {
//       ...data,
//       recent_txn_count: recentTxnCount
//     });
//     console.log('📤 Python rule result:', ruleResult);

//     // const layer1_status: 'a' | 'd' | 'r' = ruleResult.layer1_status;


//     const {
//       flags,
//       flag_result,
//       score,
//       status_score
//     } = ruleResult;

//     // You can choose which one to persist — flag-based, score-based, or both
//     const layer1_status: 'a' | 'd' | 'r' = status_score;

//     // Optional: log more insights
//     console.log('🎯 Layer 1 status (flag-based):', flag_result);
//     console.log('📊 Layer 1 score:', score);
//     console.log('🚩 Triggered flags:', flags);
//     console.log('🎯 Layer 1 status (score-based):', status_score);

//     console.log('💾 Creating new transaction entry...');
//     const createdTxn = await Transaction.create({
//       ...data,
//       raw_payload: data
//     });
//     console.log('✅ Transaction created with ID:', createdTxn.id);

//     const defaults: CollectionCreationAttributes = {
//       bin,
//       last_4,
//       country_code: data.country_code,
//       currency: data.currency,
//       names: [data.name],
//       emails: [data.email],
//       ip_addresses: [data.ip_address],
//       order_ids: [data.order_id],
//       shopper_ids: [data.shopper_id],
//       merchant_ids: [data.merchant_id],
//       total_txn: data.total_txn || 0, // new field for total transactions
//       total_sales: data.sale ? 1 : 0,
//       total_sale_amount: data.sale ? data.sale_amount : 0,
//       total_refunds: data.refund ? 1 : 0,
//       total_refund_amount: data.refund ? data.refund_amount : 0,
//       total_chargebacks: data.chargeback ? 1 : 0,
//       total_chargeback_amount: data.chargeback ? data.chargeback_amount : 0,
//       recent_txn_count: recentTxnCount,
//       layer1_status,
//       layer2_status: null,
//       layer1_score: ruleResult.score ?? 0,
//       last_updated: new Date()
//     };

//     console.log('🔍 Finding or creating collection entry...');
//     const [collection, created] = await Collection.findOrCreate({
//       where: { bin, last_4 },
//       defaults
//     });

//     if (created) {
//       console.log('🆕 New collection created.');
//     } else {
//       console.log('♻️ Existing collection found. Updating...');
//       collection.names = formatJsonListMerge(collection.names, data.name);
//       collection.emails = formatJsonListMerge(collection.emails, data.email);
//       collection.ip_addresses = formatJsonListMerge(collection.ip_addresses, data.ip_address);
//       collection.order_ids = formatJsonListMerge(collection.order_ids, data.order_id);
//       collection.shopper_ids = formatJsonListMerge(collection.shopper_ids, data.shopper_id);
//       collection.merchant_ids = formatJsonListMerge(collection.merchant_ids, data.merchant_id);
//       collection.total_txn += 1; // update total transactions

//       if (data.sale) {
//         collection.total_sales += 1;
//         collection.total_sale_amount += data.sale_amount || 0;
//       }
//       if (data.refund) {
//         collection.total_refunds += 1;
//         collection.total_refund_amount += data.refund_amount || 0;
//       }
//       if (data.chargeback) {
//         collection.total_chargebacks += 1;
//         collection.total_chargeback_amount += data.chargeback_amount || 0;
//       }

//       collection.recent_txn_count = recentTxnCount;
//       collection.layer1_status = layer1_status;
//       collection.last_updated = new Date();

//       await collection.save();
//       console.log('✅ Collection updated successfully.');
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Transaction and collection updated successfully',
//         last_4: last_4,
//         bin: bin,
//         layer1result: ruleResult
//       })
//     };

//   } catch (err) {
//     console.error('❌ Train error:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Internal server error' })
//     };
//   } finally {
//     try {
//       console.log('🔌 Closing DB connection...');
//       // await sequelize.close();
//       console.log('✅ DB connection closed.');
//     } catch (closeErr) {
//       console.error('❗Error closing DB connection:', closeErr);
//     }
//   }
// };























import { APIGatewayProxyHandler } from 'aws-lambda';
import { Transaction } from '../models/Transaction';
import { Collection, CollectionCreationAttributes } from '../models/Collection';
// import { connectDB, closeDB } from '../models/index';
import { sequelize } from '../models';
import { parseBody } from '../utils/parseBody';
import { formatJsonListMerge } from '../utils/mergeUtils';
import { Op } from 'sequelize';
import { subMinutes } from 'date-fns';
import { callPython } from '../services/pythonService';

// export const train: APIGatewayProxyHandler = async (event) => {
//   try {
//     console.log('🔧 Connecting to DB...');
//     await sequelize.authenticate();

//     console.log('📥 Raw event body:', event.body);
//     const data = parseBody(event.body);
//     const { bin, last_4 } = data;

//     if (!bin || !last_4) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Missing bin or last_4 in payload' })
//       };
//     }

//     const recentTxnCount = await Transaction.count({
//       where: {
//         bin,
//         last_4,
//         createdAt: { [Op.gte]: subMinutes(new Date(), 10) }
//       }
//     });

//     const ruleResult = await callPython('rules_layer1.py', {
//       ...data,
//       recent_txn_count: recentTxnCount
//     });

//     const layer1_status: 'a' | 'd' | 'r' = ruleResult.layer1_status;

//     const createdTxn = await Transaction.create({
//       ...data,
//       raw_payload: data
//     });

//     const defaults: CollectionCreationAttributes = {
//       bin,
//       last_4,
//       country_code: data.country_code,
//       currency: data.currency,
//       names: [data.name],
//       emails: [data.email],
//       ip_addresses: [data.ip_address],
//       order_ids: [data.order_id],
//       shopper_ids: [data.shopper_id],
//       merchant_ids: [data.merchant_id],
//       total_txn: 1,
//       total_sales: data.sale ? 1 : 0,
//       total_sale_amount: data.sale ? data.sale_amount : 0,
//       total_refunds: data.refund ? 1 : 0,
//       total_refund_amount: data.refund ? data.refund_amount : 0,
//       total_chargebacks: data.chargeback ? 1 : 0,
//       total_chargeback_amount: data.chargeback_amount || 0,
//       recent_txn_count: recentTxnCount,
//       layer1_status,
//       layer2_status: null,
//       last_updated: new Date()
//     };

//     const [collection, created] = await Collection.findOrCreate({
//       where: { bin, last_4 },
//       defaults
//     });

//     if (!created) {
//       collection.names = formatJsonListMerge(collection.names, data.name);
//       collection.emails = formatJsonListMerge(collection.emails, data.email);
//       collection.ip_addresses = formatJsonListMerge(collection.ip_addresses, data.ip_address);
//       collection.order_ids = formatJsonListMerge(collection.order_ids, data.order_id);
//       collection.shopper_ids = formatJsonListMerge(collection.shopper_ids, data.shopper_id);
//       collection.merchant_ids = formatJsonListMerge(collection.merchant_ids, data.merchant_id);

//       collection.total_txn += 1;

//       if (data.sale) {
//         collection.total_sales += 1;
//         collection.total_sale_amount += data.sale_amount || 0;
//       }
//       if (data.refund) {
//         collection.total_refunds += 1;
//         collection.total_refund_amount += data.refund_amount || 0;
//       }
//       if (data.chargeback) {
//         collection.total_chargebacks += 1;
//         collection.total_chargeback_amount += data.chargeback_amount || 0;
//       }

//       collection.recent_txn_count = recentTxnCount;
//       collection.layer1_status = layer1_status;
//       collection.last_updated = new Date();

//       await collection.save();
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Transaction and collection updated successfully',
//         transaction_id: createdTxn.id,
//         layer1_status,
//         rule_result: ruleResult
//       })
//     };

//   } catch (err) {
//     console.error('❌ Train error:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Internal server error' })
//     };
//   } finally {
//     console.log('🔌 Closing DB connection...');
//     await sequelize.close();
//     console.log('✅ DB connection closed.');
//   }
// };





















export const train: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('🔧 Connecting to DB...');
    await sequelize.authenticate();

    console.log('📥 Raw event body:', event.body);
    const data = parseBody(event.body);
    const { bin, last_4 } = data;

    if (!bin || !last_4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing bin or last_4 in payload' })
      };
    }

    const recentTxnCount = await Transaction.count({
      where: {
        bin,
        last_4,
        createdAt: { [Op.gte]: subMinutes(new Date(), 10) }
      }
    });

    // 🔍 Check for existing collection
    const existingCollection = await Collection.findOne({ where: { bin, last_4 } });

    const enrichedPayload = {
      // ...data,
      avs_check: data.avs_check,
      cvv_matched: data.cvv_matched,
      billing_address: data.billing_address,
      shipping_address: data.shipping_address,
      recent_txn_count: recentTxnCount,
      total_sales_count: existingCollection?.total_txn || 0,
      total_sales_amount: existingCollection?.total_sale_amount || 0,
      refund_count: existingCollection?.total_refunds || 0,
      refund_amount: existingCollection?.total_refund_amount || 0,
      chargeback_count: existingCollection?.total_chargebacks || 0,
      chargeback_amount: existingCollection?.total_chargeback_amount || 0,
      successful_sales_count: existingCollection?.total_sales || 0, // assuming successful = total
      fraud_score: existingCollection?.layer1_score || 50
    };

    const ruleResult = await callPython('rules_layer1.py', enrichedPayload);

    const layer1_status: 'a' | 'd' | 'r' = ruleResult.status_score;

    const createdTxn = await Transaction.create({
      ...data,
      raw_payload: data
    });

    const defaults: CollectionCreationAttributes = {
      bin,
      last_4,
      country_code: data.country_code,
      currency: data.currency,
      names: [data.name],
      emails: [data.email],
      ip_addresses: [data.ip_address],
      order_ids: [data.order_id],
      shopper_ids: [data.shopper_id],
      merchant_ids: [data.merchant_id],
      total_txn: 1,
      total_sales: data.sale ? 1 : 0,
      total_sale_amount: data.sale ? data.sale_amount : 0,
      total_refunds: data.refund ? 1 : 0,
      total_refund_amount: data.refund ? data.refund_amount : 0,
      total_chargebacks: data.chargeback ? 1 : 0,
      total_chargeback_amount: data.chargeback_amount || 0,
      recent_txn_count: recentTxnCount,
      layer1_status,
      layer2_status: null,
      layer1_score: ruleResult.score, // 🆕 Set computed score here
      last_updated: new Date()
    };

    const [collection, created] = await Collection.findOrCreate({
      where: { bin, last_4 },
      defaults
    });

    if (!created) {
      collection.names = formatJsonListMerge(collection.names, data.name);
      collection.emails = formatJsonListMerge(collection.emails, data.email);
      collection.ip_addresses = formatJsonListMerge(collection.ip_addresses, data.ip_address);
      collection.order_ids = formatJsonListMerge(collection.order_ids, data.order_id);
      collection.shopper_ids = formatJsonListMerge(collection.shopper_ids, data.shopper_id);
      collection.merchant_ids = formatJsonListMerge(collection.merchant_ids, data.merchant_id);

      collection.total_txn += 1;

      if (data.sale) {
        collection.total_sales += 1;
        collection.total_sale_amount += data.sale_amount || 0;
      }
      if (data.refund) {
        collection.total_refunds += 1;
        collection.total_refund_amount += data.refund_amount || 0;
      }
      if (data.chargeback) {
        collection.total_chargebacks += 1;
        collection.total_chargeback_amount += data.chargeback_amount || 0;
      }

      collection.recent_txn_count = recentTxnCount;
      collection.layer1_status = layer1_status;
      collection.layer1_score = ruleResult.score; // 🆕 update on re-train
      collection.last_updated = new Date();

      await collection.save();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transaction and collection updated successfully',
        transaction_id: createdTxn.id,
        // layer1_status,
        bin,
        last_4,
        layer1result: ruleResult
      })
    };

  } catch (err) {
    console.error('❌ Train error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  } finally {
    console.log('🔌 Closing DB connection...');
    // await sequelize.close();
    console.log('✅ DB connection closed.');
  }
};
