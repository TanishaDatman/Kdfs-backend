// src/models/index.ts
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from './Transaction';
import { ReputationScore } from './ReputationScore';
import { Collection, CollectionCreationAttributes } from './Collection';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: "localhost",
  port: Number(3306),
  username: 'root',
  password: '12345678',
  database: 'test',
  models: [Transaction, Collection],
  logging: false
});







// // src/models/index.ts
// import { Sequelize } from 'sequelize-typescript';
// import { Transaction } from './Transaction';
// import { Collection } from './Collection';
// import { ReputationScore } from './ReputationScore';

// let sequelize: Sequelize;

// export const getDB = () => {
//   if (!sequelize) {
//     sequelize = new Sequelize({
//       dialect: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'Harsh@3006123',
//       database: 'test',
//       models: [Transaction, Collection, ReputationScore],
//       logging: false,
//     });
//   }
//   return sequelize;
// };

// export const connectDB = async () => {
//   const db = getDB();
//   await db.authenticate();

//   if (process.env.NODE_ENV !== 'production') {
//     await db.sync(); // Auto-sync tables only in dev/test
//   }

//   return db;
// };

// export const closeDB = async () => {
//   if (sequelize) {
//     await sequelize.close();
//     sequelize = null as any;
//   }
// };
