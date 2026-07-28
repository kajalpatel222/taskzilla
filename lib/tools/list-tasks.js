'use strict';

const { listTasks } = require('../store');

module.exports = {
  name: 'list_tasks',
  description: 'List all tasks with their id, done status, and text.',
  input_schema: { type: 'object', properties: {} },
  run: () => {
    listTasks();
    return true;
  },
};
