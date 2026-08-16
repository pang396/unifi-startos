<p align="center">
  <img src="icon.svg" alt="UniFi Network Application Logo" width="21%">
</p>

# UniFi Network Application on StartOS

> **Upstream repo:** <https://github.com/jacobalberty/unifi-docker>

The UniFi Network Application is Ubiquiti's controller software for managing UniFi network devices — access points, switches, and gateways. This package runs the full controller including an embedded MongoDB database.

## Getting Started

1. Install and start the package from the StartOS services page
2. Wait for the health check to show **"The web interface is ready"** — this can take 2-3 minutes on first boot while the database initializes
3. Click **Open UI** — your browser will show a certificate warning because UniFi uses a self-signed certificate; click through to proceed
4. Complete the UniFi setup wizard to create your admin account and configure your network

### Restoring from an existing UniFi controller

If you are migrating from an existing UniFi controller:

1. On your old controller, go to **Settings → System → Backups** and export a `.unf` backup file
2. Complete the UniFi setup wizard on StartOS until you reach the dashboard
3. Go to **Settings → System → Backups → Restore** and import your `.unf` file
4. Your devices, configuration, and history will be restored

### Adopting UniFi devices

After setup, point your UniFi devices at the new controller by SSH-ing into each device and running:

```bash
set-inform http://<startos-ip>:8080/inform
```

The device will appear in your controller under **Devices** as "Pending Adoption" — click Adopt to complete the process.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Known Issues](#limitations-and-known-issues)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                              |
| ------------- | ---------------------------------- |
| Image         | `jacobalberty/unifi:v10.0.162`     |
| Architectures | x86_64                             |
| Command       | `docker-entrypoint.sh unifi`       |
| Run as        | root (UID 0), manages unifi (999)  |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose                              |
| ------ | ----------- | ------------------------------------ |
| `main` | `/unifi`    | All persistent data, logs, and runtime files |

Internal layout of `/unifi`:

| Path          | Purpose                        |
| ------------- | ------------------------------ |
| `/unifi/data` | Database and configuration     |
| `/unifi/log`  | Application and MongoDB logs   |
| `/unifi/run`  | Runtime files and PID files    |

---

## Installation and First-Run Flow

1. Package starts and creates `/unifi/run` (required by MongoDB)
2. MongoDB initializes and starts on port 27117
3. UniFi Network Application starts on ports 8080 and 8443
4. Health check confirms port 8443 is listening
5. Setup wizard is presented on first visit

---

## Network Access and Interfaces

| Interface      | Internal Port | Protocol | Purpose                              |
| -------------- | ------------- | -------- | ------------------------------------ |
| Web UI         | 8443          | HTTPS    | UniFi management console             |
| Device Inform  | 8080          | HTTP     | UniFi device adoption and heartbeat  |
| STUN           | 3478          | UDP      | STUN service for UniFi devices       |
| Discovery      | 10001         | UDP      | Layer 2 device discovery             |

**Note on the Web UI:** The browser will show a certificate warning because UniFi uses a self-signed certificate and StartOS proxies it via TLS passthrough on beta.9. This is expected behavior — click through to proceed. This warning will be eliminated in a future update when StartOS beta.10 and SDK 2.0 are released.

---

## Health Checks

| Check         | Method               | Messages                                                                          |
| ------------- | -------------------- | --------------------------------------------------------------------------------- |
| Web Interface | Port listening (8443) | Success: "The web interface is ready" / Error: "The web interface is not ready" |

---

## Backups and Restore

**Included in StartOS backup:**
- `main` volume (all UniFi data, configuration, and database)

**Restore behavior:** Volume is fully restored before the service starts.

**Manual UniFi backup/restore:**
UniFi also has its own built-in backup system under Settings → System → Backups. This is useful for migrating from an existing UniFi controller running on different hardware.

---

## Limitations and Known Issues

1. **Certificate warning** — The browser shows a self-signed certificate warning when opening the UI. Click through to proceed. This is a known limitation on StartOS 0.4.0-beta.9 and will be resolved in a future update.
2. **x86_64 only** — This package currently only supports x86_64 architecture. aarch64 support may be added in a future release.
3. **No Protect, Access, Talk, or other UniFi OS apps** — Only the UniFi Network Application is included. Other UniFi applications require dedicated Ubiquiti hardware.

---

## What Is Unchanged from Upstream

The UniFi Network Application runs unmodified from the `jacobalberty/unifi:v10.0.162` Docker image. The only additions are:

- Creation of `/unifi/run` directory before launch (required by MongoDB, not created by the upstream entrypoint)

---

## Quick Reference for AI Consumers

```yaml
package_id: unifi-network-application
image: jacobalberty/unifi:v10.0.162
architectures: [x86_64]
volumes:
  main: /unifi
ports:
  ui: 8443 (HTTPS, TLS passthrough)
  device_inform: 8080 (HTTP)
  stun: 3478 (UDP)
  discovery: 10001 (UDP)
dependencies: none
startup_quirk: mkdir -p /unifi/run required before entrypoint
health_check: port 8443 listening
certificate_warning: expected on beta.9, resolved in beta.10
```
