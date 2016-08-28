/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:rehype
 * @fileoverview Bridge / mutate from remark to rehype.
 */

'use strict';

/* Dependencies */
var mdast2hast = require('mdast-util-to-hast');

/* Expose. */
module.exports = attacher;

/* Attacher.
 * If a destination is given, runs the destination with
 * the new HAST tree (bridge-mode).
 * Without destination, returns the HAST tree: further
 * plug-ins run on that tree (mutate-mode). */
function attacher(origin, destination) {
  return destination ? bridge(destination) : mutate;
}

/* Bridge-mode.  Runs the destination with the new HAST
 * tree. */
function bridge(destination) {
  return function (node, file, next) {
    destination.run(mdast2hast(node), file, function (err) {
      next(err);
    });
  };
}

/* Mutate-mode.  Further transformers run on the HAST tree. */
function mutate(node) {
  return mdast2hast(node);
}
