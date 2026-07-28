'use strict';

const { loadTasks } = require('./store');
const { requireApiKey, createClient, reportApiError } = require('./anthropic-client');

async function suggestTask() {
  const tasks = loadTasks().filter((t) => !t.done);
  if (tasks.length === 0) {
    console.log("No pending tasks — you're all caught up! 🦖");
    return;
  }

  requireApiKey();
  const client = createClient();
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
    reportApiError(err);
    process.exit(1);
  }
}

module.exports = { suggestTask };
