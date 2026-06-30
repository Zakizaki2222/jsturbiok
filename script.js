import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://nksgixwpdnfatqluusxx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LXzFI1uEXA5xyyM5vIhl_Q_mY5PAakh';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const postsContainer = document.getElementById('posts');
const searchInput = document.getElementById('search');
const themeToggle = document.getElementById('themeToggle');

let allPosts = [];
let likeCounts = {};

async function loadPosts() {
  const res = await fetch('posts.json');
  allPosts = await res.json();
  await loadLikeCounts();
  renderPosts(allPosts);
}

async function loadLikeCounts() {
  const { data, error } = await supabase.from('likes').select('post_id, count');

  if (error) {
    console.error(error);
    return;
  }

  likeCounts = {};
  data.forEach(row => {
    likeCounts[row.post_id] = row.count;
  });
}

function renderPosts(posts) {
  postsContainer.innerHTML = '';

  posts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'card';

    const likeCount = likeCounts[post.id] || 0;

    card.innerHTML = `
      <img src="${post.image}" alt="">
      <div class="card-content">
        <div class="meta">${post.date} <span class="card-like">❤️ ${likeCount}</span></div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <a class="readmore" href="post.html?id=${post.id}">続きを読む →</a>
      </div>
    `;

    postsContainer.appendChild(card);
  });
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();

  const filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(q) ||
    post.content.toLowerCase().includes(q) ||
    post.tags.join(' ').toLowerCase().includes(q)
  );

  renderPosts(filtered);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

loadPosts();
