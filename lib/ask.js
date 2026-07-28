'use strict';

const { requireApiKey, createClient, reportApiError } = require('./anthropic-client');
const { TOOLS } = require('./tools');

const SYSTEM_PROMPT =
  'You are Taskzilla, a friendly monster that manages a to-do list. ' +
  "Right now you can add tasks and list existing tasks — call add_task or list_tasks " +
  "as appropriate for the user's request. If the request doesn't involve either of those, " +
  'reply in one playful sentence explaining what you can currently help with.';

async function askTask(query) {
  if (!query || !query.trim()) {
    console.error('Error: ask requires a request. Usage: todo ask "<request>"');
    process.exit(1);
  }

  requireApiKey();
  const client = createClient();

  try {
    const response = await client.messages.create(
      {
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        tools: TOOLS.map(({ name, description, input_schema }) => ({ name, description, input_schema })),
        messages: [{ role: 'user', content: query }],
      },
      { timeout: 15000 }
    );

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (!toolUse) {
      const text = response.content.find((b) => b.type === 'text')?.text ?? "I'm not sure what to do with that yet.";
      console.log(`🦖 Taskzilla says: ${text}`);
      return;
    }

    const tool = TOOLS.find((t) => t.name === toolUse.name);
    if (tool) {
      const handled = tool.run(toolUse.input);
      if (handled === false) {
        console.log("🦖 Taskzilla says: I couldn't quite carry that out — try rephrasing.");
      }
    }
  } catch (err) {
    reportApiError(err);
    process.exit(1);
  }
}

module.exports = { askTask };
