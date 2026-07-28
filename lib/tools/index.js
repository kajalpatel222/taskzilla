'use strict';

const addTaskTool = require('./add-task');
const listTasksTool = require('./list-tasks');

const TOOLS = [addTaskTool, listTasksTool];

module.exports = { TOOLS };
