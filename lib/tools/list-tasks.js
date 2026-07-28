'use strict';

const { betaTool } = require('@anthropic-ai/sdk/helpers/beta/json-schema');
const { renderTasks, loadTasks } = require('../store');

module.exports = betaTool({
  name: 'list_tasks',
  description: 'List all tasks with their id, done status, and text. Call this first if you need a task id.',
  inputSchema: { type: 'object', properties: {} },
  run: () => renderTasks(loadTasks()),
});
