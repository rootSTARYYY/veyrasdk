# Pure REST API Integration (No SDK)

You don't have to use the official Node.js SDK to use Veyra! Because Veyra is a standard REST API, you can integrate it into **any** language (Python, Go, Rust, Java, etc.) or automate it using simple HTTP requests.

Veyra uses two types of authentication:
1. **JWT Tokens** for Account Management (Users, Projects, Keys)
2. **API Keys** for Telemetry (Logs, Heartbeats, Incidents)

---

## 👤 Part 1: Account Management (JWT)

Before you can send logs, you need an account, a project, and an API key. Here is how to automate the setup process using pure `cURL`.

### 1. Register an Account
Create a new developer account.
```bash
API_URL="[https://api.strixhost.xyz](https://api.strixhost.xyz)"

curl -X POST "$API_URL/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@example.com",
    "password": "supersecure123"
  }'
```

### 2. Login (Get JWT Token)
Log in to receive your Bearer Token. You will use this token for all management routes.
```bash
API_URL="[https://api.strixhost.xyz](https://api.strixhost.xyz)"

curl -X POST "$API_URL/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@example.com",
    "password": "supersecure123"
  }'
# Keep the "token" from the response!
```

### 3. Create a Project
Using your JWT token, create a new monitoring project.
```bash
API_URL="[https://api.strixhost.xyz](https://api.strixhost.xyz)"

curl -X POST "$API_URL/v1/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My Go Backend",
    "environment": "production",
    "heartbeatInterval": 60000
  }'
# Keep the "id" from the response (This is your Project ID)
```

### 4. Generate an API Key
Generate an API Key for your new project. **Save this key! It is only shown once.**
```bash
API_URL="[https://api.strixhost.xyz](https://api.strixhost.xyz)"
PROJECT_ID="YOUR_PROJECT_ID"

curl -X POST "$API_URL/v1/projects/$PROJECT_ID/keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Production API Key"
  }'
```

---

## 📡 Part 2: Telemetry Integration (API Key)

Once you have your API Key from Part 1 (or the dashboard), you can integrate telemetry into your application. **All telemetry routes use the API Key, NOT the JWT.**

### 1. Log an Event (cURL / Bash)
To log a structured event from a shell script or terminal, make a `POST` request to `/v1/events`.

```bash
API_URL="[https://api.strixhost.xyz](https://api.strixhost.xyz)"

curl -X POST "$API_URL/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer veyra_your_api_key_here" \
  -d '{
    "level": "error",
    "message": "Database connection failed",
    "source": "Payment-Service",
    "environment": "production"
  }'
```

### 2. Trigger an Incident (Python)
If your Python backend detects a critical failure, you can trigger a Veyra incident directly. This will automatically fire your Discord Webhook alerts.

```python
import requests

base_url = "[https://api.strixhost.xyz](https://api.strixhost.xyz)"
url = f"{base_url}/v1/incidents"

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

### 3. Send a Heartbeat Ping (Vanilla JavaScript / Fetch API)
If you want to track uptime without installing the SDK package, just send a `POST` request to the heartbeats endpoint on an interval.

```javascript
const HOST = "[https://api.strixhost.xyz](https://api.strixhost.xyz)";
const API_KEY = "veyra_your_api_key_here";
const PROJECT_ID = "your_project_id_here";

// Ping Veyra every 60 seconds
setInterval(async () => {
  try {
    const response = await fetch(`${HOST}/v1/heartbeats/${PROJECT_ID}`, {
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

### 4. Fetch Event Metrics (Go)
If you are building an internal admin panel in Go, you can fetch event statistics easily.

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	baseURL := "[https://api.strixhost.xyz](https://api.strixhost.xyz)"
	url := baseURL + "/v1/events/metrics"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", "Bearer veyra_your_api_key_here")

	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()

	body, _ := ioutil.ReadAll(res.Body)
	fmt.Println(string(body))
}
```
