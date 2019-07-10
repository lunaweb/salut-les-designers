/**
 * REQUIREMENTS
 */
const del    = require('del');

const config = require('../config').clean;

if (!config) return;

/**
 * TASKS
 */

// Delete files
const clean = () => del(config.src);

/**
 * EXPORTS
 */
exports.default = clean;
