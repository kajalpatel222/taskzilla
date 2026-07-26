#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

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
  task.done = true;
  saveTasks(tasks);
  console.log(`Marked task ${id} as done: ${task.text}`);
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
  todo help           Show this help message`);
}

function main() {
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
