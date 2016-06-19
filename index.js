/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:rehype
 * @fileoverview Bridge / mutate from remark to rehype.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies */
var mdast2hast = require('mdast-util-to-hast');

/**
 * Mutate-mode.  Further transformers run on the HAST tree.
 *
 * @param {MDASTNode} node - Tree.
 * @return {HASTNode} - Tree.
 */
function mutate(node) {
    return mdast2hast(node);
}

/**
 * Bridge-mode.  Runs the destination with the new HAST
 * tree.
 *
 * @param {Unified} destination - Destination processor.
 * @return {Function} - Transformer.
 */
function bridge(destination) {
    return function (node, file, next) {
        destination.run(mdast2hast(node), file, function (err) {
            next(err);
        });
    };
}

/**
 * Attacher.
 * If a destination is given, runs the destination with
 * the new HAST tree (bridge-mode).
 * Without destination, returns the HAST tree: further
 * plug-ins run on that tree (mutate-mode).
 *
 * @param {Unified} origin - Origin processor.
 * @param {Unified} [destination] - Destination processor.
 * @return {Function} - Transformer.
 */
function attacher(origin, destination) {
    return destination ? bridge(destination) : mutate;
}

/* Expose. */
module.exports = attacher;
