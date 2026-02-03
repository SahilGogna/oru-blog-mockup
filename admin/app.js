/**
 * ORU Admin - Module Resources Management
 * In-memory data store and application logic
 */

// ============================================
// DATA STORE
// ============================================

const store = {
  topics: [
    { id: 'tech-interview', title: 'Technical Interview Prep' }
  ],

  categories: [
    { id: 'sql-mock', topicId: 'tech-interview', title: 'SQL Mock Interview', description: 'Click to manage resources' },
    { id: 'excel-mock', topicId: 'tech-interview', title: 'Excel Mock Interview', description: 'Click to manage resources' }
  ],

  modules: [
    {
      id: 'sql-fundamentals',
      categoryId: 'sql-mock',
      title: 'SQL Fundamentals',
      description: 'Master the basics of SQL including SELECT statements, filtering, and sorting data.',
      createdAt: new Date('2026-01-15').getTime()
    },
    {
      id: 'sql-joins',
      categoryId: 'sql-mock',
      title: 'Advanced SQL Joins',
      description: 'Deep dive into different types of SQL joins and when to use them.',
      createdAt: new Date('2026-01-20').getTime()
    },
    {
      id: 'sql-optimization',
      categoryId: 'sql-mock',
      title: 'SQL Performance Optimization',
      description: 'Learn techniques to write efficient SQL queries and optimize database performance.',
      createdAt: new Date('2026-01-25').getTime()
    }
  ],

  resources: [
    // SQL Fundamentals resources
    {
      id: 'r1',
      moduleId: 'sql-fundamentals',
      title: 'SQL SELECT Statement Explained',
      description: 'Complete guide to writing SELECT queries with practical examples',
      type: 'video',
      linkUrl: 'https://youtube.com/example-sql-select',
      createdAt: new Date('2026-01-16').getTime()
    },
    // Advanced SQL Joins resources
    {
      id: 'r2',
      moduleId: 'sql-joins',
      title: 'Visual Guide to SQL Joins',
      description: 'Comprehensive article with diagrams explaining INNER, LEFT, RIGHT, and FULL joins',
      content: `SQL joins are fundamental to working with relational databases. This guide covers:

• **INNER JOIN**: Returns only rows that have matching values in both tables. Use when you need data that exists in both tables.

• **LEFT JOIN**: Returns all rows from the left table, plus matched rows from the right table. NULL values appear where there's no match.

• **RIGHT JOIN**: Returns all rows from the right table, plus matched rows from the left table. Less common but useful for specific queries.

• **FULL OUTER JOIN**: Returns all rows when there's a match in either table. Great for finding gaps in data relationships.

Practice these joins with the exercises below to master data relationships in SQL.`,
      type: 'article',
      linkUrl: 'https://example.com/sql-joins-guide',
      createdAt: new Date('2026-01-21').getTime()
    },
    // SQL Performance Optimization resources
    {
      id: 'r3',
      moduleId: 'sql-optimization',
      title: 'SQL Query Optimization Tutorial',
      description: 'Learn indexing, query planning, and performance tuning strategies',
      type: 'video',
      linkUrl: 'https://youtube.com/example-sql-optimization',
      createdAt: new Date('2026-01-26').getTime()
    },
    {
      id: 'r4',
      moduleId: 'sql-optimization',
      title: '10 SQL Performance Tips',
      description: 'Practical tips to improve your SQL query performance',
      content: `Boost your SQL query performance with these proven optimization techniques:

1. **Use indexes strategically** - Create indexes on columns frequently used in WHERE, JOIN, and ORDER BY clauses.

2. **Avoid SELECT *** - Only retrieve the columns you actually need to reduce data transfer.

3. **Use EXPLAIN ANALYZE** - Understand your query execution plan to identify bottlenecks.

4. **Optimize JOIN order** - Place smaller tables first and use appropriate join types.

5. **Limit result sets** - Use LIMIT and pagination for large datasets.

6. **Avoid functions on indexed columns** - WHERE YEAR(date_col) = 2026 prevents index usage.

7. **Use EXISTS instead of IN** - For subqueries checking existence, EXISTS is often faster.

8. **Batch your operations** - Insert/update in batches rather than row-by-row.

9. **Consider query caching** - Cache frequently-run queries at the application level.

10. **Monitor and profile regularly** - Use database monitoring tools to catch slow queries early.`,
      type: 'article',
      linkUrl: 'https://example.com/sql-performance-tips',
      createdAt: new Date('2026-01-27').getTime()
    }
  ]
};

