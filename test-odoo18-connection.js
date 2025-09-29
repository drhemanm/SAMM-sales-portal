const axios = require('axios');
require('dotenv').config();

async function testOdoo18Connection() {
  const config = {
    url: process.env.ODOO_URL,
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    password: process.env.ODOO_PASSWORD,
  };

  console.log('🔄 Testing Odoo 18 connection...');
  console.log(`📍 URL: ${config.url}`);
  console.log(`📊 Database: ${config.db}`);

  try {
    // Step 1: Get Odoo version
    const versionResponse = await axios.post(`${config.url}/jsonrpc`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'common',
        method: 'version',
        args: []
      },
      id: 1
    });

    console.log('✅ Server reached');
    console.log('📌 Odoo Version:', versionResponse.data.result.server_version);

    // Step 2: Authenticate
    const authResponse = await axios.post(`${config.url}/jsonrpc`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'common',
        method: 'authenticate',
        args: [config.db, config.username, config.password, {}]
      },
      id: 2
    });

    const uid = authResponse.data.result;
    if (!uid) {
      throw new Error('Authentication failed - check credentials');
    }

    console.log('✅ Authentication successful');
    console.log('👤 User ID:', uid);

    // Step 3: Test data access
    const testResponse = await axios.post(`${config.url}/jsonrpc`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'object',
        method: 'execute_kw',
        args: [
          config.db,
          uid,
          config.password,
          'res.partner',
          'search_count',
          [[['is_company', '=', true], ['customer_rank', '>', 0]]]
        ]
      },
      id: 3
    });

    console.log('✅ Data access successful');
    console.log('📊 Total customers:', testResponse.data.result);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

testOdoo18Connection();
