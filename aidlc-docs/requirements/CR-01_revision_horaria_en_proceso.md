# Change Request CR-01: Revisión Horaria y Notificación de Tareas en Proceso

- **ID del Artefacto:** `CR-01`
- **Fecha:** 2026-10-23
- **Estado:** Propuesto (Pendiente de Confirmación Humana para Ejecución — Principio 4 AI-DLC)
- **Prompts de Origen:** Prompt #05 + Clarificación Interactiva
- **Bounded Contexts Impactados:** `KanbanContext`, `PersistenceContext`, `AppStore (MVI)` y `Capa de Presentación (UI)`.

---

## 1. Descripción del Cambio y Justificación de Negocio
Los usuarios que adoptan un flujo Kanban suelen dejar tareas estacionadas en la columna **En Proceso (`in_progress`)** durante horas sin percatarse del tiempo invertido o del estancamiento operativo.

Este **Change Request (`CR-01`)** incorpora un **Motor de Revisión Horaria (Hourly WIP Review Engine)** 100% offline que evalúa cada 60 minutos (`3,600,000 ms`) —tanto con la pestaña abierta como al reabrir el archivo `.html` comparando marcas de tiempo en `localStorage`— todas las tareas que permanecen en `En Proceso`, mostrando:
1. **Una notificación visual interactiva dentro de la aplicación (Banner/Toast de Revisión Horaria)** listando las tareas activas en `En Proceso` y el tiempo transcurrido en dicha columna.
2. **Una insignia de tiempo transcurrido (`⏱️ En proceso: Xh Ym`)** visible en cada tarjeta situada en la columna `En Proceso` y resaltada cuando es objeto de una revisión horaria.

---

## 2. Nuevos Requerimientos Funcionales (`RF-15` y `RF-16`)

| ID | Módulo | Nombre | Especificación Técnica Detallada |
| :--- | :--- | :--- | :--- |
| **RF-15** | Módulo A / D | Seguimiento de Permanencia en `En Proceso` y Reloj Horario Persistente | 1. Cada vez que una tarea ingresa a la columna `in_progress`, registra el atributo ISO `inProgressSince` (si ya estaba en `in_progress` sin dicho sello, usa `createdAt` o `lastUpdated` como fallback retrocompatible). Al salir de `in_progress`, `inProgressSince` se limpia a `null`.<br>2. En `settings` se persiste `lastHourlyCheckAt` (ISO timestamp) para evaluar si han transcurrido $\ge 60\text{ minutos}$ (`3,600,000 ms`) tanto mediante un temporizador activo en segundo plano como al reabrir el archivo `.html`. |
| **RF-16** | Módulo A (UI) | Notificación Visual In-App e Insignia de Tiempo en Tarjeta | 1. Al cumplirse el ciclo de 1 hora ($\ge 60\text{ min}$ desde `lastHourlyCheckAt`) y existir al menos 1 tarea en `in_progress`, el sistema despliega una notificación visual interactiva en la aplicación detallando las tareas que se mantienen en `En Proceso` y cuánto tiempo llevan ahí.<br>2. Cada tarjeta dentro de `En Proceso` muestra una insignia con su tiempo de permanencia (`⏱️ Xh Ym` o `⏱️ Xm`) y un indicador visual de revisión activa. |

---

## 3. Impacto en el Modelo de Datos (Retrocompatible con JSON Schema v1.0.0)

- **`settings.lastHourlyCheckAt`** *(string ISO opcional)*: Marca de tiempo de la última revisión horaria ejecutada.
- **`tasks[].inProgressSince`** *(string ISO | null opcional)*: Marca de tiempo exacta en que la tarea entró por última vez al estado `in_progress`.
- El validador de esquema `PersistenceContext.validateStateSchema` mantiene **100% de compatibilidad hacia atrás** con respaldos `.json` v1.0.0 existentes (hidratando `inProgressSince` y `lastHourlyCheckAt` automáticamente si no están presentes).
