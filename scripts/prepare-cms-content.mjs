// Export only the existing public content and the explicitly approved November poster.
// No local accounts, audit logs, revisions or unrelated test materials are exported.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';

function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(p => {
    assert.ok(ts.isPropertyAssignment(p));
    return [p.name.text, literal(p.initializer)];
  }));
  throw new Error('Expected literal public content');
}
function baseline(kind, file) {
  const source = execFileSync('git', ['show', `master:${file}`], { encoding: 'utf8' });
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let result;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === kind) result = literal(node.initializer);
    ts.forEachChild(node, visit);
  }
  visit(ast); assert.ok(Array.isArray(result)); return result;
}
const data = JSON.parse(readFileSync('cms/seed.json', 'utf8'));
for (const [kind, file] of [['news', 'sections/News.tsx'], ['events', 'sections/Events.tsx']]) {
  const clean = items => items.map(({ layout: _layout, ...item }) => item);
  assert.deepEqual(clean(data[kind]), clean(baseline(kind, file)), `${kind}: seed differs from master; review before importing`);
}
const response = await fetch('http://127.0.0.1:8081/content/current.json');
assert.ok(response.ok);
const local = await response.json();
const matches = local.events.filter(e => e.title === 'Первенство, чемпионат и фестиваль городского округа Лобня' && e.startDate === '2026-11-21');
assert.equal(matches.length, 1, 'Expected exactly one approved November event');
const poster = matches[0];
assert.equal(poster.layout, 'poster');
assert.match(poster.image, /^\/media\/[a-f0-9]{32}\.jpg$/);
mkdirSync('deployment-bundle/media', { recursive: true });
const photo = await fetch(`http://127.0.0.1:8081${poster.image}`);
assert.ok(photo.ok); writeFileSync(`deployment-bundle${poster.image}`, Buffer.from(await photo.arrayBuffer()));
const { id: _id, ...event } = poster;
data.events.push(event);
writeFileSync('deployment-bundle/content.json', JSON.stringify(data, null, 2) + '\n');
console.log(`Prepared ${data.news.length} existing news, ${data.events.length - 1} existing events and the November 21 poster. No local accounts or test records.`);
