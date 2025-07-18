// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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

// 加载文章内容
async function loadPost() {
    const postFile = getUrlParameter('post');
    if (!postFile) {
        document.getElementById('post-body').innerHTML = '<p>Post not found</p>';
        return;
    }

    try {
        // 添加调试信息
        console.log('Loading post:', postFile);
        const basePath = getBasePath();
        console.log('Base path:', basePath);
        const fullPath = basePath ? `${basePath}/posts/${postFile}` : `posts/${postFile}`;
        console.log('Full URL:', fullPath);
        const response = await fetch(fullPath);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Successfully loaded post content');
        const post = parseMarkdownPost(text);
        renderPost(post);
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-body').innerHTML = `
            <p>Error loading post: ${error.message}</p>
            <p>Please check:</p>
            <ul>
                <li>If the post file exists</li>
                <li>If the filename is correct</li>
                <li>If the file permissions are correct</li>
            </ul>
            <p>Debug info:</p>
            <ul>
                <li>Current hostname: ${window.location.hostname}</li>
                <li>Base path: ${getBasePath()}</li>
                <li>Full URL: ${getBasePath()}/posts/${postFile}</li>
            </ul>
        `;
    }
}

// 解析 Markdown 文章
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

// 渲染文章
function renderPost(post) {
    // 更新页面标题
    document.title = `${post.title} - MasterJ's LostLand`;

    // 更新文章标题
    document.getElementById('post-title').textContent = post.title;

    // 更新日期
    document.getElementById('post-date').textContent = new Date(post.date).toLocaleDateString();

    // 更新标签
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = post.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');

    // 更新文章内容
    document.getElementById('post-body').innerHTML = post.content;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPost); 
