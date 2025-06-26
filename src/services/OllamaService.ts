
export interface AIConfig {
  endpoint: string;
  model: string;
}

export interface InsightData {
  title: string;
  description: string;
  type: 'trend' | 'alert' | 'opportunity' | 'summary';
  confidence: number;
  data?: any;
}

export interface DashboardConfig {
  title: string;
  description: string;
  widgets: WidgetConfig[];
}

export interface WidgetConfig {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge';
  title: string;
  data: any;
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  config?: any;
}

export class OllamaService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('Testing Ollama connection to:', this.config.endpoint);
      
      const response = await fetch(`http://${this.config.endpoint}/api/tags`);

      if (response.ok) {
        return {
          success: true,
          message: 'AI model connection successful',
          details: {
            endpoint: this.config.endpoint,
            model: this.config.model,
            connectedAt: new Date()
          }
        };
      } else {
        return {
          success: false,
          message: 'AI model connection failed'
        };
      }
    } catch (error) {
      console.error('AI connection error:', error);
      return {
        success: false,
        message: 'AI model connection failed',
        details: { error: error.message }
      };
    }
  }

  async generateInsights(tablesData: any[]): Promise<InsightData[]> {
    try {
      console.log('Generating AI insights from real data...');
      
      const prompt = this.createInsightPrompt(tablesData);
      
      const response = await fetch(`http://${this.config.endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const result = await response.json();
      return this.parseInsights(result.response, tablesData);
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.generateFallbackInsights(tablesData);
    }
  }

  async generateDashboards(tablesData: any[]): Promise<DashboardConfig[]> {
    try {
      console.log('Generating intelligent dashboards from real data...');
      
      const prompt = this.createDashboardPrompt(tablesData);
      
      const response = await fetch(`http://${this.config.endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate dashboards');
      }

      const result = await response.json();
      return this.parseDashboards(result.response, tablesData);
    } catch (error) {
      console.error('Error generating dashboards:', error);
      return this.generateFallbackDashboards(tablesData);
    }
  }

  private createInsightPrompt(tablesData: any[]): string {
    const dataOverview = tablesData.map(table => ({
      name: table.name,
      rowCount: table.rowCount,
      columns: table.columns.map(col => col.name),
      sampleData: table.sampleData?.slice(0, 3)
    }));

    return `
Analyze this business database and generate actionable insights:

Database Overview:
${JSON.stringify(dataOverview, null, 2)}

Generate 4 key business insights in JSON format:
[
  {
    "title": "insight title",
    "description": "detailed description with specific numbers",
    "type": "trend|alert|opportunity|summary",
    "confidence": 0.9
  }
]

Focus on:
- Revenue and sales patterns
- Inventory levels and stock alerts
- Customer behavior and retention
- Performance trends and opportunities
`;
  }

  private createDashboardPrompt(tablesData: any[]): string {
    const tableStructure = tablesData.map(table => ({
      name: table.name,
      columns: table.columns,
      rowCount: table.rowCount
    }));

    return `
Create dashboard configurations for this database schema:

${JSON.stringify(tableStructure, null, 2)}

Generate dashboard configs in JSON format that use REAL data from these tables.
Focus on creating meaningful business dashboards with appropriate chart types based on the actual data structure.

Return format:
[
  {
    "title": "Dashboard Name",
    "description": "Dashboard description",
    "widgets": [
      {
        "id": "unique-id",
        "type": "metric|chart|table|gauge",
        "title": "Widget Title",
        "chartType": "bar|line|pie",
        "dataSource": {
          "table": "table_name",
          "columns": ["col1", "col2"],
          "aggregation": "SUM|COUNT|AVG"
        }
      }
    ]
  }
]
`;
  }

  private parseInsights(aiResponse: string, tablesData: any[]): InsightData[] {
    try {
      const insights = JSON.parse(aiResponse);
      return Array.isArray(insights) ? insights : [];
    } catch (error) {
      return this.generateFallbackInsights(tablesData);
    }
  }

  private parseDashboards(aiResponse: string, tablesData: any[]): DashboardConfig[] {
    try {
      const dashboards = JSON.parse(aiResponse);
      return Array.isArray(dashboards) ? dashboards : [];
    } catch (error) {
      return this.generateFallbackDashboards(tablesData);
    }
  }

  private generateFallbackInsights(tablesData: any[]): InsightData[] {
    if (!tablesData || tablesData.length === 0) {
      return [{
        title: 'No Data Available',
        description: 'No database tables found or accessible',
        type: 'alert',
        confidence: 1.0
      }];
    }

    return tablesData.slice(0, 4).map((table, index) => ({
      title: `${table.name} Analysis`,
      description: `Found ${table.rowCount?.toLocaleString() || 0} records in ${table.name} table with ${table.columns?.length || 0} columns`,
      type: index % 2 === 0 ? 'summary' : 'trend',
      confidence: 0.8
    }));
  }

  private generateFallbackDashboards(tablesData: any[]): DashboardConfig[] {
    if (!tablesData || tablesData.length === 0) {
      return [];
    }

    return [{
      title: 'Data Overview',
      description: 'Overview of available database tables',
      widgets: tablesData.map((table, index) => ({
        id: `table-${index}`,
        type: 'table',
        title: table.name,
        data: table.sampleData || []
      }))
    }];
  }

  async generateQuery(naturalLanguage: string): Promise<string> {
    try {
      console.log('Converting natural language to SQL:', naturalLanguage);
      
      const response = await fetch(`http://${this.config.endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt: `Convert this to SQL: ${naturalLanguage}`,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate query');
      }

      const result = await response.json();
      return result.response || 'SELECT 1';
    } catch (error) {
      console.error('Error generating query:', error);
      throw new Error('Failed to generate SQL query');
    }
  }
}
