#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [requestedSlug, ...titleParts] = process.argv.slice(2);
const usage = 'Usage: npm run new-post -- <slug> [title]';

if (!requestedSlug) {
  console.error(usage);
  process.exit(1);
}

const slug = requestedSlug.trim();
const validSlug = /^[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*$/;

if (slug !== requestedSlug || !validSlug.test(slug)) {
  console.error('Invalid slug. Use lowercase letters, numbers, hyphens, underscores, and optional /-separated segments.');
  process.exit(1);
}

const title = titleParts.join(' ').trim() || slug
  .split('/')
  .at(-1)
  .split(/[-_]+/)
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDirectory = path.join(repositoryRoot, 'src', 'content', 'blog');
const postDirectory = path.join(blogDirectory, ...slug.split('/'));
const postPath = path.join(postDirectory, 'index.md');
const legacyPostPath = path.join(blogDirectory, ...slug.split('/')) + '.md';
const imagesDirectory = path.join(postDirectory, 'images');

if (existsSync(postDirectory) || existsSync(legacyPostPath)) {
  console.error(`Post already exists: src/content/blog/${slug}`);
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const frontmatter = [
  '---',
  `title: ${JSON.stringify(title)}`,
  `date: ${date}`,
  `slug: ${JSON.stringify(slug)}`,
  '---',
  '',
  '',
].join('\n');

try {
  mkdirSync(postDirectory, { recursive: true });
  mkdirSync(imagesDirectory);
  writeFileSync(postPath, frontmatter, { encoding: 'utf8', flag: 'wx' });
} catch (error) {
  console.error(`Could not create post: ${error.message}`);
  process.exit(1);
}

console.log(`Created: src/content/blog/${slug}/index.md`);
console.log(`Images: src/content/blog/${slug}/images/`);
console.log('Copy article images into that folder, then reference them in Markdown:');
console.log('![Image description](./images/filename.jpg)');
