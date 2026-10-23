# Documento de Incepción y PRFAQ — Tablero Kanban Gamificado Offline

- **ID del Artefacto:** `REQ-INC-01`
- **Proyecto:** Tablero Kanban Gamificado Offline con Sistema de Avatar Modular en Pixel Art
- **Versión:** 1.0.0
- **Fecha:** 2026-10-23
- **Estado:** Aprobado en Fase de Incepción (Basado en SRS v1.0)
- **Audiencia Objetivo:** Emprendedores, profesionistas independientes y micro/pequeñas empresas (MiPyMEs).

---

## 1. Press Release (PR) — Visión de Futuro

**PARA PUBLICACIÓN INMEDIATA**  
**Nuevo Sistema Kanban Gamificado Offline Transforma la Productividad de Emprendedores y MiPyMEs en un Juego de Rol sin Costos de Suscripción ni Servidores**

**Ciudad de México — 23 de Octubre de 2026** — Hoy se lanza el **Tablero Kanban Gamificado Offline con Sistema de Avatar Modular ("Buddy")**, una herramienta de gestión de flujo de trabajo distribuida como un **único archivo `.html` 100% autocontenido**, diseñada para erradicar la fatiga operativa y la barrera técnica/financiera de las plataformas SaaS tradicionales.

Las micro y pequeñas empresas, así como los profesionistas independientes, enfrentan tres grandes obstáculos al intentar adoptar metodologías ágiles: sobrecarga de costos en dólares y configuraciones complejas (Jira, Monday, Asana), resistencia al cambio por falta de gratificación inmediata al registrar tareas, e imposibilidad técnica para desplegar entornos locales (Docker, Node.js, bases de datos).

Con esta solución, el usuario simplemente abre un archivo `.html` local (menor a 150 KB) en cualquier navegador de escritorio o móvil (`file:///`) y obtiene de inmediato un tablero Kanban profesional con límite de trabajo en proceso (WIP Limit), acoplado a un motor de gamificación táctica. Cada tarea completada a tiempo otorga puntos de experiencia (XP) y monedas que permiten subir de nivel, mantener rachas diarias de productividad y desbloquear hasta 15 accesorios en Pixel Art SVG para personalizar un avatar de 5 capas ("Buddy"), el cual reacciona en tiempo real al estado del tablero.

---

## 2. Frequently Asked Questions (FAQ)

### 2.1 Preguntas del Usuario / Negocio
1. **¿Necesito conexión a internet o crear una cuenta para usarlo?**  
   No. El sistema es 100% offline y cero dependencias externas (RNF-01). No requiere internet, servidores ni cuentas.
2. **¿Dónde se guardan mis tareas y qué pasa si cierro el navegador?**  
   Cada acción se sincroniza instantáneamente en la memoria local de tu navegador (`localStorage` bajo la clave `kanban_gamified_v1`). Al reabrir el archivo, tu tablero, nivel, monedas y avatar estarán exactamente como los dejaste.
3. **¿Cómo puedo mover mis datos a otra computadora o hacer respaldos?**  
   El sistema incluye un módulo de exportación e importación en formato `.json` (`kanban_backup_YYYY-MM-DD.json`) con validación estricta de esquema, además de exportación de reportes gerenciales en `.csv`.
4. **¿Cómo evita el sistema que una tarea inflada otorgue recompensas infinitas?**  
   Cada tarea registra su sello de recompensas al completarse (`rewarded: true` y `xpGenerated`), garantizando idempotencia: reabrir y volver a completar la misma tarea no duplica XP ni monedas.

### 2.2 Preguntas Técnicas y de Arquitectura (AI-DLC)
1. **¿Cómo se aplica Domain-Driven Design (DDD) y Arquitectura Limpia en un único archivo `.html`?**  
   El código JavaScript (ES6+) dentro del archivo `.html` se estructura modularmente en 4 **Bounded Contexts** desacoplados (`KanbanContext`, `GamificationContext`, `BuddyContext`, `PersistenceContext`) gobernados por un patrón **MVI / Store Unidireccional** (`State -> Render -> Event -> Action -> Domain -> State`) y una separación estricta entre **Capa de Dominio (Funciones Puras)**, **Capa de Aplicación (Casos de Uso / Store)**, **Capa de Infraestructura (Adaptadores `localStorage` / `Blob` / `FileReader`)** y **Capa de Presentación (UI Declarativa + SVG Pixel Art)**.
2. **¿Cómo se garantiza el Principio 3 de AI-DLC (Test-Driven & Cero Regresión) en un archivo `.html` independiente?**  
   Doble estrategia de verificación:
   - **Suite de Pruebas Automatizadas In-Browser (`Self-Test Runner` integrado):** Ejecutable directamente dentro de la aplicación o vía consola/parámetro `?test=true` sin dependencias externas.
   - **Suite de Pruebas Automatizadas en CLI (`tests/` con Node.js Test Runner nativo):** Verifica el 100% de las reglas de dominio, fórmulas matemáticas, validación de esquemas JSON, generación CSV y cumplimiento de restricciones RNF (peso `< 150 KB`, cero URLs externas).

---

## 3. Matriz Maestra de Requerimientos Funcionales (RF)