// Current navigation state
let currentView = 'topics';
let currentTopicId = null;
let currentCategoryId = null;
let currentModuleId = null;
let isPublicView = false; // Toggle between Admin and Public view

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function getModulesByCategory(categoryId) {
  return store.modules.filter(m => m.categoryId === categoryId);
}

function getResourcesByModule(moduleId) {
  const resources = store.resources.filter(r => r.moduleId === moduleId);
  // Sort: videos first (newest first within each type), then articles (newest first)
  const videos = resources.filter(r => r.type === 'video').sort((a, b) => b.createdAt - a.createdAt);
  const articles = resources.filter(r => r.type === 'article').sort((a, b) => b.createdAt - a.createdAt);
  return [...videos, ...articles];
}

function getCategoriesByTopic(topicId) {
  return store.categories.filter(c => c.topicId === topicId);
}

function getTopicById(id) {
  return store.topics.find(t => t.id === id);
}

function getCategoryById(id) {
  return store.categories.find(c => c.id === id);
}

function getModuleById(id) {
  return store.modules.find(m => m.id === id);
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;

  toast.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      ${type === 'success'
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
    }
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showModal(content) {
  const container = document.getElementById('modal-container');
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = content;
  container.classList.remove('hidden');
}

function hideModal() {
  const container = document.getElementById('modal-container');
  container.classList.add('hidden');
}

// Close modal on backdrop click
document.getElementById('modal-container').addEventListener('click', (e) => {
  if (e.target.id === 'modal-container') {
    hideModal();
  }
});

// ============================================
// MODULE CRUD
// ============================================

function showCreateModuleModal() {
  const html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Add Module</h2>
        <button onclick="hideModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form id="module-form" onsubmit="handleCreateModule(event)">
        <div class="space-y-4">
          <div>
            <label class="form-label">Title <span class="text-red-500">*</span></label>
            <input type="text" id="module-title" class="form-input" placeholder="Enter module title" maxlength="100" required>
            <div class="char-counter"><span id="title-count">0</span>/100</div>
          </div>
          
          <div>
            <label class="form-label">Description <span class="text-red-500">*</span></label>
            <textarea id="module-description" class="form-input" rows="3" placeholder="Enter module description" maxlength="250" required></textarea>
            <div class="char-counter"><span id="desc-count">0</span>/250</div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" onclick="resetModuleForm()" class="btn btn-outline">Reset</button>
          <button type="submit" class="btn btn-primary">Create Module</button>
        </div>
      </form>
    </div>
  `;
  showModal(html);
  setupCharCounters();
}

function showEditModuleModal(moduleId) {
  const module = getModuleById(moduleId);
  if (!module) return;

  const html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Edit Module</h2>
        <button onclick="hideModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form id="module-form" onsubmit="handleUpdateModule(event, '${moduleId}')">
        <div class="space-y-4">
          <div>
            <label class="form-label">Title <span class="text-red-500">*</span></label>
            <input type="text" id="module-title" class="form-input" value="${module.title}" maxlength="100" required>
            <div class="char-counter"><span id="title-count">${module.title.length}</span>/100</div>
          </div>
          
          <div>
            <label class="form-label">Description <span class="text-red-500">*</span></label>
            <textarea id="module-description" class="form-input" rows="3" maxlength="250" required>${module.description}</textarea>
            <div class="char-counter"><span id="desc-count">${module.description.length}</span>/250</div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" onclick="hideModal()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Module</button>
        </div>
      </form>
    </div>
  `;
  showModal(html);
  setupCharCounters();
}

function showDeleteModuleModal(moduleId) {
  const module = getModuleById(moduleId);
  if (!module) return;

  const resourceCount = store.resources.filter(r => r.moduleId === moduleId).length;

  const html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Delete Module</h2>
        <button onclick="hideModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <p class="text-gray-600 mb-2">Are you sure you want to delete <strong>"${module.title}"</strong>?</p>
      <p class="text-gray-500 text-sm mb-6">
        ${resourceCount > 0
      ? `This will also delete ${resourceCount} resource${resourceCount > 1 ? 's' : ''} within this module.`
      : 'This module has no resources.'}
        This action cannot be undone.
      </p>
      
      <div class="flex justify-end gap-3">
        <button onclick="hideModal()" class="btn btn-outline">Cancel</button>
        <button onclick="handleDeleteModule('${moduleId}')" class="btn btn-danger">Delete</button>
      </div>
    </div>
  `;
  showModal(html);
}

function handleCreateModule(event) {
  event.preventDefault();
  const title = document.getElementById('module-title').value.trim();
  const description = document.getElementById('module-description').value.trim();

  if (!title || !description) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const newModule = {
    id: generateId(),
    categoryId: currentCategoryId,
    title,
    description,
    createdAt: Date.now()
  };

  store.modules.push(newModule);
  hideModal();
  showToast('Module created successfully');

  // Navigate to the new module
  navigateToModuleDetail(newModule.id);
}

function handleUpdateModule(event, moduleId) {
  event.preventDefault();
  const module = getModuleById(moduleId);
  if (!module) return;

  const title = document.getElementById('module-title').value.trim();
  const description = document.getElementById('module-description').value.trim();

  if (!title || !description) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  module.title = title;
  module.description = description;
  module.updatedAt = Date.now();

  hideModal();
  showToast('Module updated successfully');
  renderView();
}

function handleDeleteModule(moduleId) {
  // Delete all resources in this module
  store.resources = store.resources.filter(r => r.moduleId !== moduleId);
  // Delete the module
  store.modules = store.modules.filter(m => m.id !== moduleId);

  hideModal();
  showToast('Module deleted successfully');
  renderView();
}

function resetModuleForm() {
  document.getElementById('module-title').value = '';
  document.getElementById('module-description').value = '';
  document.getElementById('title-count').textContent = '0';
  document.getElementById('desc-count').textContent = '0';
}

// ============================================
// RESOURCE CRUD
// ============================================

function showCreateResourceModal() {
  const html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Add Resource</h2>
        <button onclick="hideModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form id="resource-form" onsubmit="handleCreateResource(event)">
        <div class="space-y-4">
          <div>
            <label class="form-label">Title <span class="text-red-500">*</span></label>
            <input type="text" id="resource-title" class="form-input" placeholder="Enter resource title" maxlength="100" required>
            <div class="char-counter"><span id="res-title-count">0</span>/100</div>
          </div>
          
          <div>
            <label class="form-label">Description <span class="text-red-500">*</span></label>
            <textarea id="resource-description" class="form-input" rows="3" placeholder="Enter resource description" maxlength="250" required></textarea>
            <div class="char-counter"><span id="res-desc-count">0</span>/250</div>
          </div>
          
          <div>
            <label class="form-label">Type <span class="text-red-500">*</span></label>
            <select id="resource-type" class="form-input" required>
              <option value="">Select type</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Link URL <span class="text-red-500">*</span></label>
            <input type="url" id="resource-url" class="form-input" placeholder="https://..." required>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" onclick="resetResourceForm()" class="btn btn-outline">Reset</button>
          <button type="submit" class="btn btn-primary">Create Resource</button>
        </div>
      </form>
    </div>
  `;
  showModal(html);
  setupResourceCharCounters();
}

function showEditResourceModal(resourceId) {
  const resource = store.resources.find(r => r.id === resourceId);
  if (!resource) return;

  const html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Edit Resource</h2>
        <button onclick="hideModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form id="resource-form" onsubmit="handleUpdateResource(event, '${resourceId}')">
        <div class="space-y-4">
          <div>
            <label class="form-label">Title <span class="text-red-500">*</span></label>
            <input type="text" id="resource-title" class="form-input" value="${resource.title}" maxlength="100" required>
            <div class="char-counter"><span id="res-title-count">${resource.title.length}</span>/100</div>
          </div>
          
          <div>
            <label class="form-label">Description <span class="text-red-500">*</span></label>
            <textarea id="resource-description" class="form-input" rows="3" maxlength="250" required>${resource.description}</textarea>
            <div class="char-counter"><span id="res-desc-count">${resource.description.length}</span>/250</div>
          </div>
          
          <div>
            <label class="form-label">Type <span class="text-red-500">*</span></label>
            <select id="resource-type" class="form-input" required>
              <option value="video" ${resource.type === 'video' ? 'selected' : ''}>Video</option>
              <option value="article" ${resource.type === 'article' ? 'selected' : ''}>Article</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Link URL <span class="text-red-500">*</span></label>
            <input type="url" id="resource-url" class="form-input" value="${resource.linkUrl}" required>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" onclick="hideModal()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Resource</button>
        </div>
      </form>
    </div>
  `;
  showModal(html);
  setupResourceCharCounters();
}

function showDeleteResourceModal(resourceId) {
  const resource = store.resources.find(r => r.id === resourceId);
  if (!resource) return;

  const html = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Delete Resource</h2>
        <button onclick="hideModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <p class="text-gray-600 mb-6">Are you sure you want to delete <strong>"${resource.title}"</strong>? This action cannot be undone.</p>
      
      <div class="flex justify-end gap-3">
        <button onclick="hideModal()" class="btn btn-outline">Cancel</button>
        <button onclick="handleDeleteResource('${resourceId}')" class="btn btn-danger">Delete</button>
      </div>
    </div>
  `;
  showModal(html);
}

function handleCreateResource(event) {
  event.preventDefault();
  const title = document.getElementById('resource-title').value.trim();
  const description = document.getElementById('resource-description').value.trim();
  const type = document.getElementById('resource-type').value;
  const linkUrl = document.getElementById('resource-url').value.trim();

  if (!title || !description || !type || !linkUrl) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const newResource = {
    id: generateId(),
    moduleId: currentModuleId,
    title,
    description,
    type,
    linkUrl,
    createdAt: Date.now()
  };

  store.resources.push(newResource);
  hideModal();
  showToast('Resource added successfully');
  renderView();
}

function handleUpdateResource(event, resourceId) {
  event.preventDefault();
  const resource = store.resources.find(r => r.id === resourceId);
  if (!resource) return;

  const title = document.getElementById('resource-title').value.trim();
  const description = document.getElementById('resource-description').value.trim();
  const type = document.getElementById('resource-type').value;
  const linkUrl = document.getElementById('resource-url').value.trim();

  if (!title || !description || !type || !linkUrl) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  resource.title = title;
  resource.description = description;
  resource.type = type;
  resource.linkUrl = linkUrl;
  resource.updatedAt = Date.now();

  hideModal();
  showToast('Resource updated successfully');
  renderView();
}

function handleDeleteResource(resourceId) {
  store.resources = store.resources.filter(r => r.id !== resourceId);
  hideModal();
  showToast('Resource deleted successfully');
  renderView();
}

function resetResourceForm() {
  document.getElementById('resource-title').value = '';
  document.getElementById('resource-description').value = '';
  document.getElementById('resource-type').value = '';
  document.getElementById('resource-url').value = '';
  document.getElementById('res-title-count').textContent = '0';
  document.getElementById('res-desc-count').textContent = '0';
}

// ============================================
// CHARACTER COUNTERS
// ============================================

function setupCharCounters() {
  const titleInput = document.getElementById('module-title');
  const descInput = document.getElementById('module-description');

  if (titleInput) {
    titleInput.addEventListener('input', () => {
      document.getElementById('title-count').textContent = titleInput.value.length;
    });
  }

  if (descInput) {
    descInput.addEventListener('input', () => {
      document.getElementById('desc-count').textContent = descInput.value.length;
    });
  }
}

function setupResourceCharCounters() {
  const titleInput = document.getElementById('resource-title');
  const descInput = document.getElementById('resource-description');

  if (titleInput) {
    titleInput.addEventListener('input', () => {
      document.getElementById('res-title-count').textContent = titleInput.value.length;
    });
  }

  if (descInput) {
    descInput.addEventListener('input', () => {
      document.getElementById('res-desc-count').textContent = descInput.value.length;
    });
  }
}

// ============================================
// NAVIGATION
// ============================================

function navigateToTopics() {
  currentView = 'topics';
  currentTopicId = null;
  currentCategoryId = null;
  currentModuleId = null;
  renderView();
}

function navigateToCategories(topicId) {
  currentView = 'categories';
  currentTopicId = topicId;
  currentCategoryId = null;
  currentModuleId = null;
  renderView();
}

function navigateToModules(categoryId) {
  currentView = 'modules';
  currentCategoryId = categoryId;
  currentModuleId = null;
  renderView();
}

function navigateToModuleDetail(moduleId) {
  currentView = 'module-detail';
  currentModuleId = moduleId;
  renderView();
}

// ============================================
// RENDER FUNCTIONS (Admin Views)
// ============================================

function renderTopicsView() {
  return `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Community Resources</h1>
        <p class="text-gray-500 text-sm mt-1">Manage resources for our members</p>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Topic
        </button>
        <button class="btn btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Resource
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${store.topics.map(topic => `
        <div class="card" onclick="navigateToCategories('${topic.id}')">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-800">${topic.title}</h3>
            <div class="flex gap-1">
              <button class="icon-btn edit" onclick="event.stopPropagation()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
              <button class="icon-btn delete" onclick="event.stopPropagation()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCategoriesView() {
  const topic = getTopicById(currentTopicId);
  const categories = getCategoriesByTopic(currentTopicId);

  return `
    <div class="mb-1">
      <button onclick="navigateToTopics()" class="breadcrumb">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Topics
      </button>
    </div>
    
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">${topic ? topic.title : 'Categories'}</h1>
        <p class="text-gray-500 text-sm mt-1">Manage categories for this topic</p>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Category
        </button>
        <button class="btn btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Resource
        </button>
      </div>
    </div>
    
    ${categories.length === 0 ? `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p>No categories yet. Click "Add Category" to get started.</p>
      </div>
    ` : `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${categories.map(cat => `
          <div class="card" onclick="navigateToModules('${cat.id}')">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-800">${cat.title}</h3>
                <p class="text-sm text-gray-500 mt-1">${cat.description}</p>
              </div>
              <div class="flex gap-1">
                <button class="icon-btn edit" onclick="event.stopPropagation()">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
                <button class="icon-btn delete" onclick="event.stopPropagation()">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

function renderModulesView() {
  const category = getCategoryById(currentCategoryId);
  const topic = getTopicById(currentTopicId);
  const modules = getModulesByCategory(currentCategoryId);

  return `
    <div class="mb-1">
      <button onclick="navigateToCategories('${currentTopicId}')" class="breadcrumb">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to ${topic ? topic.title : 'Categories'}
      </button>
    </div>
    
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">${category ? category.title : 'Modules'}</h1>
        <p class="text-gray-500 text-sm mt-1">Manage modules for this category</p>
      </div>
      <button onclick="showCreateModuleModal()" class="btn btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add Module
      </button>
    </div>
    
    ${modules.length === 0 ? `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p>No modules yet. Click "Add Module" to get started.</p>
      </div>
    ` : `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${modules.map(mod => {
    const resourceCount = store.resources.filter(r => r.moduleId === mod.id).length;
    return `
            <div class="card" onclick="navigateToModuleDetail('${mod.id}')">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-800">${mod.title}</h3>
                <div class="flex gap-1">
                  <button class="icon-btn edit" onclick="event.stopPropagation(); showEditModuleModal('${mod.id}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button class="icon-btn delete" onclick="event.stopPropagation(); showDeleteModuleModal('${mod.id}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-500 mb-2">${truncateText(mod.description, 100)}</p>
              <p class="text-xs text-gray-400">${resourceCount} resource${resourceCount !== 1 ? 's' : ''}</p>
            </div>
          `;
  }).join('')}
      </div>
    `}
  `;
}

function renderModuleDetailView() {
  const module = getModuleById(currentModuleId);
  const category = getCategoryById(currentCategoryId);
  const resources = getResourcesByModule(currentModuleId);

  return `
    <div class="mb-1 flex items-center gap-2 text-sm text-gray-500">
      <button onclick="navigateToModules('${currentCategoryId}')" class="breadcrumb">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to ${category ? category.title : 'Modules'}
      </button>
    </div>
    
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">${module ? module.title : 'Module'}</h1>
        <p class="text-gray-500 text-sm mt-1">${module ? module.description : ''}</p>
      </div>
      <button onclick="showCreateResourceModal()" class="btn btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add Resource
      </button>
    </div>
    
    ${resources.length === 0 ? `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p>No resources yet. Click "Add Resource" to get started.</p>
      </div>
    ` : `
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="resource-table">
          <thead>
            <tr class="bg-gray-50">
              <th>Title</th>
              <th>Type</th>
              <th>URL</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${resources.map(res => `
              <tr>
                <td>
                  <div>
                    <div class="font-medium text-gray-800">${res.title}</div>
                    <div class="text-xs text-gray-500 mt-0.5">${truncateText(res.description, 60)}</div>
                  </div>
                </td>
                <td>
                  <span class="badge ${res.type === 'video' ? 'badge-video' : 'badge-article'}">
                    ${res.type.charAt(0).toUpperCase() + res.type.slice(1)}
                  </span>
                </td>
                <td>
                  <a href="${res.linkUrl}" target="_blank" class="text-primary hover:underline text-sm truncate block max-w-xs">
                    ${truncateText(res.linkUrl, 40)}
                  </a>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-1">
                    <button class="icon-btn edit" onclick="showEditResourceModal('${res.id}')">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                    <button class="icon-btn delete" onclick="showDeleteResourceModal('${res.id}')">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

// ============================================
// INITIALIZATION & VIEW TOGGLE
// ============================================

// Toggle between Admin and Public view
function toggleView() {
  isPublicView = !isPublicView;
  currentView = 'topics';
  currentTopicId = null;
  currentCategoryId = null;
  currentModuleId = null;
  updateViewToggleButton();
  renderView();
}

function updateViewToggleButton() {
  const btn = document.getElementById('view-toggle-btn');
  if (btn) {
    btn.innerHTML = isPublicView ? `
      <span>Admin View</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    ` : `
      <span>MyOru</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    `;
  }
}

// Get resource counts by type for a module
function getResourceCounts(moduleId) {
  const resources = store.resources.filter(r => r.moduleId === moduleId);
  const videoCount = resources.filter(r => r.type === 'video').length;
  const articleCount = resources.filter(r => r.type === 'article').length;
  return { videoCount, articleCount, total: resources.length };
}

// Format resource counts as badge text
function formatResourceBadge(moduleId) {
  const { videoCount, articleCount } = getResourceCounts(moduleId);
  const parts = [];
  if (videoCount > 0) parts.push(`${videoCount} Video${videoCount > 1 ? 's' : ''}`);
  if (articleCount > 0) parts.push(`${articleCount} Article${articleCount > 1 ? 's' : ''}`);
  return parts.join(', ') || 'No resources';
}

// Updated render function to handle public/admin views
function renderView() {
  const mainContent = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar');

  // Show/hide sidebar based on view mode
  if (sidebar) {
    sidebar.style.display = isPublicView ? 'none' : 'flex';
  }

  if (isPublicView) {
    switch (currentView) {
      case 'topics':
        mainContent.innerHTML = renderPublicTopicsView();
        break;
      case 'categories':
        mainContent.innerHTML = renderPublicCategoriesView();
        break;
      case 'modules':
        mainContent.innerHTML = renderPublicModulesView();
        break;
      case 'module-detail':
        mainContent.innerHTML = renderPublicModuleDetailView();
        break;
      default:
        mainContent.innerHTML = renderPublicTopicsView();
    }
  } else {
    switch (currentView) {
      case 'topics':
        mainContent.innerHTML = renderTopicsView();
        break;
      case 'categories':
        mainContent.innerHTML = renderCategoriesView();
        break;
      case 'modules':
        mainContent.innerHTML = renderModulesView();
        break;
      case 'module-detail':
        mainContent.innerHTML = renderModuleDetailView();
        break;
      default:
        mainContent.innerHTML = renderTopicsView();
    }
  }
}

// ============================================
// PUBLIC VIEW RENDER FUNCTIONS
// ============================================

function renderPublicTopicsView() {
  return `
    <div class="max-w-4xl mx-auto py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Accelerate Your <span class="text-primary">Tech Career</span></h1>
        <p class="text-gray-500">Access curated articles, masterclasses, and technical guides designed for your growth.</p>
      </div>
      
      <div class="space-y-8">
        <h2 class="text-lg font-bold text-gray-700">Browse by Topic</h2>
        
        ${store.topics.map(topic => {
    const categories = getCategoriesByTopic(topic.id);
    if (categories.length === 0) return '';

    return `
            <div class="mb-8">
              <h3 class="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <span class="w-1 h-4 bg-primary rounded"></span>
                ${topic.title}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${categories.map(cat => `
                  <div class="public-card bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between" onclick="navigateToModules('${cat.id}'); currentTopicId='${topic.id}';">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                      <span class="font-medium text-gray-800">${cat.title}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;
}

function renderPublicCategoriesView() {
  const topic = getTopicById(currentTopicId);
  const categories = getCategoriesByTopic(currentTopicId);

  return `
    <div class="max-w-4xl mx-auto py-8">
      <button onclick="navigateToTopics()" class="breadcrumb mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to All Topics
      </button>
      
      <h1 class="text-2xl font-bold text-gray-800 mb-6">${topic ? topic.title : 'Categories'}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${categories.map(cat => `
          <div class="public-card bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between" onclick="navigateToModules('${cat.id}')">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <span class="font-medium text-gray-800">${cat.title}</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPublicModulesView() {
  const category = getCategoryById(currentCategoryId);
  const topic = getTopicById(currentTopicId);
  const modules = getModulesByCategory(currentCategoryId);
  const totalResources = modules.reduce((sum, m) => sum + getResourceCounts(m.id).total, 0);

  return `
    <div class="max-w-5xl mx-auto py-8">
      <button onclick="navigateToTopics()" class="breadcrumb mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to All Topics
      </button>
      
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-gray-800">${category ? category.title : 'Modules'}</h1>
        <span class="text-2xl font-bold text-primary">${modules.length} <span class="text-base font-normal text-gray-500">Modules Available</span></span>
      </div>
      <p class="text-primary text-sm mb-6">${topic ? '> ' + topic.title : ''}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${modules.map(mod => {
    const counts = getResourceCounts(mod.id);
    const badgeText = formatResourceBadge(mod.id);

    return `
            <div class="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all">
              <h3 class="font-bold text-gray-800 mb-2">${mod.title}</h3>
              <p class="text-sm text-gray-500 mb-4">${truncateText(mod.description, 80)}</p>
              
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex flex-wrap gap-2">
                  ${counts.videoCount > 0 ? `
                    <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      ${counts.videoCount} Video${counts.videoCount > 1 ? 's' : ''}
                    </span>
                  ` : ''}
                  ${counts.articleCount > 0 ? `
                    <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z"/>
                      </svg>
                      ${counts.articleCount} Article${counts.articleCount > 1 ? 's' : ''}
                    </span>
                  ` : ''}
                </div>
                <a href="javascript:void(0)" onclick="navigateToModuleDetail('${mod.id}')" class="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                  View Resource
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;
}

function renderPublicModuleDetailView() {
  const module = getModuleById(currentModuleId);
  const category = getCategoryById(currentCategoryId);
  const topic = getTopicById(currentTopicId);
  const resources = getResourcesByModule(currentModuleId);
  const videos = resources.filter(r => r.type === 'video');
  const articles = resources.filter(r => r.type === 'article');

  return `
    <div class="max-w-4xl mx-auto py-8">
      <button onclick="navigateToModules('${currentCategoryId}')" class="breadcrumb mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Resources
      </button>
      
      <h1 class="text-2xl font-bold text-gray-800 mb-1">${module ? module.title : 'Module'}</h1>
      <p class="text-primary text-sm mb-2">${topic ? '> ' + topic.title : ''} ${category ? '> ' + category.title : ''}</p>
      <p class="text-gray-500 mb-8">${module ? module.description : ''}</p>
      
      <!-- Videos Section -->
      ${videos.length > 0 ? `
        <div class="mb-8">
          ${videos.map((video, index) => `
            <div class="bg-purple-900 rounded-xl overflow-hidden mb-4 relative">
              <div class="aspect-video flex items-center justify-center bg-gradient-to-br from-purple-800 to-purple-950">
                <div class="text-center text-white p-8">
                  <div class="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all" onclick="window.open('${video.linkUrl}', '_blank')">
                    <svg class="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold mb-2">${video.title}</h3>
                  <p class="text-purple-200 text-sm mb-4">${video.description}</p>
                  <a href="${video.linkUrl}" target="_blank" class="inline-flex items-center gap-2 bg-white text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-all">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Video
                  </a>
                </div>
              </div>
              <button class="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Articles Section -->
      ${articles.length > 0 ? `
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-700 mb-4">Related Articles</h3>
          ${articles.map((article, index) => `
            <div class="article-accordion bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button class="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-all" onclick="toggleArticle('article-${index}')">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM9 13h6v2H9v-2zm0 4h6v2H9v-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">${article.title}</h4>
                    <p class="text-sm text-gray-500">${truncateText(article.description, 60)}</p>
                  </div>
                </div>
                <svg id="article-${index}-icon" class="w-5 h-5 text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div id="article-${index}-content" class="hidden px-5 pb-4 pt-0">
                <div class="ml-13 border-l-2 border-gray-100 pl-4">
                  <div class="text-gray-600 whitespace-pre-line">${article.content || article.description}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${resources.length === 0 ? `
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No resources available for this module yet.</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Toggle article accordion
function toggleArticle(id) {
  const content = document.getElementById(id + '-content');
  const icon = document.getElementById(id + '-icon');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderView();
});
