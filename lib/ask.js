'use strict';

const { requireApiKey, createClient, reportApiError } = require('./anthropic-client');
const { TOOLS } = require('./tools');

const SYSTEM_PROMPT =
  'You are Taskzilla, a friendly monster that manages a to-do list on behalf of the user. ' +
  "Use the provided tools to carry out the user's request. You may call multiple tools, " +
  'including several in sequence, to fully satisfy it — for example, call list_tasks first ' +
  "if you need a task's id before completing or deleting it. " +
  'When finished, reply with a short, playful, monster-themed sentence confirming what you did. ' +
  'When the user asked to see their task list, show it using the exact format list_tasks returns ' +
  '([x]/[ ] lines, one per task) — you may add a brief playful intro line before it, but do not ' +
  'reformat, reword, or summarize the list itself. ' +
  "If the request doesn't involve any of your tools, reply in one playful sentence explaining " +
  "what you can currently help with. Don't ask clarifying questions — make a reasonable choice and act.";

async function askTask(query) {
  if (!query || !query.trim()) {
    console.error('Error: ask requires a request. Usage: todo ask "<request>"');
    process.exit(1);
  }

  requireApiKey();
  const client = createClient();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const finalMessage = await client.beta.messages.toolRunner(
      {
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        max_iterations: 8,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: [{ role: 'user', content: query }],
      },
      { signal: controller.signal }
    );
    const text = finalMessage.content.find((b) => b.type === 'text')?.text ?? '';
    console.log(`🦖 Taskzilla says: ${text}`);
  } catch (err) {
    reportApiError(err);
    process.exit(1);
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { askTask };
