# Pure REST API Integration (No SDK)

You don't have to use the official Node.js SDK to use Veyra! Because Veyra is a standard REST API, you can integrate it into **any** language (Python, Go, Rust, Java, etc.) using simple HTTP requests.

Here are examples of how to interact with the Veyra Telemetry API using pure HTTP clients.

## 🔐 Authentication
All telemetry endpoints require your Project's API Key to be passed in the headers:
`Authorization: Bearer veyra_your_api_key_here`

---

## 1. Log an Event (cURL / Bash)
To log a structured event from a shell script or terminal, make a `POST` request to `/v1/events`.

```bash
curl -X POST [https://api.strixhost.xyz/v1/events](https://api.strixhost.xyz/v1/events) \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer veyra_your_api_key_here" \
  -d '{
    "level": "error",
    "message": "Database connection failed",
    "source": "Payment-Service",
    "environment": "production"
  }'
```

---

## 2. Trigger an Incident (Python)
If your Python backend detects a critical failure, you can trigger a Veyra incident directly. This will automatically fire your Discord Webhook alerts.

```python
import requests

url = "[https://api.strixhost.xyz/v1/incidents](https://api.strixhost.xyz/v1/incidents)"
headers = {
    "Authorization": "Bearer veyra_your_api_key_here",
    "Content-Type": "application/json"
}
data = {
    "type": "database_failure",
    "summary": "Main PostgreSQL cluster stopped responding"
}

response = requests.post(url, json=data, headers=headers)

if response.status_code == 200:
    print("Incident created:", response.json())
else:
    print("Failed to create incident:", response.text)
```

---

## 3. Send a Heartbeat Ping (Vanilla JavaScript / Fetch API)
If you want to track uptime without installing the SDK package, just send a `POST` request to the heartbeats endpoint on an interval.

```javascript
const VEYRA_URL = "[https://api.strixhost.xyz/v1](https://api.strixhost.xyz/v1)";
const API_KEY = "veyra_your_api_key_here";
const PROJECT_ID = "your_project_id_here";

// Ping Veyra every 60 seconds
setInterval(async () => {
  try {
    const response = await fetch(`${VEYRA_URL}/heartbeats/${PROJECT_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    console.log("Heartbeat sent successfully.");
    
  } catch (error) {
    console.error("Failed to ping Veyra:", error.message);
  }
}, 60 * 1000);
```

---

## 4. Fetch Event Metrics (Go)
If you are building an internal admin panel in Go, you can fetch event statistics easily.

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	url := "[https://api.strixhost.xyz/v1/events/metrics](https://api.strixhost.xyz/v1/events/metrics)"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", "Bearer veyra_your_api_key_here")

	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()

	body, _ := ioutil.ReadAll(res.Body)
	fmt.Println(string(body))
}
```
