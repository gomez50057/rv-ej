# Solución rápida

## 1. Si aparece “Port 3000 is in use”

No pasa nada. Esta versión usa el puerto 3001 para móvil.

```bash
npm run dev:network
```

Abre en PC:

```txt
http://localhost:3001/recorrido-vr
```

Abre en móvil usando la IP LAN de la PC:

```txt
http://IP-DE-TU-PC:3001/recorrido-vr
```

## 2. Si se queda en “Compiling /recorrido-vr”

Ejecuta:

```bash
npm run clean
npm run dev:network
```

Esta versión usa `next dev --webpack` para evitar problemas con Turbopack en esta demo VR.

## 3. IP correcta en Windows

En PowerShell:

```powershell
ipconfig
```

Busca la IP de tu Wi-Fi o Ethernet, normalmente algo como `192.168.1.xx`.

No uses `172.30.x.x` para el celular; normalmente es WSL/Docker/adaptador virtual.
