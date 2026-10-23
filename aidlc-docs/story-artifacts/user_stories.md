# Catálogo de Historias de Usuario y Criterios de Aceptación (Gherkin)

- **Proyecto:** Tablero Kanban Gamificado Offline con Sistema de Avatar Modular en Pixel Art
- **Versión:** 1.0.0
- **Trazabilidad:** RF-01 a RF-14 y RNF-01 a RNF-04

---

## US-01: Gestión Visual del Flujo Kanban y CRUD de Tareas
**Como** profesionista independiente o emprendedor,  
**Quiero** crear, editar, eliminar y visualizar tareas organizadas en cuatro columnas de flujo (*Por Hacer*, *En Proceso*, *En Revisión*, *Completado*),  
**Para** mantener claridad operativa sobre mis entregables, prioridades y fechas límite.

- **Requerimientos vinculados:** `RF-01`, `RF-02`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Gestión de Tareas en el Tablero Kanban

  Scenario: Renderizado de las cuatro columnas oficiales del flujo
    Given que el usuario abre el archivo HTML del sistema en modo offline
    Then el tablero debe mostrar exactamente las 4 columnas:
      | id          | nombre       |
      | backlog     | Por Hacer    |
      | in_progress | En Proceso   |
      | review      | En Revisión  |
      | done        | Completado   |

  Scenario: Creación exitosa de una tarjeta con todos los atributos obligatorios
    Given que el usuario abre el modal de "Nueva Tarea"
    When ingresa el título "Documentar lineamientos de seguridad" (<= 80 caracteres)
    And selecciona la categoría "Calidad/Norma"
    And selecciona la prioridad "Alta"
    And selecciona la estimación de esfuerzo "2" (Media)
    And establece la fecha límite "2026-10-25"
    And confirma el formulario
    Then se crea una tarea con un identificador único prefijado con "tsk_"
    And la tarjeta aparece en la columna "Por Hacer" (backlog)
    And el estado se persiste inmediatamente en localStorage bajo "kanban_gamified_v1"

  Scenario: Validación de longitud máxima de título y campos requeridos
    Given que el usuario intenta guardar una tarea
    When el título está vacío o supera los 80 caracteres o no tiene fecha límite válida (YYYY-MM-DD)
    Then el sistema impide el guardado y muestra un mensaje de validación claro
```

---

## US-02: Movimiento Multimodal y Control de Límite WIP (Work In Progress)
**Como** usuario enfocado en la productividad sin cuellos de botella,  
**Quiero** mover mis tarjetas mediante arrastrar y soltar (Drag & Drop) o botones laterales (`◀` y `▶`) respetando un límite configurable de tareas simultáneas en *En Proceso*,  
**Para** evitar la saturación multitarea y operar cómodamente tanto en escritorio como en pantallas táctiles.

- **Requerimientos vinculados:** `RF-03`, `RF-04`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Movimiento de Tareas y Restricción de WIP Limit

  Scenario: Movimiento de tarjeta mediante controles accesibles laterales
    Given una tarea ubicada en la columna "Por Hacer" (backlog)
    And que la columna "En Proceso" tiene menos tareas que el límite WIP actual (3)
    When el usuario hace clic en el botón de avance lateral (▶) de la tarjeta
    Then la tarjeta cambia su estado a "in_progress" y se renderiza en "En Proceso"

  Scenario: Bloqueo por límite WIP alcanzado en la columna En Proceso
    Given que el límite WIP está configurado en 3 tareas
    And existen actualmente 3 tareas en la columna "En Proceso" (in_progress)
    When el usuario intenta mover una cuarta tarea hacia "En Proceso" mediante Drag & Drop o botón (▶)
    Then el sistema rechaza la transición de estado
    And la columna "En Proceso" muestra una alerta visual de bloqueo por límite WIP excedido
    And la tarea permanece en su columna de origen
```

---

## US-03: Motor de Gamificación (Cálculo de XP, Monedas, Curva de Niveles y Rachas)
**Como** usuario del sistema,  
**Quiero** recibir puntos de experiencia (XP), monedas y progresar en mi nivel y racha diaria cada vez que completo una tarea,  
**Para** obtener gratificación inmediata por mi disciplina de entrega y puntualidad.

