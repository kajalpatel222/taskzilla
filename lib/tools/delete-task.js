'use strict';

const { betaTool } = require('@anthropic-ai/sdk/helpers/beta/json-schema');
const { ToolError } = require('@anthropic-ai/sdk/lib/tools/ToolError');
const { deleteTask } = require('../store');

module.exports = betaTool({
  name: 'delete_task',
  description: 'Delete a task by its numeric id (use list_tasks to find the id).',
  inputSchema: {
    type: 'object',
    properties: {
      id: { type: 'integer', description: 'The task id.' },
    },
    required: ['id'],
  },
  run: ({ id }) => {
    const result = deleteTask(String(id));
    if (!result.ok) throw new ToolError(result.message);
    return result.message;
  },
});
