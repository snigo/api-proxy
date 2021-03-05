const { Router } = require('express');
const axios = require('axios');
const queryString = require('query-string');
const { setApi, getApi } = require('../store');

const router = Router();

router.post('/api', async (req, res) => {
  const {
    apiName, baseUrl, key, keyParam,
  } = req.body;
  if (!apiName || !baseUrl || !key || !keyParam) return res.status(400).json({ error: 'Please submit all required parameters.' });
  try {
    const record = await setApi({
      apiName,
      baseUrl,
      key,
      keyParam,
    });
    if (record) return res.status(200).json({ success: true, status: 200 });
    throw new Error('Database error: Nicht heute.');
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get('/api', async (req, res) => {
  const { apiname, endpoint, ...apiqueries } = req.query;
  if (!apiname || !endpoint) return res.status(400).json({ error: 'You messed up.' });
  try {
    const result = await getApi(apiname);
    if (result.key) {
      apiqueries[result.keyParam] = result.key;
    }
    const url = `${result.baseUrl}/${endpoint}?${queryString.stringify(apiqueries)}`;
    const { status, data } = await axios.get(url);
    res.status(status).json(data);
  } catch (err) {
    res.status(500).json({ error: `Error in Get, ${err}` });
  }
});

module.exports = router;
