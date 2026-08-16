# UniFi Network Application

The UniFi Network Application is Ubiquiti's controller software for managing UniFi network devices — access points, switches, and gateways.

## Getting Started

1. Install and start the package
2. Wait for the health check to show **"The web interface is ready"** — this can take 2-3 minutes on first boot while the database initializes
3. Click **Open UI** — your browser will show a certificate warning because UniFi uses a self-signed certificate; click through to proceed
4. Complete the UniFi setup wizard to create your admin account

## Certificate Warning

The browser will show a certificate warning when opening the UI. This is expected — UniFi uses a self-signed certificate. Click through to proceed. This will be resolved in a future update.

## Migrating from an existing UniFi controller

### Step 1 — Back up your old controller

On your old controller go to **Settings → System → Backups** and export a `.unf` backup file. Save it somewhere accessible.

### Step 2 — Enable SSH on your devices before migrating

Before shutting down your old controller, make sure SSH is enabled on your devices. In your old controller go to **Settings → System → Advanced → Device SSH Authentication**, enable it, and note your SSH username and password. You will need these after migration to redirect your devices to the new controller.

### Step 3 — Complete the setup wizard

Open the UniFi UI on StartOS and complete the setup wizard to create your admin account.

### Step 4 — Restore your backup

Go to **Settings → System → Backups → Restore** and import your `.unf` file. Your devices, configuration, and history will be restored.

### Step 5 — Redirect your devices to the new controller

Your devices will still be pointing at your old controller's IP address — they don't automatically know about the new one. You need to SSH into each device and tell it to look for the controller at the new address.

First, find each device's IP address from your router's DHCP client list. Then SSH into each one from a terminal:

```bash
ssh ubnt@<device-ip>
```

Default credentials are `ubnt` / `ubnt` for factory reset devices. If your devices were already adopted by your old controller, use the SSH credentials you noted in Step 2.

Once logged in, run:

```bash
set-inform http://<startos-ip>:8080/inform
```

Replace `<startos-ip>` with your StartOS server's local IP address. The device will appear in your new controller under **Devices** as "Pending Adoption" — click Adopt to complete the process. Repeat for each device.

## Fresh device adoption

If you are adding a new factory-reset device rather than migrating:

1. Connect the device to your network
2. Find its IP address from your router's DHCP client list
3. SSH into it:

```bash
ssh ubnt@<device-ip>
```

4. Run:

```bash
set-inform http://<startos-ip>:8080/inform
```

5. The device will appear under **Devices** as "Pending Adoption" — click Adopt

## Keeping UniFi up to date

This package uses the `jacobalberty/unifi` Docker image. When Ubiquiti releases a new version of UniFi, Jacob typically updates his image within a few days. You will not be notified automatically — you need to watch for updates yourself.

To get notified when a new version is available, watch the release page at https://github.com/jacobalberty/unifi-docker on GitHub (Watch → Custom → Releases).

When a new version is released:

1. Check the release notes at https://github.com/jacobalberty/unifi-docker/releases to see what changed
2. Update the package by changing the Docker image version in `startos/manifest/index.ts` to the new tag:

	On the Ubuntu VM, edit `startos/manifest/index.ts` and update this line:

	       source: { dockerTag: 'jacobalberty/unifi:v10.0.162' },

	   Replace `v10.0.162` with the new version number, for example:

	       source: { dockerTag: 'jacobalberty/unifi:v10.0.163' },

3. Rebuild the package with 'cd ~/unifi-startos && make x86_64'
4. Copy to your host machine (run this on the host, not the Ubuntu VM):

       scp user@192.168.122.130:~/unifi-startos/unifi-network-application_x86_64.s9pk ~/Downloads/

5. Sideload the new `.s9pk` via the StartOS web UI

## Documentation

- [jacobalberty/unifi-docker](https://github.com/jacobalberty/unifi-docker) — the Docker image this package uses
- [Ubiquiti UniFi](https://www.ui.com/consoles) — official UniFi documentation
