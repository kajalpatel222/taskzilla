'use strict';

const Anthropic = require('@anthropic-ai/sdk');

function requireApiKey() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      'Error: ANTHROPIC_API_KEY is not set. Add it to a .env file in the project root, e.g.\n' +
      '  ANTHROPIC_API_KEY=sk-ant-...'
    );
    process.exit(1);
  }
}

function createClient() {
  return new Anthropic();
}

function reportApiError(err) {
  if (err instanceof Anthropic.AuthenticationError) {
    console.error('Error: Anthropic API rejected the key. Check ANTHROPIC_API_KEY in your .env file.');
  } else if (err instanceof Anthropic.APIConnectionError) {
    console.error('Error: could not reach the Anthropic API. Check your network connection.');
  } else if (err instanceof Anthropic.APIError) {
    console.error(`Error: Anthropic API request failed (${err.status}): ${err.message}`);
  } else {
    console.error('Error: unexpected failure calling the Anthropic API.');
  }
}

module.exports = { requireApiKey, createClient, reportApiError };
