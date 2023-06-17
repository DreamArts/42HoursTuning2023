import { createPool, Pool, PoolOptions } from "mysql2/promise";

const mysqlOption: PoolOptions = {
  host: "mysql",
  user: "mysql",
  password: "mysql",
  database: "app",
  waitForConnections: true,
  connectionLimit: 20,
};

const pool: Pool = createPool(mysqlOption);

export default pool;


//下と上であまり変わらなかった。

// import { createPool, Pool, PoolOptions } from "mysql2/promise";

// class Database {
//   private static instance: Database;
//   private pool: Pool;

//   private constructor() {
//     const mysqlOptions: PoolOptions = {
//       host: "mysql",
//       user: "mysql",
//       password: "mysql",
//       database: "app",
//       waitForConnections: true,
//       connectionLimit: 30,
//     };

//     this.pool = createPool(mysqlOptions);
//   }

//   public static getInstance(): Database {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }

//   public getPool(): Pool {
//     return this.pool;
//   }
// }

// const database = Database.getInstance();
// const pool = database.getPool();

// export default pool;
