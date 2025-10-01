import axios, { AxiosInstance } from 'axios';

interface OdooConfig {
  url: string;
  db: string;
  username: string;
  password: string;
  apiKey?: string;
}

interface OdooResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * Odoo 18 API Service
 * Handles all communication with Odoo ERP
 */
export class OdooService {
  private config: OdooConfig;
  private uid: number | null = null;
  private sessionId: string | null = null;
  private axios: AxiosInstance;
  private requestId: number = 1;

  constructor(config: OdooConfig) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.url,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Authenticate with Odoo
   */
  async authenticate(): Promise<number> {
    try {
      const response = await this.axios.post<OdooResponse<number>>('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'common',
          method: 'authenticate',
          args: [this.config.db, this.config.username, this.config.password, {}],
        },
        id: this.requestId++,
      });

      if (response.data.error) {
        throw new Error(`Odoo auth error: ${response.data.error.message}`);
      }

      if (!response.data.result) {
        throw new Error('Authentication failed - invalid credentials');
      }

      this.uid = response.data.result;
      
      // Store session if available
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const sessionCookie = cookies.find(c => c.startsWith('session_id='));
        if (sessionCookie) {
          this.sessionId = sessionCookie.split(';')[0].split('=')[1];
        }
      }

      return this.uid;
    } catch (error: any) {
      console.error('Odoo authentication error:', error);
      throw new Error(`Failed to authenticate with Odoo: ${error.message}`);
    }
  }

  /**
   * Execute Odoo method
   */
  async execute<T = any>(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: Record<string, any> = {}
  ): Promise<T> {
    if (!this.uid) {
      await this.authenticate();
    }

    try {
      const response = await this.axios.post<OdooResponse<T>>('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            this.config.db,
            this.uid,
            this.config.password,
            model,
            method,
            args,
            kwargs,
          ],
        },
        id: this.requestId++,
      });

      if (response.data.error) {
        throw new Error(`Odoo error: ${response.data.error.message}`);
      }

      return response.data.result!;
    } catch (error: any) {
      // Try to re-authenticate on 401
      if (error.response?.status === 401) {
        this.uid = null;
        await this.authenticate();
        // Retry once
        return this.execute(model, method, args, kwargs);
      }

      console.error('Odoo execute error:', error);
      throw error;
    }
  }

  /**
   * Search and read records
   */
  async searchRead<T = any>(
    model: string,
    domain: any[] = [],
    fields: string[] = [],
    limit?: number,
    offset?: number,
    order?: string
  ): Promise<T[]> {
    const kwargs: Record<string, any> = {};
    
    if (fields.length > 0) kwargs.fields = fields;
    if (limit) kwargs.limit = limit;
    if (offset) kwargs.offset = offset;
    if (order) kwargs.order = order;

    return this.execute<T[]>(model, 'search_read', [domain], kwargs);
  }

  /**
   * Search for record IDs
   */
  async search(
    model: string,
    domain: any[] = [],
    limit?: number,
    offset?: number,
    order?: string
  ): Promise<number[]> {
    const kwargs: Record<string, any> = {};
    
    if (limit) kwargs.limit = limit;
    if (offset) kwargs.offset = offset;
    if (order) kwargs.order = order;

    return this.execute<number[]>(model, 'search', [domain], kwargs);
  }

  /**
   * Read records by IDs
   */
  async read<T = any>(
    model: string,
    ids: number[],
    fields: string[] = []
  ): Promise<T[]> {
    const kwargs: Record<string, any> = {};
    if (fields.length > 0) kwargs.fields = fields;

    return this.execute<T[]>(model, 'read', [ids], kwargs);
  }

  /**
   * Create a new record
   */
  async create<T = any>(model: string, values: Record<string, any>): Promise<number> {
    return this.execute<number>(model, 'create', [values]);
  }

  /**
   * Update records
   */
  async write(
    model: string,
    ids: number[],
    values: Record<string, any>
  ): Promise<boolean> {
    return this.execute<boolean>(model, 'write', [ids, values]);
  }

  /**
   * Delete records
   */
  async unlink(model: string, ids: number[]): Promise<boolean> {
    return this.execute<boolean>(model, 'unlink', [ids]);
  }

  /**
   * Get fields definition
   */
  async fieldsGet(
    model: string,
    fields: string[] = []
  ): Promise<Record<string, any>> {
    return this.execute(model, 'fields_get', [fields]);
  }

  /**
   * Check if user has access rights
   */
  async checkAccessRights(
    model: string,
    operation: 'read' | 'write' | 'create' | 'unlink'
  ): Promise<boolean> {
    return this.execute(model, 'check_access_rights', [operation, false]);
  }

  /**
   * Get server version
   */
  async getVersion(): Promise<{ server_version: string; server_version_info: number[] }> {
    try {
      const response = await this.axios.post<OdooResponse>('/jsonrpc', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'common',
          method: 'version',
          args: [],
        },
        id: this.requestId++,
      });

      return response.data.result;
    } catch (error: any) {
      console.error('Failed to get Odoo version:', error);
      throw error;
    }
  }

  /**
   * Get current user info
   */
  async getUserInfo(): Promise<any> {
    if (!this.uid) {
      await this.authenticate();
    }

    return this.read('res.users', [this.uid!], [
      'name',
      'login',
      'email',
      'partner_id',
      'groups_id',
      'company_id',
    ]);
  }
}

// Singleton instance
let odooInstance: OdooService | null = null;

export function getOdooService(): OdooService {
  if (!odooInstance) {
    const config: OdooConfig = {
      url: process.env.ODOO_URL || '',
      db: process.env.ODOO_DB || '',
      username: process.env.ODOO_USERNAME || '',
      password: process.env.ODOO_PASSWORD || '',
      apiKey: process.env.ODOO_API_KEY,
    };

    // Validate config
    if (!config.url || !config.db || !config.username || !config.password) {
      throw new Error('Missing Odoo configuration. Check environment variables.');
    }

    odooInstance = new OdooService(config);
  }

  return odooInstance;
}

export default OdooService;
