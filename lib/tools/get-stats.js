'use strict';

const { betaTool } = require('@anthropic-ai/sdk/helpers/beta/json-schema');
const { renderStats, loadStats } = require('../store');

module.exports = betaTool({
  name: 'get_stats',
  description: "Get the user's all-time completed task count and rank.",
  inputSchema: { type: 'object', properties: {} },
  run: () => renderStats(loadStats()),
});
