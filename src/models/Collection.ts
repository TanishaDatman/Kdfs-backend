// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   PrimaryKey,
//   AutoIncrement
// } from 'sequelize-typescript';

// export interface CollectionAttributes {
//   id?: number;
//   bin: string;
//   last_4: string;
//   country_code: string;
//   currency: string;
//   names: string[];
//   emails: string[];
//   ip_addresses: string[];
//   order_ids: string[];
//   shopper_ids: string[];
//   merchant_ids: string[];
//   total_sales: number;
//   total_sale_amount: number;
//   total_refunds: number;
//   total_refund_amount: number;
//   total_chargebacks: number;
//   total_chargeback_amount: number;
//   layer1_status: 'a' | 'd' | 'r';
//   layer2_status: 'a' | 'd' | 'r' | null;
//   recent_txn_count: number;
//   last_updated: Date;
//   fraud_score?: number; // optional, but useful for score tracking
// }

// export type CollectionCreationAttributes = Omit<CollectionAttributes, 'id'>;

// @Table
// export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> {
//   @PrimaryKey
//   @AutoIncrement
//   @Column
//   id!: number;

//   @Column(DataType.STRING) bin!: string;
//   @Column(DataType.STRING) last_4!: string;
//   @Column(DataType.STRING) country_code!: string;
//   @Column(DataType.STRING) currency!: string;

//   @Column(DataType.ARRAY(DataType.STRING)) names!: string[];
//   @Column(DataType.ARRAY(DataType.STRING)) emails!: string[];
//   @Column(DataType.ARRAY(DataType.STRING)) ip_addresses!: string[];
//   @Column(DataType.ARRAY(DataType.STRING)) order_ids!: string[];
//   @Column(DataType.ARRAY(DataType.STRING)) shopper_ids!: string[];
//   @Column(DataType.ARRAY(DataType.STRING)) merchant_ids!: string[];

//   @Column(DataType.INTEGER) total_sales!: number;
//   @Column(DataType.FLOAT) total_sale_amount!: number;
//   @Column(DataType.INTEGER) total_refunds!: number;
//   @Column(DataType.FLOAT) total_refund_amount!: number;
//   @Column(DataType.INTEGER) total_chargebacks!: number;
//   @Column(DataType.FLOAT) total_chargeback_amount!: number;
//   @Column(DataType.STRING) layer1_status!: 'a' | 'd' | 'r';
//   @Column(DataType.STRING) layer2_status!: 'a' | 'd' | 'r' | null;
//   @Column(DataType.DATE) last_updated!: Date;
//   @Column({ type: DataType.INTEGER, defaultValue: 0 }) recent_txn_count!: number;
//   @Column({ type: DataType.FLOAT, defaultValue: 40 }) fraud_score!: number; // optional, but useful for score tracking
// }






import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript';

export interface CollectionAttributes {
    id?: number;
    bin: string;
    last_4: string;
    country_code: string;
    currency: string;
    names: string[];
    emails: string[];
    ip_addresses: string[];
    order_ids: string[];
    shopper_ids: string[];
    merchant_ids: string[];
    total_txn: number;
    total_sales: number;
    total_sale_amount: number;
    total_refunds: number;
    total_refund_amount: number;
    total_chargebacks: number;
    total_chargeback_amount: number;
    layer1_status: 'a' | 'd' | 'r';
    layer2_status: 'a' | 'd' | 'r' | null;
    recent_txn_count: number;
    last_updated: Date;
    layer1_score?: number; // updated field
}

export type CollectionCreationAttributes = Omit<CollectionAttributes, 'id'>;

@Table({ timestamps: true })
export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING) bin!: string;
    @Column(DataType.STRING) last_4!: string;
    @Column(DataType.STRING) country_code!: string;
    @Column(DataType.STRING) currency!: string;

    @Column(DataType.JSON) names!: string[];
    @Column(DataType.JSON) emails!: string[];
    @Column(DataType.JSON) ip_addresses!: string[];
    @Column(DataType.JSON) order_ids!: string[];
    @Column(DataType.JSON) shopper_ids!: string[];
    @Column(DataType.JSON) merchant_ids!: string[];

    @Column(DataType.INTEGER) total_txn!: number;
    @Column(DataType.INTEGER) total_sales!: number;
    @Column(DataType.FLOAT) total_sale_amount!: number;
    @Column(DataType.INTEGER) total_refunds!: number;
    @Column(DataType.FLOAT) total_refund_amount!: number;
    @Column(DataType.INTEGER) total_chargebacks!: number;
    @Column(DataType.FLOAT) total_chargeback_amount!: number;

    @Column(DataType.STRING) layer1_status!: 'a' | 'd' | 'r';
    @Column(DataType.STRING) layer2_status!: 'a' | 'd' | 'r' | null;
    @Column(DataType.DATE) last_updated!: Date;
    @Column({ type: DataType.INTEGER, defaultValue: 0 }) recent_txn_count!: number;

    // 🔄 renamed from fraud_score to layer1_score
    @Column({ type: DataType.FLOAT, defaultValue: 40 }) layer1_score!: number;
}
