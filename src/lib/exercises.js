"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExercisesFile = parseExercisesFile;
exports.resolveDataPath = resolveDataPath;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
function parseBlock(block) {
    var lines = block.split(/\r?\n/);
    var id = '';
    var practica = 1;
    var title = '';
    var prompt = '';
    var expectedSolution = '';
    var tags = [];
    var mode = 'none';
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var rawLine = lines_1[_i];
        var line = rawLine.trimEnd();
        if (mode === 'prompt') {
            if (line.startsWith('expected_solution:')) {
                mode = 'expected';
                continue;
            }
            if (line === '---') {
                mode = 'none';
                continue;
            }
            prompt += (prompt ? '\n' : '') + rawLine;
            continue;
        }
        if (mode === 'expected') {
            if (line === '---') {
                mode = 'none';
                continue;
            }
            expectedSolution += (expectedSolution ? '\n' : '') + rawLine;
            continue;
        }
        if (line.startsWith('id:')) {
            id = line.slice(3).trim();
        }
        else if (line.startsWith('practica:')) {
            var num = parseInt(line.slice(9).trim(), 10);
            if (!isNaN(num))
                practica = num;
        }
        else if (line.startsWith('title:')) {
            title = line.slice(6).trim();
        }
        else if (line.startsWith('tags:')) {
            var m = line.match(/\[(.*)\]/);
            if (m && m[1]) {
                tags = m[1].split(',').map(function (s) { return s.replace(/[\[\]\s]/g, ''); }).filter(Boolean);
            }
        }
        else if (line.startsWith('prompt:')) {
            mode = 'prompt';
        }
        else if (line.startsWith('expected_solution:')) {
            mode = 'expected';
        }
    }
    if (!id || !title || !prompt || !expectedSolution)
        return null;
    return { id: id, practica: practica, title: title, prompt: prompt.replace(/^\|\s*/, '').trim(), expectedSolution: expectedSolution.replace(/^\|\s*/, '').trim(), tags: tags };
}
function parseExercisesFile(filePath) {
    var content = node_fs_1.default.readFileSync(filePath, 'utf8');
    var sections = content.split(/\n---\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    var results = [];
    for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
        var sec = sections_1[_i];
        var ex = parseBlock(sec);
        if (ex)
            results.push(ex);
    }
    return results;
}
function resolveDataPath() {
    var projectRoot = node_path_1.default.resolve(process.cwd());
    return node_path_1.default.join(projectRoot, 'data', 'exercises.txt');
}
