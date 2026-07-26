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
| `stats`        | Show your all-time completion count and rank |
| `help`         | Show usage information              |

## Completing tasks

Marking a task done with `todo done <id>` prints a random Taskzilla-flavored message instead of a plain confirmation:

```
$ todo done 1
💥 STOMP! Task crushed: Buy milk
Rank: Baby Zilla (1 completed all-time)
```

## Ranks

Taskzilla tracks how many tasks you've completed all-time and levels you up as you go:

| Tasks completed | Rank              |
| ---------------- | ----------------- |
| 0                 | Egg                |
| 1–5               | Baby Zilla         |
| 6–15              | Rampaging Zilla    |
| 16+               | Kaiju Mode         |

Check your progress anytime with `todo stats`.

## Storage

Tasks are stored in `tasks.json` and your all-time completion stats in `stats.json`, both plain JSON files in the project directory — no database required. Both files are git-ignored so your personal data never gets committed.
