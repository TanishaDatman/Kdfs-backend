// scripts/initDb.ts
import { sequelize } from '../models/index';

sequelize.sync({ force: true }).then(() => {
  console.log("✅ DB Synced");
  process.exit(0);
});
