# Change Request CR-02: Edición de Producción Limpia (Estado Inicial en Cero y Sin Botones de Diagnóstico)

- **ID del Artefacto:** `CR-02`
- **Fecha:** 2026-10-23
- **Estado:** Propuesto (Pendiente de Confirmación Humana para Ejecución — Principio 4 AI-DLC)
- **Prompt de Origen:** Prompt #08
- **Release Anterior Preservado:** `v1.0.0` (Versión de pruebas con datos de demostración y botones `⏱️ Revisión 1h` y `🧪 Verificar (Tests)`).
- **Nuevo Release Objetivo:** `v1.1.0` (Versión de Producción limpia para usuarios finales).

---

## 1. Descripción del Cambio y Justificación de Negocio
Durante la fase de validación (`v1.0.0`), la interfaz incluía botones de diagnóstico rápido (`⏱️ Revisión 1h` y `🧪 Verificar (Tests)`) así como datos precargados (`xp: 350`, `level: 3`, `coins: 120`, `streakDays: 4`, y una tarea de ejemplo en *En Proceso*) para facilitar las pruebas manuales.

Para que los usuarios finales puedan comenzar a utilizar la herramienta en producción sin distracciones ni datos ficticios:
1. Se preserva la versión de pruebas como la versión anterior en Git (`tag v1.0.0`) y adicionalmente como archivo de referencia (`index.testing.html` o en el historial de releases).
2. El archivo principal [index.html](file:///home/alex/Documentos/Antigravity_Gamification_Kanban/index.html) pasa a ser la **Versión de Producción (`v1.1.0`)**:
   - **Sin botones de diagnóstico en la cabecera:** Se eliminan de la vista los botones `⏱️ Revisión 1h` y `🧪 Verificar (Tests)` (manteniendo activo el motor automático de revisión cada 60 minutos en segundo plano y al reabrir el archivo).
   - **Estado inicial completamente en cero (`Clean Slate`):**
     - `user`: `xp: 0`, `level: 1`, `coins: 0`, `streakDays: 0`, `lastActiveDate: null`.
     - `tasks`: `[]` (Tablero vacío en las 4 columnas listo para crear la primera tarea real).
     - `buddy`: Equipamiento base inicial (`base_dev`, `body_hoodie`, `head_headphones`, `hand_coffee`, `aura_sparkles`).

---

## 2. Requerimientos Funcionales Actualizados (`RF-17` y `RF-18`)

| ID | Módulo | Nombre | Especificación Técnica Detallada |
| :--- | :--- | :--- | :--- |
| **RF-17** | Módulo A / UI | Interfaz Limpia de Producción | La barra de herramientas superior debe mostrar únicamente las acciones operativas del usuario final: `➕ Nueva Tarea`, `💾 Exportar JSON`, `📂 Importar JSON` y `📊 Exportar CSV`. No deben mostrarse los botones de prueba/diagnóstico (`⏱️ Revisión 1h` ni `🧪 Verificar (Tests)`). |
| **RF-18** | Módulo B / D | Estado Inicial en Cero (`Clean Slate`) | Cuando el usuario abre la aplicación por primera vez (sin datos previos en `localStorage`), el estado inicial debe arrancar en cero: `xp: 0`, `level: 1`, `coins: 0`, `streakDays: 0`, `lastActiveDate: null` y `tasks: []` (0 tareas precargadas). |
