import mysql, { Pool, RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2/promise';
import fs from 'fs';

class MySQLService {
  private pool: Pool;

  constructor() {
    const dbConfig: mysql.PoolOptions = {
      host: process.env.HOST!,
      user: process.env.DBUSER!,
      password: process.env.PASSWORD!,
      database: process.env.DB!,
      port: 4000,
      ssl: {
        minVersion: 'TLSv1.2',
        ca: fs.readFileSync('./src/app/services/cert.pem').toString(),
      },
      waitForConnections: true,
      connectionLimit: 30,
      maxIdle: 10,
      idleTimeout: 180000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      multipleStatements: true,
      connectTimeout: 60000,
    };

    this.pool = mysql.createPool(dbConfig);
  }

  // Execute query with retries
  async runquery<T extends RowDataPacket[] | RowDataPacket[][] | OkPacket | ResultSetHeader>(
    sql: string,
    params: any[] = [],
    maxRetries = 3,
    retryInterval = 1000
  ): Promise<T> {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const connection = await this.pool.getConnection();
        try {
          const [rows] = await connection.execute<T>(sql, params);
          return rows;
        } finally {
          connection.release();
        }
      } catch (error) {
        if (
          (error as mysql.QueryError).code === 'ECONNRESET' ||
          (error as mysql.QueryError).code === 'ETIMEDOUT'
        ) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        } else {
          throw error;
        }
      }
    }

    throw new Error('Max retries reached, query failed.');
  }
}

export default MySQLService;
