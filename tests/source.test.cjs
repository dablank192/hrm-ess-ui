const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { parse } = require('parse5');

const root = path.resolve(__dirname, '..');
const files = ['index.html'];
for (const directory of ['features', 'shared', 'assets', 'data', 'scripts']) {
  for (const entry of fs.readdirSync(path.join(root, directory), { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) files.push(path.relative(root, path.join(entry.parentPath || entry.path, entry.name)).replaceAll('\\', '/'));
  }
}

test('CI-01: runtime and tool JavaScript parses', () => {
  for (const file of files.filter(file => /\.(c?js)$/.test(file))) {
    const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${file}\n${result.stderr}`);
  }
});

test('CI-02: local HTML and CSS resource references exist', () => {
  const missing = [];
  for (const file of files.filter(file => /\.(html|css)$/.test(file))) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    let base = new URL(file, 'http://prototype.test/');
    const references = [];
    if (file.endsWith('.html')) {
      const document = parse(source);
      const walk = node => {
        const attributes = Object.fromEntries((node.attrs || []).map(attribute => [attribute.name, attribute.value]));
        if (node.tagName === 'base' && attributes.href) base = new URL(attributes.href, base);
        for (const name of ['src', 'href', 'poster']) {
          if (node.tagName !== 'base' && attributes[name]) references.push(attributes[name]);
        }
        if (node.tagName === 'script' && !attributes.src) {
          new vm.Script((node.childNodes || []).map(child => child.value || '').join(''), { filename: file });
        }
        for (const child of node.childNodes || []) walk(child);
        if (node.content) walk(node.content);
      };
      walk(document);
    }
    for (const match of source.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) references.push(match[1]);
    for (const reference of references) {
      if (reference.startsWith('#')) continue;
      const url = new URL(reference, base);
      if (url.origin !== 'http://prototype.test') continue;
      let target = path.join(root, decodeURIComponent(url.pathname));
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) missing.push(`${file}: ${reference}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('CI-03: generated iframe markup matches all three source documents', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'data/embedded-pages.js'), 'utf8'), context);
  const pages = context.window.essEmbeddedPages;
  for (const [relative, actual] of [
    ['features/employee-profile/forms/index.html', pages.profileForm],
    ['features/tickets/shared/employee/index.html', pages.tickets.employee],
    ['features/tickets/shared/manager/index.html', pages.tickets.manager]
  ]) {
    assert.equal(actual.replaceAll('\r\n', '\n'), fs.readFileSync(path.join(root, relative), 'utf8').replaceAll('\r\n', '\n'), `${relative}: run node scripts/prepare-local.cjs`);
  }
});
