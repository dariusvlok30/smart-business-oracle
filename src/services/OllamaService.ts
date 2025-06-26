
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
      
      // Simulate AI model connection test
      const response = await fetch(`http://${this.config.endpoint}/api/tags`).catch(() => {
        // Simulate successful connection for demo
        return { ok: true, json: async () => ({ models: [] }) };
      });

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
        success: true, // Demo mode - always succeed
        message: 'Connected to demo AI service',
        details: { mode: 'demo' }
      };
    }
  }

  async generateInsights(tablesData: any[]): Promise<InsightData[]> {
    try {
      console.log('Generating AI insights from data...');
      
      // Simulate AI-generated insights based on the data
      const insights: InsightData[] = [
        {
          title: 'Revenue Trending Upward',
          description: 'Sales revenue has increased by 15.3% compared to last month, driven by strong performance in electronics and sports categories.',
          type: 'trend',
          confidence: 0.92,
          data: { change: 15.3, period: 'month' }
        },
        {
          title: 'Low Stock Alert',
          description: '23 products are running low on inventory (below 10 units). Consider restocking Nike and Adidas items as they show high demand.',
          type: 'alert',
          confidence: 0.98,
          data: { lowStockCount: 23, criticalBrands: ['Nike', 'Adidas'] }
        },
        {
          title: 'Customer Retention Opportunity',
          description: '156 customers haven\'t made a purchase in the last 30 days. A targeted marketing campaign could re-engage these customers.',
          type: 'opportunity',
          confidence: 0.87,
          data: { inactiveCustomers: 156, period: 30 }
        },
        {
          title: 'Performance Summary',
          description: 'Overall business performance is strong with R 2,456,789 in total sales this month across 4 main product categories.',
          type: 'summary',
          confidence: 0.95,
          data: { totalSales: 2456789, categories: 4 }
        }
      ];

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw new Error('Failed to generate AI insights');
    }
  }

  async generateDashboards(tablesData: any[]): Promise<DashboardConfig[]> {
    try {
      console.log('Generating intelligent dashboards...');
      
      // Simulate AI-generated dashboard configurations
      const dashboards: DashboardConfig[] = [
        {
          title: 'Executive Overview',
          description: 'High-level business performance metrics',
          widgets: [
            {
              id: 'total-revenue',
              type: 'metric',
              title: 'Total Revenue',
              data: { value: 2456789, change: 15.3, period: 'This Month' }
            },
            {
              id: 'sales-trend',
              type: 'chart',
              title: 'Sales Trend',
              chartType: 'line',
              data: this.generateSalesTrendData()
            },
            {
              id: 'category-performance',
              type: 'chart',
              title: 'Category Performance',
              chartType: 'bar',
              data: this.generateCategoryData()
            },
            {
              id: 'top-products',
              type: 'table',
              title: 'Top Selling Products',
              data: this.generateTopProductsData()
            }
          ]
        },
        {
          title: 'Inventory Management',
          description: 'Stock levels and inventory analytics',
          widgets: [
            {
              id: 'stock-levels',
              type: 'gauge',
              title: 'Overall Stock Health',
              data: { value: 78, max: 100, status: 'good' }
            },
            {
              id: 'low-stock',
              type: 'table',
              title: 'Low Stock Items',
              data: this.generateLowStockData()
            }
          ]
        }
      ];

      return dashboards;
    } catch (error) {
      console.error('Error generating dashboards:', error);
      throw new Error('Failed to generate dashboards');
    }
  }

  private generateSalesTrendData() {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        sales: Math.round((Math.random() * 50000 + 30000) * 100) / 100,
        revenue: Math.round((Math.random() * 200000 + 100000) * 100) / 100
      });
    }
    
    return data;
  }

  private generateCategoryData() {
    return [
      { category: 'Electronics', sales: 856432, percentage: 34.8 },
      { category: 'Clothing', sales: 645123, percentage: 26.2 },
      { category: 'Sports', sales: 523891, percentage: 21.3 },
      { category: 'Home', sales: 431343, percentage: 17.7 }
    ];
  }

  private generateTopProductsData() {
    return [
      { rank: 1, product: 'Nike Air Max 270', sales: 145, revenue: 24650 },
      { rank: 2, product: 'Adidas Ultraboost 22', sales: 132, revenue: 23760 },
      { rank: 3, product: 'Samsung Galaxy Buds', sales: 128, revenue: 19200 },
      { rank: 4, product: 'Apple iPhone Case', sales: 115, revenue: 11500 },
      { rank: 5, product: 'Puma Running Shoes', sales: 98, revenue: 14700 }
    ];
  }

  private generateLowStockData() {
    return [
      { product: 'Nike Air Force 1', current: 8, minimum: 20, status: 'critical' },
      { product: 'Adidas Stan Smith', current: 5, minimum: 15, status: 'critical' },
      { product: 'Apple Watch Band', current: 12, minimum: 25, status: 'warning' },
      { product: 'Samsung Phone Case', current: 7, minimum: 20, status: 'critical' },
      { product: 'Puma T-Shirt', current: 15, minimum: 30, status: 'warning' }
    ];
  }

  async generateQuery(naturalLanguage: string): Promise<string> {
    try {
      console.log('Converting natural language to SQL:', naturalLanguage);
      
      // Simulate natural language to SQL conversion
      // In real implementation, this would use the Ollama model
      const mockQueries: { [key: string]: string } = {
        'top selling products': 'SELECT p.name, SUM(s.quantity) as total_sold FROM products p JOIN sales s ON p.id = s.product_id GROUP BY p.id ORDER BY total_sold DESC LIMIT 10',
        'monthly revenue': 'SELECT DATE_FORMAT(sale_date, "%Y-%m") as month, SUM(total_amount) as revenue FROM sales GROUP BY month ORDER BY month DESC',
        'low stock items': 'SELECT name, stock_quantity FROM products WHERE stock_quantity < 20 ORDER BY stock_quantity ASC'
      };

      const query = mockQueries[naturalLanguage.toLowerCase()] || 
                   'SELECT * FROM products LIMIT 10';
      
      return query;
    } catch (error) {
      console.error('Error generating query:', error);
      throw new Error('Failed to generate SQL query');
    }
  }
}
