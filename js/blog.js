// 使用 marked.js 解析 Markdown
const marked = window.marked;

// 检查 marked.js 是否正确加载
if (!marked) {
    console.error('marked.js is not loaded!');
    document.querySelector('.post-grid').innerHTML = '<p>Error: Markdown parser not loaded</p>';
}

// 获取基础路径
function getBasePath() {
    // 获取当前页面的路径
    const path = window.location.pathname;
    // 如果是 GitHub Pages 项目页面，需要添加项目名
    if (path.includes('/masterj122517.github.io/')) {
        return '/masterj122517.github.io';
    }
    return '';
}

// 获取所有博客文章
async function loadPosts() {
    console.log('Loading posts...');
    const posts = [];
    const postFiles = [
        'posts/neovim_journey.md',
        'posts/remaps.md',
        'posts/dream.md',
        'posts/hacking.md',
        'posts/masterjs_tenet.md',
        'posts/learn_rust.md',
        'posts/learn_emacs.md',
        'posts/emacs.md',
        'posts/meditation.md',
    ];

    for (const file of postFiles) {
        let fullPath = '';
        try {
            // 使用相对路径
            fullPath = file;
            console.log(`Fetching ${fullPath}...`);

            // 使用fetch API获取文件内容
            const response = await fetch(fullPath, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            console.log(`Successfully loaded ${file}`);
            const post = parseMarkdownPost(text);
            post.fileName = file.split('/').pop();
            posts.push(post);
        } catch (error) {
            console.error(`Error loading post ${file}:`, error);
            document.querySelector('.post-grid').innerHTML += `
                <article class="post-card error">
                    <h3>Error Loading Post</h3>
                    <p>Failed to load: ${file}</p>
                    <p>Error: ${error.message}</p>
                    <p>Debug info:</p>
                    <ul>
                        <li>Current hostname: ${window.location.hostname}</li>
                        <li>Full URL: ${fullPath}</li>
                        <li>Error details: ${error.stack || error.message}</li>
                    </ul>
                </article>
            `;
        }
    }

    // 按日期排序
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('Posts loaded:', posts);
    return posts;
}

// 解析 Markdown 文章的前置元数据
function parseMarkdownPost(text) {
    console.log('Parsing post...');
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = text.match(frontMatterRegex);

    if (!match) {
        console.warn('No front matter found in post');
        return {
            title: 'Untitled',
            date: new Date().toISOString(),
            content: text,
            tags: []
        };
    }

    const frontMatter = match[1];
    const content = match[2];
    const metadata = {};

    frontMatter.split('\n').forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length) {
            const value = values.join(':').trim();
            if (key === 'tags') {
                try {
                    metadata[key] = JSON.parse(value);
                } catch (e) {
                    console.warn('Error parsing tags:', e);
                    metadata[key] = [];
                }
            } else {
                metadata[key] = value;
            }
        }
    });

    const post = {
        ...metadata,
        content: marked.parse(content)
    };
    console.log('Post parsed:', post);
    return post;
}

// 获取文章预览
function getPostPreview(content) {
    // 移除HTML标签
    const plainText = content.replace(/<[^>]*>/g, '');
    // 获取前200个字符
    return plainText.substring(0, 200) + '...';
}

// 渲染博客文章列表
function renderPosts(posts) {
    console.log('Rendering posts...');
    const postGrid = document.querySelector('.post-grid');
    if (!postGrid) {
        console.error('Post grid element not found!');
        return;
    }

    if (posts.length === 0) {
        postGrid.innerHTML = '<p>No posts found</p>';
        return;
    }

    const basePath = getBasePath();
    postGrid.innerHTML = '';

    // 只显示最新的3篇文章
    const latestPosts = posts.slice(0, 4);

    latestPosts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-meta">
                <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="post-preview">
                ${getPostPreview(post.content)}
            </div>
            <a href="${basePath}/post.html?post=${post.fileName}" class="read-more">Read more</a>
        `;
        postGrid.appendChild(article);
    });
    console.log('Posts rendered');
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    try {
        const posts = await loadPosts();
        renderPosts(posts);
    } catch (error) {
        console.error('Error initializing blog:', error);
        document.querySelector('.post-grid').innerHTML = `
            <article class="post-card error">
                <h3>Error</h3>
                <p>Failed to initialize blog: ${error.message}</p>
            </article>
        `;
    }
});
