export {};

type Post = {
  number: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  url: string;
};

const input = document.querySelector<HTMLInputElement>('#command-input')!;
const form = document.querySelector<HTMLFormElement>('#terminal-form')!;
const output = document.querySelector<HTMLElement>('#terminal-output')!;
const posts: Post[] = JSON.parse(document.querySelector('#terminal-data')!.textContent!);
const sections: Record<string, { url: string; description: string }> = {
  writings: { url: '/posts/', description: 'Notes on technology, life, and everything in between.' },
  projects: { url: '/projects/', description: 'Things I build and the tools I make my own.' },
  resume: { url: '/resume/', description: 'My profile and interests, in Markdown.' },
  contact: { url: '/contact/', description: 'Find me on GitHub and X.' },
  about: { url: '/about/', description: 'The person behind LostLand.' },
};
const commands: Record<string, string> = {
  help: 'Show this command reference',
  ls: 'List the places you can explore',
  writings: 'List posts · writings [category or tag]',
  projects: 'Explore my projects',
  resume: 'Read my profile',
  contact: 'Find a way to say hello',
  about: 'A little about me',
  tags: 'Browse writing topics',
  search: 'Find posts · search <words>',
  open: 'Visit a page · open <post number, slug, or section>',
  history: 'Show commands from this session',
  clear: 'Clear the command output',
};
const history: string[] = [];
let historyIndex = 0;
let draft = '';

function line(parent: HTMLElement, text: string, className = '') {
  const element = document.createElement('p');
  element.textContent = text;
  element.className = className;
  parent.append(element);
  return element;
}

function link(parent: HTMLElement, label: string, url: string) {
  const element = document.createElement('a');
  element.textContent = label;
  element.href = url;
  if (url.startsWith('https://')) {
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
  }
  parent.append(element);
}

function postList(parent: HTMLElement, matches: Post[]) {
  if (!matches.length) {
    line(parent, 'No matching writings. Try another topic or type writings to see everything.', 'output-note');
    return;
  }
  for (const post of matches) {
    const row = document.createElement('div');
    row.className = 'output-row';
    const number = document.createElement('span');
    number.className = 'output-number';
    number.textContent = String(post.number).padStart(2, '0');
    row.append(number);
    link(row, post.title, post.url);
    const meta = document.createElement('span');
    meta.className = 'output-note';
    meta.textContent = `${post.date} / ${post.category}`;
    row.append(meta);
    parent.append(row);
  }
  line(parent, 'Click a title, or type open <number> to read it. All writings → /posts/', 'output-note');
  link(parent, 'Browse the archive →', '/posts/');
}

