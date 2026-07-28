'use strict';

const addTaskTool = require('./add-task');
const listTasksTool = require('./list-tasks');
const completeTaskTool = require('./complete-task');
const deleteTaskTool = require('./delete-task');
const getStatsTool = require('./get-stats');

const TOOLS = [addTaskTool, listTasksTool, completeTaskTool, deleteTaskTool, getStatsTool];

module.exports = { TOOLS };
