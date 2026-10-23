# Plan Maestro de Construcción — Bolt 1 (AI-DLC)

- **ID del Artefacto:** `PLAN-BOLT-01`
- **Proyecto:** Tablero Kanban Gamificado Offline con Sistema de Avatar Modular en Pixel Art
- **Entregable Principal:** Archivo único autocontenido `index.html` (`<= 150 KB`, cero dependencias externas) + Suite de Pruebas Automatizadas (`tests/domain.test.js` + Runner integrado en navegador).
- **Estado:** Completado y Verificado (100% de Pruebas Automatizadas en Verde)

---

## Fase 0: Incepción, Gobernanza y Diseño Arquitectónico (`aidlc-docs/`)
- [x] **T0.1:** Crear bitácora viva de prompts en `aidlc-docs/prompts.md`.
- [x] **T0.2:** Elaborar Documento de Incepción (PRFAQ) y Matriz Maestra RF/RNF en `aidlc-docs/requirements/inception_tablero_kanban_gamificado.md`.
- [x] **T0.3:** Redactar Historias de Usuario (`US-01` a `US-05`) con criterios Gherkin en `aidlc-docs/story-artifacts/user_stories.md`.
- [x] **T0.4:** Diseñar Diagramas C4/Mermaid, Bounded Contexts DDD, catálogo de 15 sprites SVG y contrato JSON Schema v1.0.0 en `aidlc-docs/design-artifacts/architecture_and_data_model.md`.
- [x] **T0.5:** Formular el Plan Maestro de Construcción en `aidlc-docs/plans/bolt_01_master_plan.md` y solicitar confirmación humana.

---

## Fase 1: Capa de Dominio y Contratos DDD (Funciones Puras ES6+)
- [x] **T1.1 — `KanbanContext` (RF-01 a RF-04):**
  - Implementar validación de creación/edición de tareas (`id` UUID/`tsk_`, `title <= 80 chars`, `category`, `priority`, `effort 1..3`, `deadline YYYY-MM-DD`).
  - Implementar máquina de transición entre las 4 columnas (`backlog`, `in_progress`, `review`, `done`).
  - Implementar validador de restricción de flujo (`wipLimit`, por defecto `3`) para la columna `in_progress` con emisión de estado de alerta visual de bloqueo.
- [x] **T1.2 — `GamificationContext` (RF-05 a RF-07):**
  - Implementar fórmula exacta de cálculo de recompensas al completar tarea:
    - $\text{XP}_{\text{Base}} = \text{effort} \times 10$, $\text{Monedas}_{\text{Base}} = \text{effort} \times 5$.
    - Bono de puntualidad ($\text{FechaActual} \le \text{Deadline}$): $+15\text{ XP}$ y $+10\text{ Monedas}$.
    - Bono por prioridad: `Urgente` ($+20\text{ XP}$), `Alta` ($+10\text{ XP}$), `Media` ($+5\text{ XP}$), `Baja` ($0\text{ XP}$).
  - Implementar curva de niveles $\text{XP}_{\text{RequeridaParaNivel } N} = 100 \times N^{1.2}$.
  - Implementar motor de rachas diarias (`streakDays`) con incremento en días naturales consecutivos y reinicio a `0` tras más de 48 horas sin cerrar tareas.
- [x] **T1.3 — `BuddyContext` (RF-08 a RF-10):**
  - Diseñar e codificar los **15 sprites modulares en Pixel Art SVG 16x16** con primitivas `<rect>` y `shape-rendering: crispEdges` distribuidos en las 5 capas (`base`, `body`, `head`, `hand`, `aura`).
  - Implementar lógica de catálogo modal (clasificación en *Desbloqueado/Equipado*, *Disponible para compra* validando monedas y nivel mínimo, y *Bloqueado por logro*).
  - Implementar detector de estrés (tareas vencidas en `in_progress`) y disparador de animación `bounce` al mover una tarea a `done`.
- [x] **T1.4 — `PersistenceContext` (RF-11 a RF-14):**
  - Implementar sincronización síncrona en `localStorage` bajo la clave única `kanban_gamified_v1`.
  - Implementar validador estricto de esquema JSON (previene inyección de estados corruptos al importar).
  - Implementar generador de respaldo `kanban_backup_YYYY-MM-DD.json` y exportador tabular `.csv` con columnas exactas `ID,Título,Categoría,Prioridad,Fecha_Terminación,XP_Generado`.

---

## Fase 2: Arquitectura MVI / Store Unidireccional e Interfaz de Usuario (`index.html`)
- [x] **T2.1 — Maquetación HTML5 Semántica y Diseño CSS3 Modo Oscuro (RNF-01, RNF-04):**
  - Construir estructura con `<header>`, `<main>`, `<section>`, `<article>` y diálogos nativos `<dialog>` (Nueva/Editar Tarea, Tienda/Armario Buddy, Respaldo/Importación y Panel de Diagnóstico/Tests).
  - Aplicar paleta en modo oscuro de baja fatiga visual con contraste verificado **WCAG AA ($\ge 4.5:1$)**, CSS Grid/Flexbox responsivo y escalado pixel art nítido.
- [x] **T2.2 — Interacción Multimodal (RF-03, RF-04, RF-10):**
  - Conectar eventos HTML5 Drag and Drop nativos en tarjetas y columnas con feedback visual de zona activa y alerta de bloqueo WIP.
  - Conectar controles táctiles y de teclado (`◀` y `▶`) en cada tarjeta para accesibilidad universal.
  - Integrar micro-reacciones del Buddy (`bounce` al completar tarea y sprite de sudor/estrés en tiempo real cuando una tarea en `En Proceso` está vencida).

---

## Fase 3: Suite de Pruebas Automatizadas (TDD & Cero Regresión — Principio 3 AI-DLC)
- [x] **T3.1 — Suite Automatizada Unitaria y de Integración (`tests/kanban_gamified.test.js`):**
  - Pruebas exhaustivas de los 14 Requerimientos Funcionales (`RF-01` a `RF-14`) y los 4 Requerimientos No Funcionales (`RNF-01` a `RNF-04`: verificación de cero CDNs, peso `< 150 KB`, tiempo de carga `< 100 ms`).
  - Pruebas de la Matriz de Trazabilidad del SRS (Sección 6):
    1. *Prueba de aislamiento offline*.
    2. *Prueba de idempotencia de persistencia*.
    3. *Prueba de portabilidad e integridad de esquema JSON*.
- [x] **T3.2 — Runner de Pruebas Integrado en el Navegador:**
  - Incluir verificador autoejecutable accesible desde la propia interfaz para validar el 100% de las reglas sin herramientas externas.
