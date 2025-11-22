const axios = require('axios');

async function run() {
  try {
    const apiBase = 'http://localhost:3000/api';

    // Signup/login
    const authPayload = { name: 'Test AI', email: 'test.ai+1@example.com', password: 'Password1!' };
    let token;
    try {
      const signupResp = await axios.post(`${apiBase}/auth/signup`, authPayload, { timeout: 10000 });
      console.log('Signup response:', signupResp.data);
      token = signupResp.data.token;
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && typeof err.response.data.message === 'string' && err.response.data.message.includes('Email already in use')) {
        console.log('Email exists, logging in');
        const loginResp = await axios.post(`${apiBase}/auth/login`, { email: authPayload.email, password: authPayload.password }, { timeout: 10000 });
        console.log('Login response:', loginResp.data);
        token = loginResp.data.token;
      } else {
        throw err;
      }
    }

    if (!token) throw new Error('No token from auth');
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch a hotel to book
    const hotelsResp = await axios.get(`${apiBase}/hotels`, { timeout: 10000 });
    const hotels = hotelsResp.data || [];
    if (!hotels.length) {
      console.error('No hotels available to test reservation');
      process.exit(1);
    }
    const hotel = hotels[0];
    console.log('Using hotel:', hotel._id || hotel.id, hotel.name);

    // Create reservation
    const payload = {
      hotel: hotel._id || hotel.id,
      from: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      to: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      price: hotel.price || 100,
    };

    const createResp = await axios.post(`${apiBase}/reservations`, payload, { headers, timeout: 10000 });
    console.log('Create reservation response:', createResp.status, createResp.data);
    const reservation = createResp.data;
    const reservationId = reservation._id || reservation.id;

    // Cancel reservation
    const cancelResp = await axios.put(`${apiBase}/reservations/${reservationId}/cancel`, {}, { headers, timeout: 10000 });
    console.log('Cancel response:', cancelResp.status, cancelResp.data);

    console.log('Reservation create+cancel test completed successfully');
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
