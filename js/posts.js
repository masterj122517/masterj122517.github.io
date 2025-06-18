// 使用 marked.js 解析 Markdown
const marked = window.marked;

// 检查 marked.js 是否正确加载
if (!marked) {
    console.error('marked.js is not loaded!');
    document.querySelector('.post-grid').innerHTML = '<p>Error: Markdown parser not loaded</p>';
}

// 获取基础路径
function getBasePath() {
    const path = window.location.pathname;
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
        'posts/hacking.md',
        'posts/neovim_journey.md',
        'posts/remaps.md',
        'posts/dream.md',
        'posts/masterjs_tenet.md',
        'posts/learn_rust.md',
        'posts/learn_emacs.md',
        'posts/emacs.md',
    ];

    for (const file of postFiles) {
        try {
            console.log(`Fetching ${file}...`);
            const response = await fetch(file, {
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
        }
    }

    // 按日期排序
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('Posts loaded:', posts);
    return posts;
}

// 解析 Markdown 文章的前置元数据
function parseMarkdownPost(text) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = text.match(frontMatterRegex);

    if (!match) {
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
                    metadata[key] = [];
                }
            } else {
                metadata[key] = value;
            }
        }
    });

    return {
        ...metadata,
        content: marked.parse(content)
    };
}

// 获取文章预览
function getPostPreview(content) {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 200) + '...';
}

// 渲染标签过滤器
function renderTagFilters(posts) {
    const tagFilters = document.getElementById('tag-filters');
    const allTags = new Set();
    
    // 收集所有标签
    posts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });

    // 创建标签按钮
    const tagButtons = Array.from(allTags).map(tag => `
        <button class="tag-filter" data-tag="${tag}">
            ${tag}
        </button>
    `).join('');

    tagFilters.innerHTML = tagButtons;

    // 添加标签点击事件
    document.querySelectorAll('.tag-filter').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            filterPosts();
        });
    });
}

// 过滤文章
function filterPosts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const activeTags = Array.from(document.querySelectorAll('.tag-filter.active'))
        .map(button => button.dataset.tag);

    const filteredPosts = window.allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                            post.content.toLowerCase().includes(searchTerm);
        
        const matchesTags = activeTags.length === 0 ||
                          activeTags.every(tag => post.tags.includes(tag));

        return matchesSearch && matchesTags;
    });

    renderPosts(filteredPosts);
}

// 渲染博客文章列表
function renderPosts(posts) {
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

    posts.forEach(post => {
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
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const posts = await loadPosts();
        window.allPosts = posts; // 存储所有文章供过滤使用
        renderTagFilters(posts);
        renderPosts(posts);

        // 添加搜索功能
        document.getElementById('search-input').addEventListener('input', filterPosts);
    } catch (error) {
        console.error('Error initializing posts page:', error);
        document.querySelector('.post-grid').innerHTML = `
            <article class="post-card error">
                <h3>Error</h3>
                <p>Failed to initialize posts page: ${error.message}</p>
            </article>
        `;
    }
}); 
