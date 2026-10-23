# Plan de Construcción — Bolt 2 (CR-01: Revisión Horaria de Tareas en Proceso)

- **ID del Artefacto:** `PLAN-BOLT-02`
- **Change Request Vinculado:** `CR-01` (`RF-15`, `RF-16`, `US-06`)
- **Estado:** Completado y Verificado (100% de Pruebas Automatizadas en Verde)

---

## Fase 0: Gobernanza y Especificación de `CR-01` (`aidlc-docs/`)
- [x] **T0.1:** Registrar Prompt #05 y respuestas de clarificación en `aidlc-docs/prompts.md`.
- [x] **T0.2:** Crear documento de requerimiento `aidlc-docs/requirements/CR-01_revision_horaria_en_proceso.md` (`RF-15`, `RF-16`).
- [x] **T0.3:** Agregar Historia de Usuario `US-06` con escenarios Gherkin en `aidlc-docs/story-artifacts/user_stories.md`.
- [x] **T0.4:** Documentar diagrama de secuencia y contratos de dominio en `aidlc-docs/design-artifacts/architecture_and_data_model.md`.
- [x] **T0.5:** Formular el Plan de Construcción del Bolt 2 en `aidlc-docs/plans/bolt_02_cr01_hourly_review_plan.md`.

---

## Fase 1: Extensión de Capa de Dominio y Store MVI (`index.html`)
- [x] **T1.1 — Sello de Tiempo `inProgressSince` en Transiciones de Tarea (`RF-15`):**
  - Al mover una tarea a `in_progress` (o cargar una tarea ya existente en `in_progress`), registrar `inProgressSince` con la fecha/hora ISO.
  - Al mover una tarea fuera de `in_progress` (`backlog`, `review`, `done`), limpiar `inProgressSince = null`.
- [x] **T1.2 — Motor de Revisión Horaria en `KanbanContext` (`RF-15`):**
  - Implementar `formatElapsedDuration(sinceISO, nowISO)` para formatear el tiempo transcurrido (`Xh Ym` / `Ym`).
  - Implementar `evaluateHourlyInProgressReview(state, nowISO, options)` que verifica si han pasado $\ge 60\text{ minutos}$ (`3,600,000 ms`) desde `settings.lastHourlyCheckAt`.
- [x] **T1.3 — Acción `RUN_HOURLY_CHECK` y Persistencia al Reabrir (`RF-15`):**
  - Soportar la acción `RUN_HOURLY_CHECK` en `AppStore`, actualizando `settings.lastHourlyCheckAt` en `localStorage` (`kanban_gamified_v1`).
  - Evaluar automáticamente al cargar/reabrir el archivo `.html` si ya transcurrió $\ge 1\text{ hora}$ desde la última revisión guardada en `localStorage`, además de iniciar el temporizador periódico en segundo plano.

---

## Fase 2: Notificación Visual In-App e Insignia en Tarjetas (`RF-16`)
- [x] **T2.1 — Insignia de Tiempo en Tarjetas de `En Proceso`:**
  - Mostrar en cada tarjeta ubicada en `En Proceso` una insignia dedicada (`⏱️ En proceso: Xh Ym`) y resaltado visual cuando ha sido marcada por la revisión horaria.
- [x] **T2.2 — Panel/Toast Interactivo de Revisión Horaria:**
  - Mostrar un banner/toast visual en la aplicación cuando se dispare la revisión horaria con la lista de tareas que se mantienen en `En Proceso` y el tiempo que lleva cada una, más un indicador del reloj horario en la cabecera.

---

## Fase 3: Pruebas Automatizadas TDD y Sincronización con GitHub
- [x] **T3.1 — Nuevas Pruebas Unitarias y de Integración (`tests/kanban_gamified.test.js` + Runner In-Browser):**
  - Verificar registro de `inProgressSince`, cálculo de duración, disparo automático al superar 60 minutos (tanto en memoria como al reabrir desde `localStorage`) y cero regresiones en `RF-01`..`RF-14`.
- [x] **T3.2 — Commit y Push a GitHub (`origin/main`):**
  - Subir todos los artefactos y el código verificado al repositorio remoto del usuario.
