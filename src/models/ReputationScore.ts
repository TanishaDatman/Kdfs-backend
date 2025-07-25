// import { DataTypes } from 'sequelize';
// import { sequelize } from '../db';

// export const ReputationScore = sequelize.define('ReputationScore', {
//   bin: DataTypes.STRING,
//   last4: DataTypes.STRING,
//   trust_score: DataTypes.FLOAT,
//   total_transactions: DataTypes.INTEGER,
//   total_sales: DataTypes.INTEGER,
//   total_refunds: DataTypes.INTEGER,
//   total_refund_amount: DataTypes.FLOAT,
//   total_transaction_amount: DataTypes.FLOAT,
//   total_chargebacks: DataTypes.INTEGER,
//   last_updated: DataTypes.DATE
// }, {
//   indexes: [{ fields: ['bin', 'last4'], unique: true }]
// });


// src/models/ReputationScore.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class ReputationScore extends Model {
  @Column({ type: DataType.STRING }) bin!: string;
  @Column({ type: DataType.STRING }) last4!: string;
  @Column({ type: DataType.FLOAT }) trust_score!: number;
  @Column({ type: DataType.INTEGER }) total_transactions!: number;
  @Column({ type: DataType.INTEGER }) total_sales!: number;
  @Column({ type: DataType.INTEGER }) total_refunds!: number;
  @Column({ type: DataType.FLOAT }) total_refund_amount!: number;
  @Column({ type: DataType.FLOAT }) total_transaction_amount!: number;
  @Column({ type: DataType.INTEGER }) total_chargebacks!: number;
  @Column({ type: DataType.DATE }) last_updated!: Date;
}
