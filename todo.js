#!/usr/bin/env node

'use strict';

const { loadEnvFile } = require('./lib/env');
loadEnvFile(__dirname);

const { addTask, listTasks, completeTask, deleteTask, showStats } = require('./lib/store');
const { suggestTask } = require('./lib/suggest');
const { askTask } = require('./lib/ask');

function printUsage() {
  console.log(`Taskzilla - a lightweight command-line to-do list manager

Usage:
  todo add <text>     Add a new task
  todo list           List all tasks
  todo done <id>      Mark a task as done
  todo delete <id>    Delete a task
  todo stats          Show your all-time completion count and rank
  todo suggest        Ask Taskzilla (Claude) which pending task to do next
  todo ask <request>  Ask Taskzilla to add/list tasks via natural language (more coming soon)
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
    case 'ask':
      await askTask(rest.join(' '));
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
