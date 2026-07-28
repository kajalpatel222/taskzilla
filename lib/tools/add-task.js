'use strict';

const { addTask } = require('../store');

module.exports = {
  name: 'add_task',
  description: 'Add a new task to the to-do list.',
  input_schema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The task text to add.' },
    },
    required: ['text'],
  },
  run: (input) => {
    const text = typeof input.text === 'string' ? input.text.trim() : '';
    if (!text) return false;
    addTask(text);
    return true;
  },
};
