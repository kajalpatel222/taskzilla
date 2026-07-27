#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const TASKS_FILE = path.join(__dirname, 'tasks.json');
const STATS_FILE = path.join(__dirname, 'stats.json');

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

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

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks yet. Add one with: todo add <text>');
    return;
  }
  for (const task of tasks) {
    const box = task.done ? '[x]' : '[ ]';
    console.log(`${box} ${task.id}  ${task.text}`);
  }
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

function showStats() {
  const stats = loadStats();
  console.log(`Rank: ${getRank(stats.completedCount)}`);
  console.log(`Tasks completed all-time: ${stats.completedCount}`);
}

async function suggestTask() {
  const tasks = loadTasks().filter((t) => !t.done);
  if (tasks.length === 0) {
    console.log("No pending tasks — you're all caught up! 🦖");
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      'Error: ANTHROPIC_API_KEY is not set. Add it to a .env file in the project root, e.g.\n' +
      '  ANTHROPIC_API_KEY=sk-ant-...'
    );
    process.exit(1);
  }

  const client = new Anthropic();
  const taskList = tasks.map((t) => `- ${t.text}`).join('\n');

  try {
    const response = await client.messages.create(
      {
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        system:
          'You are Taskzilla, a friendly monster that helps people pick their next to-do. ' +
          'Given a list of pending tasks, pick exactly one and explain why in one playful, ' +
          'monster-themed sentence. Be concise — no preamble, no markdown, just the pick and the reason.',
        messages: [{ role: 'user', content: `Pending tasks:\n${taskList}` }],
      },
      { timeout: 15000 }
    );
    const text = response.content.find((b) => b.type === 'text')?.text ?? '';
    console.log(`🦖 Taskzilla says: ${text}`);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      console.error('Error: Anthropic API rejected the key. Check ANTHROPIC_API_KEY in your .env file.');
    } else if (err instanceof Anthropic.APIConnectionError) {
      console.error('Error: could not reach the Anthropic API. Check your network connection.');
    } else if (err instanceof Anthropic.APIError) {
      console.error(`Error: Anthropic API request failed (${err.status}): ${err.message}`);
    } else {
      console.error('Error: unexpected failure calling the Anthropic API.');
    }
    process.exit(1);
  }
}

function deleteTask(rawId) {
  const id = parseId(rawId);
  const tasks = loadTasks();
  const task = findTaskOrExit(tasks, id);
  const remaining = tasks.filter((t) => t.id !== id);
  saveTasks(remaining);
  console.log(`Deleted task ${id}: ${task.text}`);
}

function printUsage() {
  console.log(`Taskzilla - a lightweight command-line to-do list manager

Usage:
  todo add <text>     Add a new task
  todo list           List all tasks
  todo done <id>      Mark a task as done
  todo delete <id>    Delete a task
  todo stats          Show your all-time completion count and rank
  todo suggest        Ask Taskzilla (Claude) which pending task to do next
  todo help           Show this help message`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case 'add':
      addTask(rest.join(' '));
      break;
    case 'list':
      listTasks();
      break;
    case 'done':
      completeTask(rest[0]);
      break;
    case 'delete':
      deleteTask(rest[0]);
      break;
    case 'stats':
      showStats();
      break;
    case 'suggest':
      await suggestTask();
      break;
    case 'help':
    case undefined:
      printUsage();
      break;
    default:
      console.error(`Error: unknown command "${command}".\n`);
      printUsage();
      process.exit(1);
  }
}

main();
