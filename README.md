# 🎮 Tablero Kanban Gamificado Offline — Buddy Pixel Art (`v1.1.0`)

> **Gestión de flujo de trabajo (Kanban) 100% autocontenida en un único archivo `.html`, sin servidores ni dependencias externas, impulsada por gamificación táctica y un avatar modular en Pixel Art SVG de 5 capas.**

---

## 📋 Descripción del Proyecto

**Tablero Kanban Gamificado Offline** es una aplicación web local diseñada para emprendedores, profesionistas independientes y micro/pequeñas empresas (MiPyMEs) que buscan controlar su flujo operativo sin pagar suscripciones mensuales en dólares ni configurar infraestructuras complejas (Docker, Node.js o bases de datos).

El sistema reside íntegramente en [index.html](file:///home/alex/Documentos/Antigravity_Gamification_Kanban/index.html) ($< 110\text{ KB}$, cero CDNs externas) y funciona directamente sobre el protocolo local `file:///` en cualquier navegador moderno de escritorio o móvil. Cada tarea entregada otorga puntos de experiencia (**XP**) y **Monedas** que alimentan el progreso del usuario y permiten desbloquear accesorios en Pixel Art para su compañero virtual (**Buddy**).

---

## 📦 Historial de Versiones (Releases)

| Versión | Tipo | Descripción |
| :--- | :--- | :--- |
| **`v1.1.0` (Actual — `main`)** | **Producción (Clean Slate)** | Interfaz limpia sin botones de depuración/pruebas (`CR-02`: `RF-17`, `RF-18`) e inicialización completamente en cero (`0 XP`, `Nivel 1`, `0 Monedas`, `0 Racha` y `0 Tareas`) lista para uso inmediato por usuarios finales. Conserva el motor automático de revisión cada 60 minutos en segundo plano y al reabrir el archivo. |
| **`v1.0.0` (Tag anterior)** | **Pruebas / Demo** | Incluye datos semilla de demostración precargados y los botones de diagnóstico en barra superior (`⏱️ Revisión 1h` y `🧪 Verificar (Tests)`). Disponible en los *Releases / Tags* del repositorio (`git checkout v1.0.0`). |

---

## ✨ Funcionalidades Principales

### 1. 🗂️ Tablero Kanban con Control de Flujo (Módulo A + `CR-01` + `CR-02`)
- **4 Columnas de Flujo Oficiales (`RF-01`):**
  1. 📋 **Por Hacer** (`backlog`)
  2. ⚡ **En Proceso** (`in_progress`)
  3. 🔍 **En Revisión** (`review`)
  4. ✅ **Completado** (`done`)
- **Inicio Limpio en Cero (`CR-02` / `RF-17` & `RF-18`):** Al abrir por primera vez la versión de producción (`v1.1.0`), todas las métricas y columnas inician vacías (`0 XP`, `Nivel 1`, `0 Monedas`, `0 Días de Racha` y `0 Tareas`) sin controles de depuración visibles.
- **Gestión Completa de Tareas (`RF-02`):** Identificador único (`tsk_...`), Título (máx. 80 caracteres), Categoría (*Operación*, *Cliente*, *Calidad/Norma*, *Administración*), Prioridad (*Baja*, *Media*, *Alta*, *Urgente*), Esfuerzo (*1 pt Rápida*, *2 pts Media*, *3 pts Compleja*) y Fecha límite (`YYYY-MM-DD`).
- **Interacción Multimodal (`RF-03`):** Movimiento fluido mediante **HTML5 Drag and Drop** nativo y botones laterales accesibles (`◀` y `▶`) para pantallas táctiles y teclado.
- **Límite de Trabajo en Proceso — WIP Limit (`RF-04`):** Límite configurable de tareas simultáneas en *En Proceso* (valor por defecto: `3`) con bloqueo automático y alerta visual cuando se intenta exceder.
- **Revisión Horaria Automática de Tareas en Proceso (`CR-01` / `RF-15` & `RF-16`):**
  - Registra cuánto tiempo lleva cada tarea dentro de *En Proceso* mostrando una insignia en vivo (`⏱️ En proceso: Xh Ym`).
  - Evalúa automáticamente cada **60 minutos** (tanto con la pestaña abierta como al reabrir el archivo `.html` leyendo `localStorage`) las tareas estacionadas en *En Proceso* y despliega una notificación visual interactiva dentro de la aplicación.

---

### 2. 🏆 Motor de Gamificación Táctica (Módulo B)
- **Cálculo de Recompensas al Completar (`RF-05`):**
  - **Base por Esfuerzo:** $\text{XP}_{\text{Base}} = \text{PuntosDeEsfuerzo} \times 10$ | $\text{Monedas}_{\text{Base}} = \text{PuntosDeEsfuerzo} \times 5$
  - **Bono de Puntualidad** ($\text{FechaActual} \le \text{Deadline}$): $+15\text{ XP}$ y $+10\text{ Monedas}$
  - **Bono por Prioridad:** `Urgente` ($+20\text{ XP}$), `Alta` ($+10\text{ XP}$), `Media` ($+5\text{ XP}$), `Baja` ($0\text{ XP}$)
- **Curva Exponencial de Niveles (`RF-06`):**
  $$\text{XP}_{\text{RequeridaParaNivel } N} = \text{round}(100 \times N^{1.2})$$
- **Control de Rachas Diarias (`RF-07`):** Incrementa en $+1$ por cada día natural consecutivo completando tareas y se reinicia automáticamente a `0` si transcurren más de **48 horas** de inactividad.

---

### 3. 🎨 Avatar Modular "Buddy" en Pixel Art SVG y Tienda (Módulo C)
- **Renderizado Multicapa SVG (`RF-08`):** Lienzo cuadrangular `16x16` con `shape-rendering="crispEdges"` compuesto por **5 capas superpuestas** en orden de profundidad (`z-index`):
  - **Capa 0 (`base`):** Anatomía fija 16x16 (`base_dev`).
  - **Capa 1 (`body`):** Sprites de torso y ropa (*Hoodie Dev*, *Traje Ejecutivo*, *Chaqueta Cyber*, *Armadura Ágil*).
  - **Capa 2 (`head`):** Accesorios de cabeza (*Audífonos Lo-Fi*, *Gorra Pixel*, *Visor Láser*, *Corona Kanban*).
  - **Capa 3 (`hand`):** Objetos de mano (*Taza de Café Espresso*, *Laptop Ultraligera*, *Elixir de Enfoque*).
  - **Capa 4 (`aura`):** Efectos periféricos (*Destellos Dorados*, *Llama de Productividad*, *Halo Binario*).
- **Catálogo Modal de 15 Sprites (`RF-09`):** Clasificados dinámicamente en *Desbloqueado / Equipado*, *Disponible para compra* (validando monedas y nivel mínimo requerido) y *Bloqueado por logro*.
- **Micro-reacciones en Tiempo Real (`RF-10`):**
  - Animación de salto (`bounce`) al mover una tarea a *Completado*.
  - Activación automática de estado y sprite de **estrés** cuando existen tareas vencidas en la columna *En Proceso*.

---

### 4. 💾 Persistencia Local, Portabilidad JSON y Reportes CSV (Módulo D)
- **Almacenamiento Síncrono (`RF-11`):** Persistencia automática en `localStorage` bajo la clave única `kanban_gamified_v1`.
- **Exportación e Importación Segura JSON (`RF-12`, `RF-13`):** Descarga de respaldos completos (`kanban_backup_YYYY-MM-DD.json`) y restauración con validación estricta de esquema para impedir estados corruptos.
- **Exportación de Métricas CSV (`RF-14`):** Generación de reporte tabular `.csv` con columnas `ID,Título,Categoría,Prioridad,Fecha_Terminación,XP_Generado`.

---

## 🚀 Cómo Empezar (Sin Instalación)

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/alexlv4/KanbanGamification.git
   ```
2. Abre directamente el archivo **`index.html`** con doble clic en cualquier navegador (Chrome, Edge, Firefox, Brave o Safari). ¡No requiere servidor web ni conexión a internet!

> 💡 **¿Ya probaste la versión anterior y quieres reiniciar tu navegador en cero?**  
> Si abriste una versión previa en el mismo navegador, tu `localStorage` conserva tus datos anteriores. Para limpiar la caché local del navegador, abre la consola del navegador (`F12`) y ejecuta `localStorage.removeItem('kanban_gamified_v1'); location.reload();`.

---

## 🧪 Ejecución de Pruebas Automatizadas (AI-DLC TDD)

Para ejecutar la suite completa de pruebas unitarias y de integración (`RF-01` a `RF-18` y `RNF-01` a `RNF-04`) desde la terminal:
```bash
node --test tests/kanban_gamified.test.js
```
*(Si deseas usar la versión con botones interactivos de prueba en pantalla, puedes consultar el release anterior `git checkout v1.0.0`).*

---

## 🏛️ Gobernanza y Arquitectura AI-DLC (`aidlc-docs/`)

El repositorio mantiene trazabilidad completa bajo la metodología **AI-DLC (AI-Driven Software Development Life Cycle)**:

```text
aidlc-docs/
├── prompts.md                                          # Bitácora secuencial de todos los prompts del usuario
├── requirements/
│   ├── inception_tablero_kanban_gamificado.md          # PRFAQ y Matriz Maestra RF-01..RF-14 / RNF-01..RNF-04
│   ├── CR-01_revision_horaria_en_proceso.md            # Change Request CR-01 (RF-15 y RF-16)
│   └── CR-02_version_produccion_en_cero.md             # Change Request CR-02 (RF-17 y RF-18: Producción en cero)
├── story-artifacts/
│   └── user_stories.md                                 # Historias de Usuario US-01 a US-07 con criterios Gherkin
├── plans/
│   ├── bolt_01_master_plan.md                          # Plan Maestro Bolt 1 (100% completado)
│   ├── bolt_02_cr01_hourly_review_plan.md              # Plan de Construcción Bolt 2 - CR-01 (100% completado)
│   └── bolt_03_cr02_production_clean_slate_plan.md     # Plan de Construcción Bolt 3 - CR-02 (100% completado)
└── design-artifacts/
    └── architecture_and_data_model.md                  # Diagramas C4/Mermaid, DDD Bounded Contexts y JSON Schema
```

