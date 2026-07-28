'use strict';

const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');
const STATS_FILE = path.join(__dirname, '..', 'stats.json');

const COMPLETION_MESSAGES = [
  '💥 STOMP! Task crushed: {text}',
  '🦖 Taskzilla obliterates: {text}',
  '🔥 ROAR! Another one bites the dust: {text}',
  '🐾 Task flattened under monstrous claws: {text}',
  '😋 Taskzilla feasts on: {text}',
];

const RANKS = [
  { min: 16, name: 'Kaiju Mode' },
  { min: 6, name: 'Rampaging Zilla' },
  { min: 1, name: 'Baby Zilla' },
  { min: 0, name: 'Egg' },
];

function getRank(completedCount) {
  return RANKS.find((r) => completedCount >= r.min).name;
}

function loadStats() {
  if (!fs.existsSync(STATS_FILE)) {
    return { completedCount: 0 };
  }
  const raw = fs.readFileSync(STATS_FILE, 'utf8').trim();
  if (!raw) {
    return { completedCount: 0 };
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error: ${STATS_FILE} is corrupted and could not be parsed.`);
    process.exit(1);
  }
}

function saveStats(stats) {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2) + '\n');
}

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(TASKS_FILE, 'utf8').trim();
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error: ${TASKS_FILE} is corrupted and could not be parsed.`);
    process.exit(1);
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2) + '\n');
}

function nextId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

function addTask(text) {
  if (!text || !text.trim()) {
    console.error('Error: task text is required. Usage: todo add <text>');
    process.exit(1);
  }
  const tasks = loadTasks();
  const task = {
    id: nextId(tasks),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`Added task ${task.id}: ${task.text}`);
}

function renderTasks(tasks) {
  if (tasks.length === 0) {
    return 'No tasks yet. Add one with: todo add <text>';
  }
  return tasks
    .map((task) => `${task.done ? '[x]' : '[ ]'} ${task.id}  ${task.text}`)
    .join('\n');
}

function listTasks() {
  console.log(renderTasks(loadTasks()));
}

function parseId(raw) {
  const id = Number.parseInt(raw, 10);
  if (!Number.isInteger(id) || String(id) !== String(raw).trim()) {
    console.error(`Error: invalid task id "${raw}".`);
    process.exit(1);
  }
  return id;
}

function findTaskOrExit(tasks, id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.error(`Error: no task found with id ${id}.`);
    process.exit(1);
  }
  return task;
}

function completeTask(rawId) {
  const id = parseId(rawId);
  const tasks = loadTasks();
  const task = findTaskOrExit(tasks, id);
  const stats = loadStats();
  if (!task.done) {
    task.done = true;
    stats.completedCount += 1;
    saveStats(stats);
  }
  saveTasks(tasks);
  const template = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
  console.log(template.replace('{text}', task.text));
  console.log(`Rank: ${getRank(stats.completedCount)} (${stats.completedCount} completed all-time)`);
}

function deleteTask(rawId) {
  const id = parseId(rawId);
  const tasks = loadTasks();
  const task = findTaskOrExit(tasks, id);
  const remaining = tasks.filter((t) => t.id !== id);
  saveTasks(remaining);
  console.log(`Deleted task ${id}: ${task.text}`);
}

function showStats() {
  const stats = loadStats();
  console.log(`Rank: ${getRank(stats.completedCount)}`);
  console.log(`Tasks completed all-time: ${stats.completedCount}`);
}

module.exports = {
  getRank,
  loadStats,
  saveStats,
  loadTasks,
  saveTasks,
  nextId,
  addTask,
  renderTasks,
  listTasks,
  parseId,
  findTaskOrExit,
  completeTask,
  deleteTask,
  showStats,
};