| ID | Módulo | Nombre | Especificación Técnica Detallada |
| :--- | :--- | :--- | :--- |
| **RF-01** | Módulo A: Kanban | Columnas de Flujo | Exactamente 4 estados de avance: `backlog` (*Por Hacer*), `in_progress` (*En Proceso*), `review` (*En Revisión*), `done` (*Completado*). |
| **RF-02** | Módulo A: Kanban | Creación y Edición de Tareas | Campos obligatorios: `id` (UUID v4 o `tsk_...`), `title` (máx. 80 caracteres), `category` (`Operación`, `Cliente`, `Calidad/Norma`, `Administración`), `priority` (`Baja`, `Media`, `Alta`, `Urgente`), `effort` (`1` Rápida, `2` Media, `3` Compleja), `deadline` (`YYYY-MM-DD`). |
| **RF-03** | Módulo A: Kanban | Interacción y Movimiento | Movimiento entre columnas vía HTML5 Drag and Drop nativo y controles accesibles de clic/flechas laterales (`◀` y `▶`) para dispositivos táctiles y teclado. |
| **RF-04** | Módulo A: Kanban | Restricción de Flujo (WIP Limit) | Límite configurable de tareas simultáneas en `En Proceso` (valor por defecto: `3`). Al alcanzar o intentar sobrepasar el límite, bloquea el ingreso de nuevas tareas a `En Proceso` y muestra alerta visual de bloqueo. |
| **RF-05** | Módulo B: Gamificación | Cálculo de XP y Monedas | Al mover a `Completado`:<br>- $\text{XP}_{\text{Base}} = \text{PuntosDeEsfuerzo} \times 10$<br>- $\text{Monedas}_{\text{Base}} = \text{PuntosDeEsfuerzo} \times 5$<br>- **Bono de puntualidad** ($\text{FechaActual} \le \text{Deadline}$): $+15\text{ XP}$ y $+10\text{ Monedas}$<br>- **Bono por prioridad**: `Urgente` ($+20\text{ XP}$), `Alta` ($+10\text{ XP}$), `Media` ($+5\text{ XP}$), `Baja` ($0\text{ XP}$). |
| **RF-06** | Módulo B: Gamificación | Curva de Niveles | Progresión regida por la fórmula: $\text{XP}_{\text{RequeridaParaNivel } N} = \lfloor 100 \times N^{1.2} \rfloor$ (evaluada con precisión para determinar el nivel actual a partir del XP acumulado). |
| **RF-07** | Módulo B: Gamificación | Control de Rachas | Registra racha consecutiva de días trabajados (`streakDays`). Si se completa al menos una tarea en días naturales consecutivos, incrementa en $+1$. Si transcurren más de 48 horas sin cerrar tareas, la racha se reinicia a `0`. |
| **RF-08** | Módulo C: Buddy & Tienda | Renderizado Multicapa SVG | Contenedor cuadrangular con `shape-rendering: crispEdges` y `viewBox="0 0 16 16"` compuesto por 5 capas superpuestas en orden de `z-index`:<br>1. Capa 0 (`base`): Anatomía fija 16x16.<br>2. Capa 1 (`body`): Sprites de torso/ropa.<br>3. Capa 2 (`head`): Sprites de cabello, gorras o audífonos.<br>4. Capa 3 (`hand`): Sprites de café, laptop o bebidas.<br>5. Capa 4 (`aura`): Animaciones o sprites periféricos. |
| **RF-09** | Módulo C: Buddy & Tienda | Catálogo y Desbloqueo | Vista modal (`<dialog>`) con **15 sprites modulares** clasificados en: *Desbloqueado/Equipado*, *Disponible para compra* (valida saldo en monedas y nivel mínimo requerido), y *Bloqueado por logro*. |
| **RF-10** | Módulo C: Buddy & Tienda | Micro-reacciones del Buddy | 1. Animación de salto (`bounce`) al soltar/mover una tarea a `Completado`.<br>2. Activación automática de sprite/indicador de estrés si existen tareas vencidas ($\text{Deadline} < \text{Hoy}$) en la columna `En Proceso`. |
| **RF-11** | Módulo D: Persistencia | Almacenamiento Local | Sincronización síncrona en `localStorage` bajo la clave única `kanban_gamified_v1` en cada mutación de estado. |
| **RF-12** | Módulo D: Persistencia | Exportación JSON | Botón para descargar `kanban_backup_YYYY-MM-DD.json` mediante `Blob API` con la totalidad del estado (`version`, `lastUpdated`, `user`, `buddy`, `settings`, `tasks`). |
| **RF-13** | Módulo D: Persistencia | Importación JSON | Lector `<input type="file" accept=".json">` con `FileReader API` y validador estricto de esquema JSON para prevenir estados corruptos antes de sobreescribir la memoria. |
| **RF-14** | Módulo D: Persistencia | Exportación CSV | Generador de reporte tabular descargable `.csv` con columnas exactas: `ID,Título,Categoría,Prioridad,Fecha_Terminación,XP_Generado`. |

---

## 4. Requerimientos No Funcionales (RNF)

| ID | Categoría | Criterio de Aceptación Cuantitativo |
| :--- | :--- | :--- |
| **RNF-01** | Autocontención / Cero Dependencias | 100% contenido en un único archivo `.html`. Cero CDNs externas (`https://...`), cero Google Fonts en línea, cero imágenes externas. |
| **RNF-02** | Rendimiento y Peso | Tamaño total del archivo `.html` $\le 150\text{ KB}$. Tiempo de arranque y renderizado inicial $< 100\text{ ms}$. |
| **RNF-03** | Compatibilidad de Plataforma | Ejecución limpia sobre protocolo `file:///` en Chromium (Chrome, Edge, Brave), Gecko (Firefox) y WebKit (Safari) en escritorio y móvil. |
| **RNF-04** | Usabilidad y Estética | Modo oscuro predeterminado orientado a reducir fatiga visual, con ratio de contraste mínimo **WCAG AA ($\ge 4.5:1$)** en textos y controles interactivos. |