- **Requerimientos vinculados:** `RF-05`, `RF-06`, `RF-07`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Motor de Gamificación al Completar Tareas

  Scenario Outline: Cálculo exacto de XP y Monedas al mover una tarea a Completado
    Given una tarea no recompensada previamente con esfuerzo <esfuerzo>, prioridad "<prioridad>" y deadline "<deadline>"
    When la tarea se mueve a la columna "Completado" (done) en la fecha actual "<fecha_actual>"
    Then el usuario recibe exactamente <xp_esperado> puntos de XP
    And el usuario recibe exactamente <monedas_esperadas> monedas
    And la tarea registra su fecha de terminación (completedAt) y el XP generado (<xp_esperado>)

    Examples:
      | esfuerzo | prioridad | deadline   | fecha_actual | xp_esperado | monedas_esperadas |
      | 2        | Alta      | 2026-10-25 | 2026-10-23   | 45          | 20                |
      | 3        | Urgente   | 2026-10-23 | 2026-10-23   | 65          | 25                |
      | 1        | Baja      | 2026-10-20 | 2026-10-23   | 10          | 5                 |
      | 2        | Media     | 2026-10-22 | 2026-10-23   | 25          | 10                |

  Scenario: Progresión de nivel según curva exponencial 100 * N^1.2
    Given que la fórmula de umbral para alcanzar el siguiente nivel es XP_Requerida(N) = 100 * (N ^ 1.2)
    When el usuario acumula suficiente XP para superar el umbral de su nivel actual
    Then el nivel del usuario se incrementa automáticamente y se notifica el ascenso de nivel

  Scenario: Control de racha diaria consecutiva y reinicio por inactividad (> 48 horas)
    Given un usuario con "streakDays" igual a 4 y "lastActiveDate" igual a "2026-10-22"
    When completa una tarea el día "2026-10-23" (día natural consecutivo)
    Then su "streakDays" se incrementa a 5 y "lastActiveDate" se actualiza a "2026-10-23"
    When transcurren más de 48 horas sin completar tareas (ej. hasta "2026-10-26")
    Then la racha "streakDays" se reinicia a 0
```

---

## US-04: Avatar Modular Pixel Art ("Buddy"), Tienda de 15 Sprites y Micro-reacciones
**Como** usuario del tablero gamificado,  
**Quiero** visualizar a mi avatar "Buddy" renderizado en Pixel Art SVG de 5 capas, comprar/equipar entre 15 accesorios en la tienda y ver sus reacciones de alegría o estrés según mi desempeño,  
**Para** sentir una conexión visual y lúdica con el estado de mi flujo de trabajo.

- **Requerimientos vinculados:** `RF-08`, `RF-09`, `RF-10`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Avatar Modular SVG ("Buddy"), Catálogo de 15 Sprites y Micro-reacciones

  Scenario: Renderizado multicapa SVG con fidelidad Pixel Art
    Given el contenedor del avatar Buddy en la interfaz principal
    Then debe renderizar un elemento <svg viewBox="0 0 16 16" shape-rendering="crispEdges">
    And debe contener 5 capas superpuestas en orden de profundidad (z-index):
      | capa | id_capa | descripcion                        |
      | 0    | base    | Anatomía fija de 16x16 píxeles     |
      | 1    | body    | Sprites de torso / ropa            |
      | 2    | head    | Sprites de cabello, gorra, audio   |
      | 3    | hand    | Sprites de café, laptop o bebidas  |
      | 4    | aura    | Animaciones o sprites periféricos  |

  Scenario: Catálogo modal con 15 sprites y validación de compra/desbloqueo
    Given que el usuario abre la vista modal de Tienda/Armario del Buddy
    Then el catálogo muestra exactamente 15 sprites modulares clasificados en:
      - "Desbloqueado / Equipado"
      - "Disponible para compra" (validando saldo en monedas y nivel mínimo requerido)
      - "Bloqueado por logro"
    When el usuario compra un sprite para el cual cumple el nivel mínimo y tiene monedas suficientes
    Then se descuentan las monedas del saldo del usuario
    And el sprite se agrega al arreglo "buddy.inventory" y puede equiparse en su capa correspondiente

  Scenario: Micro-reacciones de salto (bounce) y estrés por tareas vencidas
    Given el avatar Buddy visible en el panel superior
    When el usuario mueve una tarea a la columna "Completado"
    Then el contenedor del Buddy ejecuta la animación de salto ("bounce")
    When existe al menos una tarea en la columna "En Proceso" cuya fecha "deadline" es menor a la fecha actual
    Then el Buddy activa automáticamente el sprite/estado visual de estrés
```

---

## US-05: Persistencia Local, Respaldo/Restauración JSON y Reporte CSV
**Como** dueño de mis datos operativos,  
**Quiero** que todo se guarde automáticamente en mi navegador y poder exportar/importar respaldos `.json` validados o descargar mis métricas en `.csv`,  
**Para** proteger mi información sin depender de la nube y analizar mi productividad en hojas de cálculo.

