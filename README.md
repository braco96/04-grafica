# Grafica en tiempo real (Angular + Socket.IO)

Aplicación **Angular** que muestra una **gráfica de líneas** (ng2-charts/Chart.js) y se **actualiza en tiempo real** mediante **Socket.IO** conectándose a un backend (por defecto `http://localhost:5000`).

> El backend esperado expone `GET /grafica` (estado inicial) y emite el evento de socket `cambio-grafica` con el nuevo dataset. También puede aceptar `POST /grafica` para incrementar valores por mes.

---

## 📁 Estructura relevante

```
src/
├─ app/
│  ├─ app.module.ts               # Configura SocketIoModule y ChartsModule
│  ├─ services/websocket.service.ts  # Wrapper sobre ngx-socket-io
│  └─ components/grafica/
│     ├─ grafica.component.ts     # Carga datos vía HTTP y escucha sockets
│     ├─ grafica.component.html   # Canvas de la gráfica (ng2-charts)
│     └─ grafica.component.css
├─ index.html                      # Bootstrap 4 (CDN) y root <app-root>
├─ polyfills.ts
└─ styles.css
```

---

## 🚀 Requisitos

- **Node.js** 10+ (recomendado 14 LTS o 16 LTS)
- **Angular CLI** (global):  
  ```bash
  npm i -g @angular/cli
  ```
- Backend Socket.IO ejecutándose en `http://localhost:5000`
  - Rutas esperadas:
    - `GET /grafica` → `[{ data: number[], label: string }]`
    - `POST /grafica` con body `{ mes: string, unidades: number }`
    - Evento de socket: `cambio-grafica` → mismo payload del `GET /grafica`

---

## 📦 Instalación

Dentro del proyecto Angular (donde está `package.json`):

```bash
npm install
```

> Si **ng2-charts** o **chart.js** no estuvieran instalados (o hay problemas de compatibilidad con versiones modernas), instala las versiones compatibles con Angular antiguo:
```bash
npm i ng2-charts@2.4.2 chart.js@2.9.4 ngx-socket-io
```
> **Por qué estas versiones**: el código usa la API de `ng2-charts` clásica (Chart.js v2). En Angular 12+ suele usarse `ng2-charts` v13+ con Chart.js v3, cuya API es diferente.

---

## 🛠️ Configuración

### URL del backend de sockets
En `app/app.module.ts` verás:

```ts
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
```

- Cambia `url` si tu servidor corre en otro host/puerto.
- Asegúrate de que el backend habilite **CORS** correctamente para el origen de tu app Angular.

---

## ▶️ Ejecutar en desarrollo

1. Arranca el **backend** (Node/Socket.IO) en `http://localhost:5000`.
2. Arranca Angular:
   ```bash
   ng serve -o
   ```
3. Abre `http://localhost:4200` si no se abre automáticamente.

Deberías ver la **gráfica** y, cuando el backend emita `cambio-grafica`, los datos se actualizarán en tiempo real.

---

## 🔌 Endpoints y eventos utilizados

- **HTTP (estado inicial):**
  - `GET http://localhost:5000/grafica` → devuelve algo como:
    ```json
    [
      { "data": [0,0,0,0], "label": "Ventas" }
    ]
    ```

- **Socket.IO (tiempo real):**
  - Evento **`cambio-grafica`** con payload igual al `GET /grafica`.

- **Endpoint auxiliar (si tu backend lo implementa):**
  - `POST http://localhost:5000/grafica`
    ```json
    { "mes": "enero", "unidades": 5 }
    ```
    Actualiza el dataset y notifica por socket.

---

## 🧪 Probar las actualizaciones de la gráfica (opcional)

Con el backend corriendo, puedes **simular actualizaciones** desde otra terminal:

```bash
# Enero +5
curl -X POST http://localhost:5000/grafica \
  -H "Content-Type: application/json" \
  -d '{"mes":"enero","unidades":5}'

# Marzo +12
curl -X POST http://localhost:5000/grafica \
  -H "Content-Type: application/json" \
  -d '{"mes":"marzo","unidades":12}'
```

La gráfica en Angular debería **moverse al instante** gracias al evento `cambio-grafica`.

---

## ❗ Troubleshooting

- **La gráfica no se ve o aparece vacía:**
  - Verifica la consola del navegador por errores de Chart.js.
  - Asegúrate de usar `ng2-charts@2.4.2` junto a `chart.js@2.9.4` si tu proyecto es Angular antiguo.

- **No conecta por Socket.IO:**
  - Confirma que el backend está en **`http://localhost:5000`** o ajusta `SocketIoConfig`.
  - Revisa CORS del backend.
  - Comprueba que no haya conflictos de puerto o firewall.

- **Error de tipos TS o versión Angular/CLI:**
  - Reinstala dependencias y limpia cache:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```
  - Actualiza Angular CLI si es necesario:
    ```bash
    npm i -g @angular/cli
    ```

---

## 🧱 Detalles del componente

- **`GraficaComponent`**:
  - `ngOnInit` → `getData()` (HTTP inicial) y `escucharSocket()`.
  - `getData()` hace `GET /grafica` y asigna el resultado a `lineChartData`.
  - `escucharSocket()` se suscribe a `cambio-grafica` y actualiza la serie.

- **`WebsocketService`** (ngx-socket-io):
  - `emit(evento, payload?)` para enviar eventos.
  - `listen(evento)` devuelve un `Observable` con los datos del evento.
  - `socketStatus` indica conexión/desconexión.

---

## 📄 Licencia

Uso educativo / libre. Ajusta según tus necesidades.
