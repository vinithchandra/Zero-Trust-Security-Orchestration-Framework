const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;

// MongoDB connection URI (adjust as needed)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'zero_trust';
const FALCO_COLLECTION = 'falco_alerts';

let db, falcoCollection;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    falcoCollection = db.collection(FALCO_COLLECTION);
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// In-memory store for Falco alerts (replaced with MongoDB)
// let falcoAlerts = [];

// Webhook endpoint for Falco to POST alerts
app.post('/api/falco-webhook', async (req, res) => {
  try {
    const alert = { ...req.body, time: new Date().toISOString() };
    if (falcoCollection) {
      await falcoCollection.insertOne(alert);
    }
    res.status(200).send({ status: 'received' });
  } catch (err) {
    res.status(500).send({ error: 'Failed to store alert', details: err.message });
  }
});

// Endpoint to retrieve Falco alerts (latest 100)
app.get('/api/falco-alerts', async (req, res) => {
  try {
    if (falcoCollection) {
      const alerts = await falcoCollection.find().sort({ time: -1 }).limit(100).toArray();
      res.json(alerts);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch alerts', details: err.message });
  }
});

// Example: Proxy OPA/Gatekeeper metrics
app.get('/api/opa-metrics', async (req, res) => {
  try {
    // Replace this URL with your Gatekeeper metrics endpoint (usually inside your cluster)
    const metricsResp = await axios.get('http://localhost:8888/metrics');
    res.send(metricsResp.data);
  } catch (err) {
    res.status(500).send({ error: 'OPA metrics not available', details: err.message });
  }
});

// Example: Proxy Vault health
app.get('/api/vault-health', async (req, res) => {
  try {
    // Replace with your Vault API endpoint
    const vaultResp = await axios.get('http://localhost:8200/v1/sys/health');
    res.send(vaultResp.data);
  } catch (err) {
    res.status(500).send({ error: 'Vault health not available', details: err.message });
  }
});

// Example: Get pods from Kubernetes cluster (requires kubeconfig and proper env)
app.get('/api/k8s/pods', async (req, res) => {
  try {
    const k8s = require('@kubernetes/client-node');
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    const pods = await k8sApi.listPodForAllNamespaces();
    res.json(pods.body);
  } catch (err) {
    res.status(500).send({ error: 'Kubernetes API error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Zero-Trust backend API running on port ${PORT}`);
});
