# taskzilla

Taskzilla is a lightweight command-line to-do list manager built in JavaScript. Add tasks, mark them done, and delete the ones you've conquered, all from your terminal, no database, no dependencies, no fuss. Built as a hands-on project to practice CLI development and git workflow while stomping through a task list one command at a time.

## Requirements

- Node.js (no external packages needed — pure Node built-ins)

## Usage

Run directly with Node:

```bash
node todo.js add "Buy milk"
node todo.js list
node todo.js done 1
node todo.js delete 1
node todo.js help
```

Or install it as a global `todo` command:

```bash
npm link
todo add "Buy milk"
todo list
```

## Commands

| Command             | Description                     |
| -------------------- | -------------------------------- |
| `add <text>`   | Add a new task                    |
| `list`         | List all tasks with their status  |
| `done <id>`    | Mark a task as done                |
| `delete <id>`  | Delete a task                      |
| `help`         | Show usage information              |

## Storage

Tasks are stored in `tasks.json` in the project directory as plain JSON — no database required. This file is git-ignored so your personal task list never gets committed.
