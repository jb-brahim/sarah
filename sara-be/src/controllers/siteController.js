const Site = require('../models/Site');

const getAll = async (req, res, next) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const site = await Site.create(req.body);
    res.status(201).json(site);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const site = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json({ message: 'Site deleted' });
  } catch (err) {
    next(err);
  }
};

// Server-Sent Events stream for real-time site updates.
// This simple implementation polls the DB every `pollIntervalMs` and
// pushes the full list when it changes. It's intentionally lightweight
// to avoid requiring MongoDB change streams or additional infra.
const stream = async (req, res, next) => {
  try {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    let lastPayload = '';
    const pollIntervalMs = 5000; // 5s

    const send = (data) => {
      try {
        const payload = JSON.stringify(data);
        res.write(`data: ${payload}\n\n`);
      } catch (err) {
        console.error('SSE send error:', err);
      }
    };

    // Send initial data immediately
    const initial = await Site.find();
    lastPayload = JSON.stringify(initial);
    send(initial);

    const interval = setInterval(async () => {
      try {
        const sites = await Site.find();
        const str = JSON.stringify(sites);
        if (str !== lastPayload) {
          lastPayload = str;
          send(sites);
        }
      } catch (err) {
        console.error('SSE poll error:', err);
      }
    }, pollIntervalMs);

    // Clean up when the client disconnects
    req.on('close', () => {
      clearInterval(interval);
      try { res.end(); } catch (err) {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  delete: deleteOne,
  stream,
};