function execute(raw: string) {
  const value = raw.trim();
  if (!value) return;
  history.push(value);
  historyIndex = history.length;
  draft = '';
  input.value = '';
  const [first, ...rest] = value.split(/\s+/);
  const command = first.toLowerCase();
  const argument = rest.join(' ');
  const entry = document.createElement('div');
  entry.className = 'output-entry';
  line(entry, `guest@lostland:~$ ${value}`, 'output-command');
  output.append(entry);

  switch (command) {
    case 'help':
      line(entry, 'Not a real shell. No commands run on your computer.', 'output-note');
      for (const [name, description] of Object.entries(commands)) {
        line(entry, `${name.padEnd(10)} ${description}`);
      }
      line(entry, 'Tab completes commands and open targets. ↑ / ↓ recall history. Ctrl+L clears output.', 'output-note');
      break;
    case 'ls':
      for (const [name, section] of Object.entries(sections)) {
        const row = line(entry, '', 'output-row');
        link(row, `${name}/`, section.url);
        row.append(document.createTextNode(section.description));
      }
      break;
    case 'writings': {
      const topic = argument.toLowerCase();
      const matches = topic ? posts.filter(post => post.category.toLowerCase() === topic || post.tags.some(tag => tag.toLowerCase() === topic)) : posts;
      line(entry, topic ? `Writings filed under “${argument}”` : 'Writings / newest first', 'output-note');
      postList(entry, matches);
      break;
    }
    case 'search': {
      if (!argument) {
        line(entry, 'Usage: search <words> — for example, search neovim', 'output-note');
        break;
      }
      const terms = argument.toLowerCase().split(/\s+/);
      const matches = posts.filter(post => {
        const text = [post.title, post.description, post.category, ...post.tags].join(' ').toLowerCase();
        return terms.every(term => text.includes(term));
      });
      line(entry, `Search results for “${argument}”`, 'output-note');
      postList(entry, matches);
      break;
    }
    case 'tags': {
      const tags = [...new Set(posts.flatMap(post => post.tags))].sort();
      for (const tag of tags) {
        const row = line(entry, '', 'output-row');
        link(row, `#${tag}`, `/tags/${encodeURIComponent(tag)}/`);
        row.append(document.createTextNode(` — ${posts.filter(post => post.tags.includes(tag)).length} writings`));
      }
      if (!tags.length) line(entry, 'No tags yet. Browse writings instead.', 'output-note');
      break;
    }
    case 'projects':
      line(entry, 'Projects / tools I make my own', 'output-note');
      link(line(entry, '', 'output-row'), 'Neovim configuration ↗', 'https://github.com/masterj122517/nvim');
      link(line(entry, '', 'output-row'), 'LostLand · this personal blog ↗', 'https://github.com/masterj122517/masterj122517.github.io');
      link(entry, 'Read project notes →', sections.projects.url);
      break;
    case 'resume':
    case 'about':
      line(entry, sections[command].description, 'output-note');
      link(entry, command === 'resume' ? 'Read my profile →' : 'About MasterJ →', sections[command].url);
      break;
    case 'contact':
      line(entry, 'Say hello. These are my public corners of the internet.', 'output-note');
      link(line(entry, '', 'output-row'), 'GitHub · masterj122517 ↗', 'https://github.com/masterj122517/');
      link(line(entry, '', 'output-row'), 'X · @MasterJ122517 ↗', 'https://x.com/MasterJ122517');
      link(entry, 'Contact page →', sections.contact.url);
      break;
    case 'open': {
      const target = argument.replace(/^\.\//, '').replace(/\/$/, '');
      const section = sections[target.toLowerCase()];
      const post = posts.find(post => post.slug === target || (/^\d+$/.test(target) && post.number === Number(target)));
      if (section || post) {
        window.location.assign(section?.url ?? post!.url);
      } else {
        line(entry, argument ? `No page named “${argument}”. Use writings or ls to see available pages.` : 'Usage: open <post number, slug, or section> — try open 1 or open projects', 'output-note');
      }
      break;
    }
    case 'history':
      history.forEach((value, index) => line(entry, `${String(index + 1).padStart(2, '0')}  ${value}`));
      break;
    case 'clear':
      output.replaceChildren();
      break;
    default:
      line(entry, `Command not found: ${first}. Type help for available commands.`, 'output-note');
  }
  output.scrollTop = output.scrollHeight;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  execute(input.value);
  input.focus({ preventScroll: true });
});

input.addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (event.ctrlKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    output.replaceChildren();
    return;
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    if (!history.length) return;
    event.preventDefault();
    if (historyIndex === history.length) draft = input.value;
    historyIndex = event.key === 'ArrowUp' ? Math.max(0, historyIndex - 1) : Math.min(history.length, historyIndex + 1);
    input.value = historyIndex === history.length ? draft : history[historyIndex];
    input.setSelectionRange(input.value.length, input.value.length);
    return;
  }
  if (event.key !== 'Tab' || event.shiftKey || !input.value.trim()) return;
  const value = input.value.trimStart();
  const isOpen = /^open\s+/i.test(value);
  const candidates = isOpen ? [...Object.keys(sections), ...posts.map(post => post.slug), ...posts.map(post => String(post.number))] : Object.keys(commands);
  const prefix = isOpen ? value.replace(/^open\s+/i, '') : value;
  const matches = candidates.filter(candidate => candidate.startsWith(prefix.toLowerCase()));
  if (!matches.length) return;
  event.preventDefault();
  if (matches.length === 1) {
    input.value = `${isOpen ? 'open ' : ''}${matches[0]} `;
  } else {
    let common = matches[0];
    for (const match of matches.slice(1)) {
      while (!match.startsWith(common)) common = common.slice(0, -1);
    }
    input.value = `${isOpen ? 'open ' : ''}${common}`;
    const entry = document.createElement('div');
    entry.className = 'output-entry';
    line(entry, matches.join('  '), 'output-note');
    output.append(entry);
    output.scrollTop = output.scrollHeight;
  }
});

for (const shortcut of document.querySelectorAll<HTMLAnchorElement>('[data-command]')) {
  shortcut.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    execute(shortcut.dataset.command!);
    input.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
}

// Keep touch keyboards closed until the visitor chooses to type.
if (window.matchMedia('(min-width: 761px) and (pointer: fine)').matches) {
  input.focus({ preventScroll: true });
}
