// Simple test script to verify Odoo connection
const axios = require('axios');

const ODOO_CONFIG = {
  url: process.env.ODOO_URL,
  db: process.env.ODOO_DB,
  username: process.env.ODOO_USERNAME,
  password: process.env.ODOO_PASSWORD
};

async function testConnection() {
  try {
    console.log('Testing Odoo connection...');
    
    // Test authentication
    const response = await axios.post(`${ODOO_CONFIG.url}/web/session/authenticate`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: ODOO_CONFIG.db,
        login: ODOO_CONFIG.username,
        password: ODOO_CONFIG.password
      }
    });
    
    if (response.data.result && response.data.result.uid) {
      console.log('✅ Authentication successful');
      console.log('User ID:', response.data.result.uid);
      console.log('Session ID:', response.data.result.session_id);
    } else {
      console.log('❌ Authentication failed');
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
