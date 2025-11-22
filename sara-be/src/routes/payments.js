const express = require('express');
const router = express.Router();

// POST /payments/create-intent
// Basic skeleton: if STRIPE_SECRET present, attempt to create payment intent.
// Otherwise return a placeholder indicating Stripe not configured.
router.post('/create-intent', async (req, res) => {
  const { amount } = req.body;
  const stripeSecret = process.env.STRIPE_SECRET;
  if (!stripeSecret) {
    return res.json({ ok: false, message: 'Stripe not configured on server', clientSecret: null });
  }

  try {
    const Stripe = require('stripe');
    const stripe = Stripe(stripeSecret);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.max(1, Math.round(amount * 100)),
      currency: 'usd',
    });
    res.json({ ok: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error', err);
    res.status(500).json({ ok: false, message: 'Stripe error' });
  }
});

module.exports = router;
