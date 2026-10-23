const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const htmlStats = fs.statSync(htmlPath);

// Extraer el bloque <script> principal del archivo único index.html
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  throw new Error('No se encontró el bloque <script> dentro de index.html');
}

const sandbox = {
  console,
  Date,
  Math,
  JSON,
  Set,
  Array,
  Object,
  Number,
  String,
  Boolean,
  RegExp,
  crypto: require('node:crypto').webcrypto
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

const App = sandbox.KanbanGamifiedApp;

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    clear() {
      map.clear();
    }
  };
}

test('RNF-01 & RNF-02: Autocontención 100% en único archivo .html (cero CDNs externas) y peso <= 150 KB', () => {
  assert.ok(htmlStats.size <= 150 * 1024, `El tamaño del archivo (${htmlStats.size} bytes) supera los 150 KB`);
  assert.equal(/<script[^>]+src=/i.test(htmlContent), false, 'No debe contener etiquetas <script src="..."> externas');
  assert.equal(/<link[^>]+href=["']https?:/i.test(htmlContent), false, 'No debe cargar hojas de estilo o fuentes externas');
  assert.equal(/fonts\.googleapis\.com/i.test(htmlContent), false, 'Prohibido el uso de Google Fonts en línea');
});

test('RF-01 & RF-02: 4 columnas oficiales y validación obligatoria de creación/edición de tareas', () => {
  assert.deepEqual(Array.from(App.COLUMNS), ['backlog', 'in_progress', 'review', 'done']);

  const storage = createMemoryStorage();
  const store = App.createAppStore(storage);

  // Título > 80 caracteres debe fallar
  const tooLong = store.dispatch({
    type: 'CREATE_TASK',
    payload: {
      title: 'X'.repeat(81),
      category: 'Operación',
      priority: 'Media',
      effort: 1,
      deadline: '2026-10-30'
    }
  });
  assert.equal(tooLong.success, false);

  // Creación válida con todos los campos obligatorios
  const created = store.dispatch({
    type: 'CREATE_TASK',
    nowISO: '2026-10-23T10:00:00.000Z',
    payload: {
      title: 'Implementar auditoría de calidad ISO',
      category: 'Calidad/Norma',
      priority: 'Urgente',
      effort: 3,
      deadline: '2026-10-28'
    }
  });
  assert.equal(created.success, true);
  assert.match(created.task.id, /^tsk_/);
  assert.equal(created.task.status, 'backlog');
});

test('RF-03 & RF-04: Movimiento entre columnas y restricción de flujo WIP Limit (valor por defecto 3)', () => {
  const storage = createMemoryStorage();
  const store = App.createAppStore(storage);

  assert.equal(store.getState().settings.wipLimit, 3, 'El límite WIP por defecto debe ser 3');

  // El estado inicial empieza con 0 tareas; creamos 4 tareas y movemos 3 a in_progress
  const t0 = store.dispatch({
    type: 'CREATE_TASK',
    payload: { title: 'Tarea WIP 1', category: 'Operación', priority: 'Baja', effort: 1, deadline: '2026-10-29' }
  }).task;
  const t1 = store.dispatch({
    type: 'CREATE_TASK',
    payload: { title: 'Tarea WIP 2', category: 'Operación', priority: 'Baja', effort: 1, deadline: '2026-10-29' }
  }).task;
  const t2 = store.dispatch({
    type: 'CREATE_TASK',
    payload: { title: 'Tarea WIP 3', category: 'Cliente', priority: 'Media', effort: 2, deadline: '2026-10-29' }
  }).task;
  const t3 = store.dispatch({
    type: 'CREATE_TASK',
    payload: { title: 'Tarea WIP 4 (Excede)', category: 'Administración', priority: 'Alta', effort: 2, deadline: '2026-10-29' }
  }).task;

  assert.equal(store.dispatch({ type: 'MOVE_TASK', id: t0.id, targetStatus: 'in_progress' }).success, true);
  assert.equal(store.dispatch({ type: 'MOVE_TASK', id: t1.id, targetStatus: 'in_progress' }).success, true);
  assert.equal(store.dispatch({ type: 'MOVE_TASK', id: t2.id, targetStatus: 'in_progress' }).success, true);

  // La 4ta tarea en in_progress debe ser bloqueada con alerta wipBlocked
  const blocked = store.dispatch({ type: 'MOVE_TASK', id: t3.id, targetStatus: 'in_progress' });
  assert.equal(blocked.success, false);
  assert.equal(blocked.wipBlocked, true);
});

test('RF-05, RF-06 & RF-07: Fórmulas de XP, Monedas, Curva de Niveles (100 * N^1.2) y Control de Rachas (48h)', () => {
  // Puntual + Urgente + Esfuerzo 3 => XPBase(30) + Puntual(15) + Urgente(20) = 65 XP | MonedasBase(15) + Puntual(10) = 25
  const r1 = App.GamificationContext.calculateTaskReward(
    { effort: 3, priority: 'Urgente', deadline: '2026-10-25' },
    '2026-10-23'
  );
  assert.equal(r1.totalXp, 65);
  assert.equal(r1.totalCoins, 25);

  // Vencida + Baja + Esfuerzo 1 => XPBase(10) + Puntual(0) + Baja(0) = 10 XP | MonedasBase(5) + Puntual(0) = 5
  const r2 = App.GamificationContext.calculateTaskReward(
    { effort: 1, priority: 'Baja', deadline: '2026-10-20' },
    '2026-10-23'
  );
  assert.equal(r2.totalXp, 10);
  assert.equal(r2.totalCoins, 5);

  // Curva de niveles RF-06: 100 * N^1.2
  assert.equal(App.GamificationContext.xpRequiredForLevelStep(1), 100);
  assert.equal(App.GamificationContext.xpRequiredForLevelStep(2), Math.round(100 * Math.pow(2, 1.2)));
  assert.equal(App.GamificationContext.calculateLevelFromXp(350), 3);

  // Control de rachas RF-07: Día consecutivo incrementa +1
  const nextStreak = App.GamificationContext.updateStreakOnTaskCompletion(
    { streakDays: 4, lastActiveDate: '2026-10-22' },
    '2026-10-23T15:00:00.000Z'
  );
  assert.equal(nextStreak.streakDays, 5);

  // Más de 48 horas sin cerrar tareas reinicia racha a 0
  const resetStreak = App.GamificationContext.evaluateStreakOnInactivity(
    { streakDays: 5, lastActiveDate: '2026-10-20' },
    '2026-10-23T12:00:00.000Z'
  );
  assert.equal(resetStreak.streakDays, 0);
});

test('RF-08, RF-09 & RF-10: 5 Capas SVG, Catálogo de 15 Sprites Modulares y Reacciones del Buddy', () => {
  const catalog = App.BuddyContext.getCatalog();
  assert.equal(catalog.length, 15, 'El catálogo debe incluir exactamente 15 sprites modulares');

  const layersPresent = new Set(catalog.map(s => s.layer));
  assert.deepEqual(Array.from(layersPresent), ['base', 'body', 'head', 'hand', 'aura']);

  const storage = createMemoryStorage();
  const store = App.createAppStore(storage);

  // Completamos una tarea de Esfuerzo 3 a tiempo para obtener 25 monedas
  const t = store.dispatch({
    type: 'CREATE_TASK',
    payload: { title: 'Ganar monedas para tienda', category: 'Operación', priority: 'Urgente', effort: 3, deadline: '2026-10-25' }
  }).task;
  store.dispatch({ type: 'MOVE_TASK', id: t.id, targetStatus: 'done', nowISO: '2026-10-23T10:00:00.000Z' });
  assert.equal(store.getState().user.coins, 25);

  // Compra válida en la tienda (head_cap cuesta 25 monedas, nivel mín 1)
  const buyRes = store.dispatch({ type: 'BUY_SPRITE', spriteId: 'head_cap' });
  assert.equal(buyRes.success, true);
  assert.equal(store.getState().user.coins, 0);
  assert.equal(store.getState().buddy.equipped.head, 'head_cap');

  // Micro-reacción de estrés cuando existe tarea vencida en En Proceso (RF-10)
  const overdueTask = store.dispatch({
    type: 'CREATE_TASK',
    payload: { title: 'Tarea en proceso con fecha vencida', category: 'Cliente', priority: 'Alta', effort: 2, deadline: '2026-10-25' }
  }).task;
  store.dispatch({ type: 'MOVE_TASK', id: overdueTask.id, targetStatus: 'in_progress', nowISO: '2026-10-23T10:00:00.000Z' });
  const stressed = App.BuddyContext.hasOverdueTasksInProgress(store.getState(), '2026-10-30');
  assert.equal(stressed, true);
});

test('RF-11, RF-12, RF-13 & RF-14 + Matriz de Trazabilidad (Aislamiento, Idempotencia y Portabilidad)', () => {
  const storage = createMemoryStorage();
  const store1 = App.createAppStore(storage);

  // Crear y mover una tarea a Completado
  const created = store1.dispatch({
    type: 'CREATE_TASK',
    nowISO: '2026-10-20T09:00:00.000Z',
    payload: {
      title: 'Documentar lineamientos de seguridad',
      category: 'Calidad/Norma',
      priority: 'Alta',
      effort: 2,
      deadline: '2026-10-25'
    }
  });
  const moveDone = store1.dispatch({
    type: 'MOVE_TASK',
    id: created.task.id,
    targetStatus: 'done',
    nowISO: '2026-10-23T18:00:00.000Z'
  });
  assert.equal(moveDone.success, true);
  assert.equal(moveDone.triggeredBounce, true);

  const exportedJson = storage.getItem(App.STORAGE_KEY);
  assert.ok(exportedJson, 'El estado debe estar serializado en localStorage bajo kanban_gamified_v1');

  // Prueba de idempotencia de persistencia: crear segunda instancia leyendo el mismo localStorage
  const store2 = App.createAppStore(storage);
  assert.deepEqual(store2.getState(), store1.getState(), 'Reabrir la sesión debe reproducir exactamente el estado previo');

  // Prueba de portabilidad e importación segura (RF-13)
  const corruptImport = store2.dispatch({
    type: 'IMPORT_STATE_JSON',
    payload: '{"version": "1.0.0", "user": null}'
  });
  assert.equal(corruptImport.success, false, 'Debe rechazar JSON con esquema inválido sin corromper la memoria');

  // Exportación CSV (RF-14)
  const csv = App.PersistenceContext.generateProductivityCsv(store2.getState());
  const lines = csv.split('\n');
  assert.equal(lines[0], 'ID,Título,Categoría,Prioridad,Fecha_Terminación,XP_Generado');
  assert.match(lines[1], /^tsk_[a-z0-9]+,Documentar lineamientos de seguridad,Calidad\/Norma,Alta,2026-10-23T18:00:00\.000Z,45$/);
});

test('CR-01 (RF-15 & RF-16): Revisión horaria, seguimiento de permanencia en En Proceso y notificación visual', () => {
  const storage = createMemoryStorage();
  const store = App.createAppStore(storage, '2026-10-23T10:00:00.000Z');

  // Crear nueva tarea y moverla a En Proceso a las 10:15
  const created = store.dispatch({
    type: 'CREATE_TASK',
    nowISO: '2026-10-23T10:10:00.000Z',
    payload: {
      title: 'Optimizar consultas locales',
      category: 'Operación',
      priority: 'Alta',
      effort: 2,
      deadline: '2026-10-26'
    }
  });
  store.dispatch({
    type: 'MOVE_TASK',
    id: created.task.id,
    targetStatus: 'in_progress',
    nowISO: '2026-10-23T10:15:00.000Z'
  });

  const movedTask = store.getState().tasks.find(t => t.id === created.task.id);
  assert.equal(movedTask.inProgressSince, '2026-10-23T10:15:00.000Z', 'RF-15: Debe registrar inProgressSince al entrar a En Proceso');

  // A las 10:45 (30 min desde lastHourlyCheckAt=10:00) aún no debe disparar la notificación horaria automática
  const earlyCheck = store.dispatch({
    type: 'RUN_HOURLY_CHECK',
    nowISO: '2026-10-23T10:45:00.000Z'
  });
  assert.equal(earlyCheck.isHourDue, false);
  assert.equal(earlyCheck.shouldNotify, false);

  // Simular cierre y reapertura del archivo HTML a las 11:30 (>= 60 min desde 10:00) leyendo desde localStorage
  const reopenedStore = App.createAppStore(storage);
  const dueCheck = reopenedStore.dispatch({
    type: 'RUN_HOURLY_CHECK',
    nowISO: '2026-10-23T11:30:00.000Z'
  });
  assert.equal(dueCheck.isHourDue, true, 'RF-15: Debe detectar que transcurrió >= 1 hora al reabrir o por temporizador');
  assert.equal(dueCheck.shouldNotify, true, 'RF-16: Debe notificar porque existen tareas en En Proceso');
  assert.equal(dueCheck.tasksInProcess.length, 1, 'RF-16: Debe incluir todas las tareas actuales en En Proceso');

  const trackedItem = dueCheck.tasksInProcess.find(t => t.id === created.task.id);
  assert.equal(trackedItem.duration.formatted, '1h 15m', 'RF-16: Debe calcular con exactitud el tiempo que lleva en En Proceso');
  assert.equal(reopenedStore.getState().settings.lastHourlyCheckAt, '2026-10-23T11:30:00.000Z', 'RF-15: Debe persistir el nuevo lastHourlyCheckAt');
});

test('CR-02 (RF-17 & RF-18): Versión de producción sin botones de depuración e inicio en cero (Clean Slate)', () => {
  const storage = createMemoryStorage();
  const store = App.createAppStore(storage, '2026-10-23T10:00:00.000Z');
  const state = store.getState();

  assert.equal(state.user.xp, 0, 'RF-18: El usuario debe iniciar con 0 XP');
  assert.equal(state.user.level, 1, 'RF-18: El usuario debe iniciar en Nivel 1');
  assert.equal(state.user.coins, 0, 'RF-18: El usuario debe iniciar con 0 Monedas');
  assert.equal(state.user.streakDays, 0, 'RF-18: El usuario debe iniciar con 0 días de racha');
  assert.equal(state.user.lastActiveDate, null, 'RF-18: El usuario no debe tener fecha previa de actividad');
  assert.equal(state.tasks.length, 0, 'RF-18: El tablero debe iniciar con 0 tareas precargadas');

  // RF-17: La interfaz HTML no debe incluir los botones de prueba ni el modal de auto-test
  assert.equal(htmlContent.includes('id="btnRunSelfTests"'), false, 'RF-17: No debe existir el botón 🧪 Verificar (Tests)');
  assert.equal(htmlContent.includes('id="btnHourlyReviewCheck"'), false, 'RF-17: No debe existir el botón manual ⏱️ Revisión 1h');
  assert.equal(htmlContent.includes('id="modalSelfTests"'), false, 'RF-17: No debe existir el modal de diagnóstico de pruebas');

  // Verificar que la suite embebida siga pasando al 100% programáticamente
  const embeddedReport = App.runEmbeddedTestSuite();
  assert.equal(embeddedReport.failed, 0, 'La suite embebida debe pasar con 0 fallos');
});


