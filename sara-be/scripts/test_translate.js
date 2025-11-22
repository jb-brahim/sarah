const axios = require('axios');

async function run() {
  try {
    const apiBase = 'http://localhost:3000/api';

    // Signup (create test user). If the email already exists, fall back to login.
    const signupPayload = { name: 'Test AI', email: 'test.ai+1@example.com', password: 'Password1!' };
    let token;
    try {
      const signupResp = await axios.post(`${apiBase}/auth/signup`, signupPayload, { timeout: 10000 });
      console.log('Signup response:');
      console.log(JSON.stringify(signupResp.data, null, 2));
      token = signupResp.data.token;
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message && err.response.data.message.includes('Email already in use')) {
        console.log('Email already exists, logging in instead...');
        const loginResp = await axios.post(`${apiBase}/auth/login`, { email: signupPayload.email, password: signupPayload.password }, { timeout: 10000 });
        console.log('Login response:');
        console.log(JSON.stringify(loginResp.data, null, 2));
        token = loginResp.data.token;
      } else {
        throw err;
      }
    }

    if (!token) {
      console.error('No token returned from auth flow');
      process.exit(1);
    }

    // Call translate
    const translatePayload = { text: 'Hello world, please translate this sentence.', source: 'auto', target: 'fr' };
    const translateResp = await axios.post(`${apiBase}/translate`, translatePayload, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 20000,
    });

    console.log('Translate response:');
    console.log(JSON.stringify(translateResp.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('HTTP error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

run();
