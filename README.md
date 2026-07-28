# taskzilla

Taskzilla is a lightweight command-line to-do list manager built in JavaScript. Add tasks, mark them done, and delete the ones you've conquered, all from your terminal, no database, no fuss. Built as a hands-on project to practice CLI development and git workflow while stomping through a task list one command at a time.

## Requirements

- Node.js
- Run `npm install` to pull in `@anthropic-ai/sdk` (used by the `suggest` and `ask` commands)

## Setup

The `suggest` and `ask` commands call the Claude API, which needs an API key. Create a `.env` file in the project root (it's git-ignored, so your key is never committed):

```
ANTHROPIC_API_KEY=sk-ant-...
```

No API key is needed for any other command.

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
| `suggest`      | Ask Taskzilla (Claude) which pending task to do next |
| `ask <request>` | Ask Taskzilla to add or list tasks via natural language |
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

## Suggest

Not sure what to tackle next? `todo suggest` sends your pending tasks to Claude and gets back a playful, Taskzilla-voiced pick:

```
$ todo suggest
🦖 Taskzilla says: Crush "Buy milk" first — even a monster needs breakfast before conquering the rest of the list.
```

Requires `ANTHROPIC_API_KEY` in `.env` (see Setup above). If you have no pending tasks, it skips the API call entirely.

## Ask

`todo ask "<request>"` lets Claude add or list tasks for you, in natural language — no need to remember exact command syntax:

```
$ todo ask "remind me to call the dentist"
Added task 4: call the dentist

$ todo ask "what's on my list?"
[ ] 1  Buy milk
[ ] 4  call the dentist
```

Claude decides which action fits your request (or replies in plain text if neither applies) — you don't have to phrase it as a command. Marking tasks done or deleting them via `ask` isn't supported yet; use `todo done <id>` / `todo delete <id>` for those. Requires `ANTHROPIC_API_KEY` in `.env` (see Setup above).

## Storage

Tasks are stored in `tasks.json` and your all-time completion stats in `stats.json`, both plain JSON files in the project directory — no database required. Both files are git-ignored so your personal data never gets committed.
