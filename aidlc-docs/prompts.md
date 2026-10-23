# Bitácora de Prompts del Usuario (AI-DLC)

Registro secuencial e inmutable de todas las instrucciones, requerimientos y confirmaciones proporcionadas por el usuario a lo largo del ciclo de vida del proyecto **Tablero Kanban Gamificado Offline con Sistema de Avatar Modular en Pixel Art**.

---

## Prompt #01 — Inicialización y Especificación SRS (2026-10-23)

### Texto del Prompt:
```markdown
# SYSTEM PROMPT / INICIALIZACIÓN: METODOLOGÍA AI-DLC (AI-DRIVEN SOFTWARE DEVELOPMENT LIFE CYCLE)
Actúa como **Lead Software Architect y Principal Full-Stack Engineer** operando bajo la metodología formal **AI-DLC (AI-Driven Software Development Life Cycle)**.
Tu objetivo es diseñar, construir, documentar y mantener el siguiente proyecto:
- **Proyecto:** Tablero Kanban Gamificado Offline 
- **Objetivo / Visión de Negocio:** Tablero Kanban Gamificado Offline con Sistema de Avatar Modular en Pixel Art
- **Stack Tecnológico:** HTML y tecnologías necesarias para que funcione de manera independiente
---
## 1. PRINCIPIOS NUCLEARES DE AI-DLC
1. **Gobernanza y Trazabilidad Total:** Todo requerimiento, cambio o corrección debe quedar documentado en artefactos versionados dentro del repositorio.
2. **Domain-Driven Design (DDD):** El software se estructura en Bounded Contexts (Units cohesivas y desacopladas) con contratos claros de eventos o APIs.
3. **Test-Driven & Cero Regresión:** Cada funcionalidad debe contar con pruebas automatizadas unitarias/integración. Ningún cambio puede introducir regresiones (100% de pruebas en verde antes de entregar).
4. **Planificación y Confirmación Humana:** Antes de alterar la arquitectura o escribir grandes bloques de código, se debe proponer un plan desglosado al usuario.
5. **Calidad de Código y Arquitectura Limpia:** Separación estricta de responsabilidades (capa de dominio, servicios, infraestructura/controladores, vistas/frontend).
---
## 2. ESTRUCTURA OBLIGATORIA DE ARTEFACTOS (`aidlc-docs/`)
En la raíz del proyecto debes crear y mantener viva la siguiente estructura de carpetas:
aidlc-docs/
├── prompts.md                  # Bitácora secuencial de TODOS los prompts textuales del usuario
├── requirements/               # Documento de incepción (PRFAQ) y Change Requests (CR-01, CR-02...)
│   └── inception_[proyecto].md
├── story-artifacts/            # Historias de usuario (US-01, US-02...) con criterios Gherkin
├── plans/                      # Planes de construcción por Bolt/Fase con tareas en formato checklist [ ]
└── design-artifacts/           # Diagramas C4/Mermaid, modelos de datos, contratos de eventos y APIs
```

### Documentos Adjuntos en Prompt #01:
- **Documento de Análisis de Requerimientos y Especificación Técnica (SRS) v1.0** (`6 páginas`):
  - **Módulo A (Gestión del Tablero Kanban):** RF-01 (4 Columnas de Flujo), RF-02 (Creación/Edición de Tareas con UUID, Título <=80 chars, Categoría, Prioridad, Esfuerzo 1-3 pts, Deadline YYYY-MM-DD), RF-03 (HTML5 Drag & Drop + controles táctiles/accesibles `◀` y `▶`), RF-04 (WIP Limit configurable en `En Proceso`, default 3, alerta visual de bloqueo).
  - **Módulo B (Motor de Gamificación):** RF-05 (Cálculo de XP y Monedas al completar: `XPBase = Esfuerzo * 10`, `MonedasBase = Esfuerzo * 5`, Bono puntualidad `+15 XP / +10 Monedas`, Bono prioridad `Urgente +20, Alta +10, Media +5, Baja 0`), RF-06 (Curva de niveles `XPRequerida = 100 * N^1.2`), RF-07 (Control de rachas por días consecutivos y reinicio tras >48h de inactividad).
  - **Módulo C (Avatar Modular "Buddy" y Tienda):** RF-08 (Renderizado Multicapa SVG 16x16 con `shape-rendering: crispEdges` en 5 capas: Base, Body, Head, Hand, Aura), RF-09 (Catálogo modal con 15 sprites modulares clasificados en Desbloqueado/Equipado, Disponible para compra y Bloqueado por logro), RF-10 (Micro-reacciones: salto `bounce` al completar tarea y sprite de estrés si hay tareas vencidas en `En Proceso`).
  - **Módulo D (Persistencia y Respaldo de Datos):** RF-11 (`localStorage` síncrono bajo clave `kanban_gamified_v1`), RF-12 (Exportación JSON `kanban_backup_YYYY-MM-DD.json`), RF-13 (Importación JSON con validación estricta de esquema), RF-14 (Exportación CSV con columnas `ID, Título, Categoría, Prioridad, Fecha_Terminación, XP_Generado`).
  - **Requerimientos No Funcionales:** RNF-01 (Autocontención 100% en un único archivo `.html`, cero CDNs), RNF-02 (Peso total <= 150 KB, arranque < 100 ms), RNF-03 (Compatibilidad multiplataforma sobre protocolo `file:///`), RNF-04 (Modo oscuro predeterminado con contraste mínimo WCAG AA >= 4.5:1).


---

## Prompt #02 — Confirmación de Plan Maestro y Solicitud de Sincronización con GitHub (2026-10-23)

### Texto del Prompt:
```markdown
Confirmo, puedes ir subiendo los cambios necesarios a mi github?
```


---

## Prompt #03 — Configuración de Repositorio Remoto en GitHub (2026-10-23)

### Texto del Prompt:
```markdown
https://github.com/alexlv4/KanbanGamification.git
```


---

## Prompt #04 — Confirmación de Configuración de Llave SSH en GitHub (2026-10-23)

### Texto del Prompt:
```markdown
Ya realice la opcion A
```


---

## Prompt #05 — Solicitud de Nuevo Requerimiento (CR-01: Revisión Horaria y Notificación de Tareas en Proceso) (2026-10-23)

### Texto del Prompt:
```markdown
Quiero agregar una funcionalidad que haga una revisión cada hora y que mande una notificación en las tareas que se mantienen en proceso para que el usuario pueda ver esto, recuerda hacerme preguntas para clarificar la funcionalidad en caso de ser necesario
```


### Clarificación Interactiva del Usuario (Respuestas a `ask_question` para CR-01):
1. **¿Por qué canal(es) deseas que se muestre la notificación cada hora?**
   - **Respuesta:** Notificación visual dentro de la aplicación (banner/toast interactivo + insignia de tiempo en cada tarjeta en proceso).
2. **¿Qué criterio debe disparar la notificación durante la revisión horaria?**
   - **Respuesta:** Notificar todas las tareas que actualmente estén en la columna "En Proceso" (mostrando cuánto tiempo llevan ahí).
3. **¿Cómo debe comportarse el reloj de 1 hora si el usuario cierra y vuelve a abrir el archivo HTML?**
   - **Respuesta:** Sí, evaluar el tiempo transcurrido desde la última revisión al reabrir el archivo `.html` (usando `localStorage`) además del temporizador activo cada 60 min.


---

## Prompt #06 — Confirmación del Plan de Construcción Bolt 2 (CR-01) (2026-10-23)

### Texto del Prompt:
```markdown
Confirmo
```
