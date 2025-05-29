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
        document.getElementById('post-body').innerHTML = '<p>未找到文章</p>';
        return;
    }

    try {
        // 添加调试信息
        console.log('正在加载文章:', postFile);
        const basePath = getBasePath();
        console.log('基础路径:', basePath);
        const fullPath = basePath ? `${basePath}/posts/${postFile}` : `posts/${postFile}`;
        console.log('完整URL:', fullPath);
        const response = await fetch(fullPath);
        console.log('响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('成功加载文章内容');
        const post = parseMarkdownPost(text);
        renderPost(post);
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-body').innerHTML = `
            <p>加载文章时出错：${error.message}</p>
            <p>请检查：</p>
            <ul>
                <li>文章文件是否存在</li>
                <li>文件名是否正确</li>
                <li>文件权限是否正确</li>
            </ul>
            <p>调试信息：</p>
            <ul>
                <li>当前域名：${window.location.hostname}</li>
                <li>基础路径：${getBasePath()}</li>
                <li>完整URL：${getBasePath()}/posts/${postFile}</li>
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
