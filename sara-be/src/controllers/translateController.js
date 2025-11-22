const axios = require('axios');

// Translate controller: forwards request to a configured LibreTranslate-compatible
// endpoint. If no API key / URL is configured for a paid endpoint (eg. libretranslate.com),
// we fall back to a public instance that doesn't require an API key.
const translate = async (req, res, next) => {
  // Pull these out here so the catch block can still reference them
  const { text, source = 'auto', target } = req.body || {};
  try {
    if (!text || !target) return res.status(400).json({ message: 'text and target are required' });

    // Prefer configured URL, otherwise use a reliable public fallback
    const configuredUrl = process.env.LIBRETRANSLATE_URL;
    const apiKey = process.env.LIBRETRANSLATE_KEY;

    // If configured URL looks like libretranslate.com and no key is provided,
    // switch to a public fallback that doesn't require a key.
    let url = configuredUrl || 'https://translate.argosopentech.com/translate';
    let payload = { q: text, source, target };

    if (apiKey) {
      payload.api_key = apiKey;
    } else if (configuredUrl && configuredUrl.includes('libretranslate.com') && !apiKey) {
      // configured libretranslate.com requires API key — use fallback
      url = 'https://translate.argosopentech.com/translate';
    }

    // Debug: log chosen upstream and payload
    console.log('Translating via:', url)
    console.log('Payload:', { q: text, source, target, api_key: apiKey ? '***REDACTED***' : undefined })

    // Add a reasonable timeout so requests don't hang
    let response = await axios.post(url, payload, { timeout: 10000 })

    // Debug: log upstream response (trim large payloads)
    try {
      console.log('Upstream response (type):', typeof response.data)
      console.log('Upstream response (preview):', typeof response.data === 'object' ? JSON.stringify(response.data).slice(0, 1000) : String(response.data).slice(0, 1000))
    } catch (e) {
      console.log('Upstream response (raw):', response.data)
    }

    // If upstream returned HTML (site landing page) instead of JSON, try alternative encodings and fallbacks
    const looksLikeHtml = (d) => typeof d === 'string' && /<!doctype|<html/i.test(d)
    if (looksLikeHtml(response.data)) {
      console.warn('Upstream returned HTML; retrying with form-encoded payload')
      try {
        const params = new URLSearchParams()
        params.append('q', text)
        params.append('source', source)
        params.append('target', target)
        if (apiKey) params.append('api_key', apiKey)

        response = await axios.post(url, params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 10000,
        })

        console.log('Retry (form-encoded) response type:', typeof response.data)
      } catch (err) {
        console.warn('Form-encoded retry failed:', err.message || err)
      }
    }

    // If still HTML or empty, try a couple known public fallbacks (best-effort)
    if (looksLikeHtml(response.data) || !response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
      const fallbacks = [
        'https://libretranslate.com/translate',
        'https://translate.argosopentech.com/translate',
      ]
      for (const fb of fallbacks) {
        try {
          console.log('Trying fallback upstream:', fb)
          const params = apiKey ? { q: text, source, target, api_key: apiKey } : { q: text, source, target }
          response = await axios.post(fb, params, { timeout: 10000 })
          console.log('Fallback response type:', typeof response.data)
          if (!looksLikeHtml(response.data) && (response.data.translatedText || response.data.translated || response.data.result)) {
            break
          }
        } catch (err) {
          console.warn('Fallback', fb, 'failed:', err.message || err)
        }
      }
    }

    // If still nothing, try MyMemory public API as a free fallback (no key required)
    if (!response || !response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0) || looksLikeHtml(response.data)) {
      try {
        console.log('Trying free MyMemory fallback')
        // MyMemory expects langpair like 'en|fr' and returns responseData.translatedText
        const src = source === 'auto' ? 'en' : source // best-effort default when autodetect
        const pair = `${src}|${target}`
        const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`
        const mmResp = await axios.get(mmUrl, { timeout: 8000 })
        console.log('MyMemory response preview:', typeof mmResp.data === 'object' ? JSON.stringify(mmResp.data).slice(0, 1000) : String(mmResp.data).slice(0,1000))
        const mmTranslated = mmResp.data && (mmResp.data.responseData && mmResp.data.responseData.translatedText)
        if (mmTranslated) {
          return res.json({ translatedText: mmTranslated, source, target })
        }
      } catch (err) {
        console.warn('MyMemory fallback failed:', err.message || err)
      }
    }

    // Normalize response shape
    const translatedText = (response && response.data && (response.data.translatedText || response.data.translated || response.data.result)) || ''

    // If still empty, include a note for the frontend explaining fallback
    if (!translatedText) {
      const upstreamMsg = 'Upstream translation returned no result or returned HTML landing page'
      return res.status(200).json({
        translatedText: text || '',
        source: source || 'auto',
        target: target || null,
        note: `Translation service unavailable: ${upstreamMsg}`,
      })
    }

    res.json({ translatedText, source, target })
  } catch (err) {
    // If upstream reports a helpful message (like missing API key), log it and
    // return a safe fallback so the frontend doesn't get a 500/400. We return
    // the original text as the "translated" text and include a note so the UI
    // can surface that translation was unavailable.
    console.warn('Translation service failed:', err?.response?.data || err.message || err);
    const upstreamMsg = err?.response?.data?.error || err?.response?.data?.message || null;
    return res.status(200).json({
      translatedText: text || '',
      source: source || 'auto',
      target: target || null,
      note: upstreamMsg ? `Translation service unavailable: ${upstreamMsg}` : 'Translation service unavailable, showing original text',
    });
  }
};

module.exports = { translate };