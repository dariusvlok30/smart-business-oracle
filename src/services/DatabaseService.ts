
export interface DatabaseConfig {
  host: string;
  database: string;
  username: string;
  password: string;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  rowCount: number;
  sampleData: any[];
  relationships: RelationshipInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface RelationshipInfo {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export class DatabaseService {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('Testing database connection to:', this.config.host);
      
      const response = await fetch('/api/db/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.config)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'Database connection successful',
          details: {
            host: this.config.host,
            database: this.config.database,
            connectedAt: new Date()
          }
        };
      } else {
        return {
          success: false,
          message: 'Database connection failed'
        };
      }
    } catch (error) {
      console.error('Database connection error:', error);
      return {
        success: false,
        message: 'Database connection failed',
        details: { error: error.message }
      };
    }
  }

  async discoverSchema(): Promise<TableInfo[]> {
    try {
      console.log('Discovering database schema...');
      
      const response = await fetch('/api/db/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.config)
      });

      if (!response.ok) {
        throw new Error('Failed to discover schema');
      }

      const schema = await response.json();
      return schema.tables || [];
    } catch (error) {
      console.error('Schema discovery error:', error);
      throw new Error('Failed to discover database schema');
    }
  }

  async getAllTablesData(): Promise<TableInfo[]> {
    try {
      console.log('Fetching all tables data...');
      
      const response = await fetch('/api/db/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.config)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch table data');
      }

      const data = await response.json();
      return data.tables || [];
    } catch (error) {
      console.error('Error fetching tables data:', error);
      throw new Error('Failed to fetch tables data');
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    try {
      console.log('Executing query:', query);
      
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.config,
          query
        })
      });

      if (!response.ok) {
        throw new Error('Query execution failed');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Query execution error:', error);
      throw new Error('Failed to execute query');
    }
  }

  async getAggregatedData(tableName: string, groupBy: string, aggregateColumn: string, aggregateFunction: string = 'SUM'): Promise<any[]> {
    try {
      const query = `
        SELECT ${groupBy}, ${aggregateFunction}(${aggregateColumn}) as value 
        FROM ${tableName} 
        WHERE ${aggregateColumn} IS NOT NULL 
        GROUP BY ${groupBy} 
        ORDER BY value DESC
      `;
      
      return await this.executeQuery(query);
    } catch (error) {
      console.error('Error getting aggregated data:', error);
      return [];
    }
  }

  async getTimeSeriesData(tableName: string, dateColumn: string, valueColumn: string, interval: string = 'DAY'): Promise<any[]> {
    try {
      const query = `
        SELECT DATE(${dateColumn}) as date, SUM(${valueColumn}) as value 
        FROM ${tableName} 
        WHERE ${dateColumn} IS NOT NULL AND ${valueColumn} IS NOT NULL 
        GROUP BY DATE(${dateColumn}) 
        ORDER BY date DESC 
        LIMIT 30
      `;
      
      return await this.executeQuery(query);
    } catch (error) {
      console.error('Error getting time series data:', error);
      return [];
    }
  }
}
