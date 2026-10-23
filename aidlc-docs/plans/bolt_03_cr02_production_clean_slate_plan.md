# Plan de Construcción — Bolt 3 (CR-02: Edición de Producción en Cero y Release v1.1.0)

- **ID del Artefacto:** `PLAN-BOLT-03`
- **Change Request Vinculado:** `CR-02` (`RF-17`, `RF-18`, `US-07`)
- **Estado:** Completado y Verificado (100% de Pruebas en Verde)

---

## Fase 0: Gobernanza y Especificación de `CR-02` (`aidlc-docs/`)
- [x] **T0.1:** Registrar Prompt #08 en `aidlc-docs/prompts.md`.
- [x] **T0.2:** Crear documento `aidlc-docs/requirements/CR-02_version_produccion_en_cero.md` (`RF-17`, `RF-18`).
- [x] **T0.3:** Agregar Historia de Usuario `US-07` con escenarios Gherkin en `aidlc-docs/story-artifacts/user_stories.md`.
- [x] **T0.4:** Formular el Plan de Construcción del Bolt 3 en `aidlc-docs/plans/bolt_03_cr02_production_clean_slate_plan.md`.

---

## Fase 1: Preservación de Versión de Pruebas y Limpieza de Producción
- [x] **T1.1 — Preservar Versión de Pruebas Anterior:**
  - Mantener intacto el tag `v1.0.0` en Git/GitHub como la versión anterior de pruebas.
- [x] **T1.2 — Configurar Estado Inicial en Cero (`RF-18`):**
  - Actualizar `PersistenceContext.createInitialState` en `index.html` para que inicie con `xp: 0`, `level: 1`, `coins: 0`, `streakDays: 0`, `lastActiveDate: null` y `tasks: []`.
- [x] **T1.3 — Retirar Botones de Diagnóstico de la Interfaz (`RF-17`):**
  - Eliminar de la barra superior los botones `⏱️ Revisión 1h` (`#btnHourlyReviewCheck`) y `🧪 Verificar (Tests)` (`#btnRunSelfTests`) junto con el modal de diagnóstico `#modalSelfTests`, manteniendo activo el temporizador automático cada 60 minutos y la evaluación al reabrir el archivo.

---

## Fase 2: Actualización de Suite de Pruebas, Documentación y Release `v1.1.0`
- [x] **T2.1 — Actualizar `tests/kanban_gamified.test.js`:**
  - Verificar mediante pruebas automatizadas que el estado inicial de producción arranca en `0` (`xp: 0, level: 1, coins: 0, streakDays: 0, tasks: []`), que los botones de prueba ya no aparecen en el HTML de producción, y que el 100% de las reglas (`RF-01` a `RF-18`) pasan en verde.
- [x] **T2.2 — Actualizar `README.md` y Publicar Release `v1.1.0` en GitHub:**
  - Documentar la diferencia entre `v1.0.0` (Versión de Pruebas/Demo) y `v1.1.0` (Versión de Producción Lista para Uso en Cero), hacer commit, crear tag `v1.1.0` y subirlo a `origin/main`.
