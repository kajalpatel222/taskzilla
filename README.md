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
| `ask <request>` | Ask Taskzilla to add, list, complete, or delete tasks, or check your stats, via natural language |
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

`todo ask "<request>"` lets Claude add, list, complete, or delete tasks — or check your stats — in natural language, no need to remember exact syntax or task ids:

```
$ todo ask "remind me to call the dentist"
🦖 Taskzilla says: Added "call the dentist" to your list — one more thing to conquer! 🦖

$ todo ask "mark buy milk as done"
🦖 Taskzilla says: 🎉 Taskzilla has chomped down on that milk-buying quest and marked it complete!

$ todo ask "what's on my list?"
🦖 Taskzilla says: Behold, your task list! 🦕

[x] 1  Buy milk
[ ] 2  Write report
```

You don't need to give an exact task id — if Claude needs to figure one out from your description first, it looks it up itself before acting, all within the same command. Claude replies in plain text if your request doesn't match anything it can do. Requires `ANTHROPIC_API_KEY` in `.env` (see Setup above).

## Storage

Tasks are stored in `tasks.json` and your all-time completion stats in `stats.json`, both plain JSON files in the project directory — no database required. Both files are git-ignored so your personal data never gets committed.
