import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [opaMetrics, setOpaMetrics] = useState('');
  const [falcoAlerts, setFalcoAlerts] = useState([]);
  const [vaultHealth, setVaultHealth] = useState(null);
  const [pods, setPods] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/opa-metrics')
      .then(res => setOpaMetrics(res.data))
      .catch(() => setOpaMetrics('Unavailable'));
    axios.get('http://localhost:4000/api/falco-alerts')
      .then(res => setFalcoAlerts(res.data))
      .catch(() => setFalcoAlerts([]));
    axios.get('http://localhost:4000/api/vault-health')
      .then(res => setVaultHealth(res.data))
      .catch(() => setVaultHealth(null));
    axios.get('http://localhost:4000/api/k8s/pods')
      .then(res => setPods(res.data.items || []))
      .catch(() => setPods([]));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Zero-Trust Security Dashboard</h1>
        <section>
          <h2>OPA/Gatekeeper Metrics</h2>
          <pre style={{textAlign:'left', background:'#222', color:'#0f0', padding:'1em', maxHeight:'200px', overflow:'auto'}}>{opaMetrics ? opaMetrics : 'Loading...'}</pre>
        </section>
        <section>
          <h2>Falco Alerts</h2>
          {falcoAlerts.length === 0 ? <p>No alerts</p> : (
            <ul>
              {falcoAlerts.map((alert, idx) => (
                <li key={idx} style={{textAlign:'left'}}>
                  <strong>{alert.priority || alert.output_fields?.priority || 'Alert'}:</strong> {alert.rule || alert.output_fields?.rule || 'Unknown'} - {alert.output || JSON.stringify(alert)} <em>({alert.time})</em>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2>Vault Health</h2>
          <pre style={{textAlign:'left', background:'#222', color:'#fff', padding:'1em', maxHeight:'150px', overflow:'auto'}}>{vaultHealth ? JSON.stringify(vaultHealth, null, 2) : 'Loading...'}</pre>
        </section>
        <section>
          <h2>Kubernetes Pods</h2>
          {pods.length === 0 ? <p>No pods found</p> : (
            <table style={{background:'#fff', color:'#222', margin:'0 auto', minWidth:'400px'}}>
              <thead>
                <tr>
                  <th>Namespace</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Node</th>
                </tr>
              </thead>
              <tbody>
                {pods.map((pod, idx) => (
                  <tr key={idx}>
                    <td>{pod.metadata.namespace}</td>
                    <td>{pod.metadata.name}</td>
                    <td>{pod.status.phase}</td>
                    <td>{pod.spec.nodeName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </header>
    </div>
  );
}

export default App;