- **Requerimientos vinculados:** `RF-11`, `RF-12`, `RF-13`, `RF-14`, `RNF-01`, `RNF-02`, `RNF-03`, `RNF-04`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Persistencia Local, Portabilidad JSON y Exportación CSV

  Scenario: Exportación e importación de respaldo JSON con validación de esquema
    Given un tablero con tareas, estadísticas de usuario e inventario del Buddy
    When el usuario pulsa "Exportar JSON"
    Then se descarga un archivo nombrado "kanban_backup_YYYY-MM-DD.json" con el esquema oficial v1.0.0
    When el usuario selecciona un archivo JSON corrupto o con esquema inválido en "Importar JSON"
    Then el sistema rechaza el archivo sin alterar el estado actual en memoria ni en localStorage
    When el usuario selecciona un archivo "kanban_backup_YYYY-MM-DD.json" válido
    Then el sistema restaura íntegramente el tablero, el perfil del usuario y el avatar Buddy

  Scenario: Exportación de reporte de productividad en formato CSV
    Given un tablero con tareas registradas
    When el usuario pulsa "Exportar CSV"
    Then se descarga un archivo ".csv" cuya primera fila de encabezados es exactamente:
      "ID,Título,Categoría,Prioridad,Fecha_Terminación,XP_Generado"
```


---

## US-06: Revisión Horaria y Notificación Visual de Tareas en Proceso (CR-01)
**Como** usuario del tablero Kanban,  
**Quiero** que el sistema realice una revisión automática cada hora (incluyendo cuando reabro el archivo tras haber pasado 60 minutos o más) y me muestre una notificación visual dentro de la aplicación junto con el tiempo que lleva cada tarea en la columna *En Proceso*,  
**Para** mantener visibilidad constante sobre las tareas activas y evitar que se queden estancadas sin cerrarse.

- **Requerimientos vinculados:** `CR-01`, `RF-15`, `RF-16`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Revisión Horaria y Notificación de Tareas en Proceso

  Scenario: Registro de marca de tiempo al mover una tarea a En Proceso
    Given una tarea en la columna "Por Hacer" (backlog)
    When el usuario mueve la tarea a "En Proceso" (in_progress) en el instante "2026-10-23T12:00:00.000Z"
    Then la tarea registra "inProgressSince" igual a "2026-10-23T12:00:00.000Z"
    And la tarjeta en "En Proceso" muestra una insignia visual con el tiempo transcurrido en esa columna

  Scenario: Disparo de notificación visual al cumplirse 1 hora (60 minutos) con pestaña abierta o al reabrir
    Given que la última revisión horaria "lastHourlyCheckAt" ocurrió en "2026-10-23T12:00:00.000Z"
    And existen tareas activas en la columna "En Proceso" (in_progress)
    When el reloj del sistema o la reapertura del archivo alcanza o supera "2026-10-23T13:00:00.000Z" (>= 60 minutos)
    Then el sistema ejecuta la acción de revisión horaria ("RUN_HOURLY_CHECK")
    And actualiza "settings.lastHourlyCheckAt" a la hora actual
    And muestra una notificación visual dentro de la aplicación (banner/toast interactivo) listando las tareas que se mantienen en "En Proceso" y cuánto tiempo llevan ahí
    And resalta visualmente las tarjetas en "En Proceso" con su insignia de tiempo transcurrido

  Scenario: Sin notificación intrusiva cuando no hay tareas en En Proceso
    Given que transcurren 60 minutos desde "lastHourlyCheckAt"
    And existen 0 tareas en la columna "En Proceso"
    When se ejecuta la revisión horaria automática
    Then se actualiza "settings.lastHourlyCheckAt" sin mostrar alerta de tareas estancadas
```


---

## US-07: Versión de Producción Limpia e Inicio en Cero (CR-02)
**Como** usuario final que adopta el tablero Kanban gamificado para su trabajo diario,  
**Quiero** que la aplicación inicie con todas las estadísticas y tareas en cero y sin botones técnicos de prueba en la barra superior, conservando la versión de pruebas como una versión anterior,  
**Para** comenzar a registrar mis propias tareas desde el Nivel 1 sin datos de ejemplo ni controles de depuración visibles.

- **Requerimientos vinculados:** `CR-02`, `RF-17`, `RF-18`

### Criterios de Aceptación (Gherkin)
```gherkin
Feature: Edición de Producción Limpia e Inicio en Cero

  Scenario: Arranque inicial en cero para nuevos usuarios
    Given que el navegador no tiene datos previos en localStorage bajo "kanban_gamified_v1"
    When el usuario abre el archivo "index.html" de producción
    Then las estadísticas del usuario deben iniciar en:
      | atributo       | valor |
      | xp             | 0     |
      | level          | 1     |
      | coins          | 0     |
      | streakDays     | 0     |
      | lastActiveDate | null  |
    And la lista de tareas "tasks" debe estar vacía (0 tareas en las 4 columnas)

  Scenario: Ausencia de botones de prueba en la interfaz de producción
    Given que el usuario visualiza la barra superior de herramientas en "index.html"
    Then solo deben mostrarse los botones operativos ("Nueva Tarea", "Exportar JSON", "Importar JSON", "Exportar CSV")
    And no deben existir en la barra los botones "Revisión 1h" ni "Verificar (Tests)"
    And el temporizador automático de revisión cada 60 minutos continúa operando de forma transparente
```
