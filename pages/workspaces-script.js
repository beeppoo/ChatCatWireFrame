// Workspaces page script
// ========================
// Comprehensive workspaces management with 4 screens:
// 1. Overview: Project listing
// 2. Categories: Incoming files & category management
// 3. Import: WhatsApp backup import flow
// 4. Files: File listing & export management

// Get DOM elements
const sidebarToggle = document.getElementById('sidebarToggle');
const seniorToggles = document.querySelectorAll('.senior-toggle-input');
const appRoot = document.getElementById('app');

// Toast notification with accessibility
function toast(message) {
  const toastContainer = document.getElementById('toastContainer');
  const node = document.createElement('div');
  node.className = 'toast';
  node.setAttribute('role', 'status');
  node.setAttribute('aria-live', 'polite');
  node.textContent = message;
  if (toastContainer) {
    toastContainer.appendChild(node);
    requestAnimationFrame(function() { node.classList.add('show'); });
    setTimeout(function() { node.classList.remove('show'); }, 2400);
    setTimeout(function() { node.remove(); }, 2800);
  }
}

// Screen switching with fade animation and focus management
function switchScreen(screenName) {
  const screens = document.querySelectorAll('.workspace-screen');
  screens.forEach(function(screen) {
    screen.classList.remove('active');
  });
  
  const targetScreen = document.getElementById('screen-' + screenName);
  if (targetScreen) {
    targetScreen.classList.add('active');
    // Focus management for accessibility
    const firstButton = targetScreen.querySelector('button');
    if (firstButton) {
      setTimeout(function() { firstButton.focus(); }, 100);
    }
  }
}

// Switch to a specific category and show Files screen
let currentCategory = 'Drafts';
let currentProjectName = 'PFM Group Project 1';
let lastScreenBefore = 'categories'; // Track where we came from
let categories = ['Drafts', 'Slides', 'References', 'Final Deliverables'];
let filesByCategory = {
  'Drafts': [],
  'Slides': [],
  'References': [],
  'Final Deliverables': []
};

function setCurrentProject(name) {
  currentProjectName = name || 'PFM Group Project 1';
  const categoriesCrumb = document.getElementById('breadcrumbProjectCategories');
  const importCrumb = document.getElementById('breadcrumbProjectImport');
  const filesCrumb = document.getElementById('breadcrumbProjectFiles');
  [categoriesCrumb, importCrumb, filesCrumb].forEach(function(node) {
    if (node) node.textContent = currentProjectName;
  });
}

function openProject(name) {
  setCurrentProject(name);
  switchScreen('categories');
  toast('Opening ' + currentProjectName);
}

function switchToCategory(categoryName) {
  currentCategory = categoryName;
  lastScreenBefore = 'files'; // Coming from incoming/files view
  const filesSectionName = document.getElementById('files-section-name');
  if (filesSectionName) {
    filesSectionName.textContent = categoryName;
  }
  
  // Show appropriate view based on category
  const incomingView = document.getElementById('files-incoming-view');
  const draftsView = document.getElementById('files-drafts-view');
  const exportView = document.getElementById('files-export-view');
  
  if (categoryName === 'Incoming Files') {
    // Show incoming files with drag-drop and categories
    if (incomingView) incomingView.style.display = 'block';
    if (draftsView) draftsView.style.display = 'none';
    if (exportView) exportView.style.display = 'none';
  } else if (categoryName === 'Final Deliverables') {
    // Show export interface for Final Deliverables
    if (incomingView) incomingView.style.display = 'none';
    if (draftsView) draftsView.style.display = 'none';
    if (exportView) exportView.style.display = 'block';
  } else {
    // Show version/draft management for other categories (Drafts, Slides, References)
    if (incomingView) incomingView.style.display = 'none';
    if (draftsView) draftsView.style.display = 'block';
    if (exportView) exportView.style.display = 'none';
    
    // Update drafts view with files from this category
    updateCategoryFilesDisplay(categoryName);
  }
  
  switchScreen('files');
}

function updateCategoryFilesDisplay(categoryName) {
  const filesList = document.querySelector('#files-drafts-view .files-list');
  const filesPreview = document.querySelector('#files-drafts-view .incoming-files-preview');
  
  if (!filesList || !filesPreview) return;
  
  // Clear existing file rows
  filesList.innerHTML = '';
  filesPreview.innerHTML = '';
  
  const categoryFiles = filesByCategory[categoryName] || [];
  
  if (categoryFiles.length === 0) {
    filesList.innerHTML = '<p class="muted" style="padding: 20px; text-align: center;">No files in this category yet. Drag files from Incoming Files.</p>';
    return;
  }
  
  // Add preview icons
  categoryFiles.forEach(function(fileName) {
    const preview = document.createElement('div');
    preview.className = 'file-placeholder';
    preview.textContent = '📄';
    filesPreview.appendChild(preview);
  });
  
  // Add file rows with "Move to Incoming" button
  categoryFiles.forEach(function(fileName) {
    const fileRow = document.createElement('div');
    fileRow.className = 'file-row';
    const moveBtn = document.createElement('button');
    moveBtn.className = 'ghost';
    moveBtn.textContent = '← Move to Incoming';
    moveBtn.onclick = function(e) {
      e.stopPropagation();
      moveFileToIncoming(fileName, categoryName);
    };
    
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.innerHTML = '<div class="file-name">' + fileName + '</div><div class="file-meta">Imported file</div>';
    
    const fileActions = document.createElement('div');
    fileActions.className = 'file-actions';
    fileActions.innerHTML = '<span class="file-date">Today</span>';
    fileActions.appendChild(moveBtn);
    
    fileRow.appendChild(fileInfo);
    fileRow.appendChild(fileActions);
    filesList.appendChild(fileRow);
  });
}

function initializeIncomingFileDrag(fileNode) {
  if (!fileNode || fileNode.dataset.dragBound === 'true') return;

  fileNode.dataset.dragBound = 'true';
  fileNode.setAttribute('draggable', 'true');

  fileNode.addEventListener('dragstart', function(e) {
    const fileName = fileNode.dataset.fileName || fileNode.textContent.trim();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', fileName);
    fileNode.classList.add('is-dragging');
  });

  fileNode.addEventListener('dragend', function() {
    fileNode.classList.remove('is-dragging');
  });
}

function initializeIncomingCategoryDrop(card) {
  if (!card || card.dataset.dropBound === 'true') return;

  const categoryNameNode = card.querySelector('.category-name');
  if (!categoryNameNode) return;

  card.dataset.dropBound = 'true';
  const originalShadow = card.style.boxShadow;

  card.addEventListener('dragover', function(e) {
    e.preventDefault();
    card.style.boxShadow = '0 0 0 2px var(--accent)';
  });

  card.addEventListener('dragleave', function() {
    card.style.boxShadow = originalShadow;
  });

  card.addEventListener('drop', function(e) {
    e.preventDefault();
    card.style.boxShadow = originalShadow;
    const fileName = e.dataTransfer.getData('text/plain') || '';
    handleCategoryDrop(categoryNameNode.textContent, fileName);
  });
}

function setupIncomingDragAndDrop() {
  const incomingFiles = document.querySelectorAll('#files-incoming-view .file-placeholder');
  incomingFiles.forEach(function(fileNode) {
    initializeIncomingFileDrag(fileNode);
  });

  const incomingDropTargets = document.querySelectorAll('#files-incoming-view .category-card');
  incomingDropTargets.forEach(function(card) {
    initializeIncomingCategoryDrop(card);
  });
}

function moveFileToIncoming(fileName, categoryName) {
  // Remove from category
  filesByCategory[categoryName] = filesByCategory[categoryName].filter(function(f) { return f !== fileName; });
  
  // Add back to incoming files preview
  const incomingPreview = document.querySelector('#files-incoming-view .incoming-files-preview');
  if (incomingPreview) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-placeholder';
    fileDiv.setAttribute('data-file-name', fileName);
    fileDiv.textContent = '📄 ' + fileName;
    initializeIncomingFileDrag(fileDiv);
    incomingPreview.appendChild(fileDiv);
  }
  
  // Refresh current category display
  updateCategoryFilesDisplay(categoryName);
  
  toast('"' + fileName + '" moved back to Incoming Files');
}

function goBack() {
  if (lastScreenBefore === 'files') {
    // Go back to Incoming Files view if we came from there
    switchToCategory('Incoming Files');
  } else {
    // Otherwise go back to categories
    switchScreen('categories');
  }
}

function editCategory(oldName) {
  const newName = prompt('Edit category name:', oldName);
  if (newName && newName.trim() && newName !== oldName) {
    const trimmedName = newName.trim();
    
    // Rename in categories list
    const index = categories.indexOf(oldName);
    if (index > -1) {
      categories[index] = trimmedName;
    }
    
    // Move files to new category name
    if (filesByCategory[oldName]) {
      filesByCategory[trimmedName] = filesByCategory[oldName];
      delete filesByCategory[oldName];
    } else {
      filesByCategory[trimmedName] = [];
    }
    
    // Regenerate categories UI
    renderCategories();
    toast('Category renamed to "' + trimmedName + '"');
  }
}

function addNewCategory() {
  const newName = prompt('Enter new category name:');
  if (newName && newName.trim()) {
    const trimmedName = newName.trim();
    
    if (categories.indexOf(trimmedName) > -1) {
      toast('Category already exists!');
      return;
    }
    
    categories.push(trimmedName);
    filesByCategory[trimmedName] = [];
    
    renderCategories();
    toast('Category "' + trimmedName + '" created');
  }
}

function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  
  // Clear and rebuild
  grid.innerHTML = '';
  
  categories.forEach(function(catName) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.onclick = function() { switchToCategory(catName); };
    
    card.innerHTML = '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">' +
      '<div class="category-name">' + catName + '</div>' +
      '<button class="ghost" style="padding: 4px 8px; font-size: 12px;" onclick="event.stopPropagation(); editCategory(\'' + catName + '\')">✎</button>' +
      '</div>' +
      '<div class="category-placeholder"><p>📄</p><p class="muted" style="font-size: 12px; margin-top: 8px;">Preview</p></div>' +
      '<p class="muted" style="font-size: 12px; margin-top: 12px; text-align: center;">... and more</p>';
    
    grid.appendChild(card);
  });
  
  // Add button
  const addBtn = document.createElement('div');
  addBtn.className = 'category-card';
  addBtn.style.cursor = 'default';
  addBtn.style.display = 'flex';
  addBtn.style.alignItems = 'center';
  addBtn.style.justifyContent = 'center';
  addBtn.onclick = function(e) { e.stopPropagation(); };
  addBtn.innerHTML = '<button class="primary" onclick="addNewCategory()" style="width: 100%; padding: 20px;">+ Add Category</button>';
  
  grid.appendChild(addBtn);

  setupIncomingDragAndDrop();
}

// Toggle all file checkboxes with visual feedback
function toggleAllCheckboxes() {
  const checkboxes = document.querySelectorAll('.file-checkbox');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = !allChecked;
  });
  
  // Update button text and show feedback
  const exportBtn = document.querySelector('.files-toolbar .primary');
  const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
  
  if (exportBtn) {
    if (checkedCount > 0) {
      exportBtn.textContent = 'Export ' + checkedCount + ' Selected';
      toast(checkedCount + ' file(s) selected for export');
    } else {
      exportBtn.textContent = 'Export Selected';
    }
  }
}

// Handle file export action
function exportFile(fileName) {
  toast('Exporting: ' + fileName);
}

// Handle category file drop (mock drag-drop)
function handleCategoryDrop(categoryName, fileName) {
  if (fileName) {
    // Add file to category if not already there
    if (!filesByCategory[categoryName]) {
      filesByCategory[categoryName] = [];
    }
    if (filesByCategory[categoryName].indexOf(fileName) === -1) {
      filesByCategory[categoryName].push(fileName);
    }
    
    // Remove from incoming preview
    const incomingFiles = document.querySelectorAll('#files-incoming-view .file-placeholder[data-file-name]');
    const incomingFile = Array.from(incomingFiles).find(function(fileNode) {
      return fileNode.dataset.fileName === fileName;
    });
    if (incomingFile) {
      incomingFile.style.opacity = '0';
      incomingFile.style.pointerEvents = 'none';
      setTimeout(function() {
        incomingFile.remove();
      }, 300);
    }
    
    toast('"' + fileName + '" moved to ' + categoryName);
  } else {
    toast('Files would be categorized as: ' + categoryName);
  }
}

// Sidebar toggle
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const app = document.querySelector('.app');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      
      if (sidebar.classList.contains('collapsed')) {
        if (app) app.style.gridTemplateColumns = '86px 1fr';
        sidebar.style.width = '86px';
        sidebarToggle.textContent = '▶';
      } else {
        if (app) app.style.gridTemplateColumns = '280px 1fr';
        sidebar.style.width = '280px';
        sidebarToggle.textContent = '◀';
      }
    }
  });
}

function setSeniorMode(isSenior) {
  if (appRoot) {
    appRoot.classList.toggle('senior', isSenior);
  }
  seniorToggles.forEach(function(toggle) {
    if (toggle.checked !== isSenior) {
      toggle.checked = isSenior;
    }
  });
}

// Senior mode toggle
if (seniorToggles.length) {
  seniorToggles.forEach(function(toggle) {
    toggle.addEventListener('change', function(e) {
      setSeniorMode(e.target.checked);
    });
  });
}

// File search functionality with live filtering
document.addEventListener('DOMContentLoaded', function() {
  // Initialize breadcrumbs with default project
  setCurrentProject(currentProjectName);

  const searchInput = document.querySelector('.files-search');
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const fileRows = document.querySelectorAll('.file-row');
      let visibleCount = 0;
      
      fileRows.forEach(function(row) {
        const fileName = row.querySelector('.file-name').textContent.toLowerCase();
        const shouldShow = fileName.includes(searchTerm);
        row.style.display = shouldShow ? 'flex' : 'none';
        if (shouldShow) visibleCount++;
      });
      
      if (visibleCount === 0 && searchTerm.length > 0) {
        toast('No files matching "' + searchTerm + '"');
      }
    });
  }

  // File checkbox individual tracking
  const fileCheckboxes = document.querySelectorAll('.file-checkbox');
  fileCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function(e) {
      const checkedCount = Array.from(fileCheckboxes).filter(cb => cb.checked).length;
      const exportBtn = document.querySelector('.files-toolbar .primary');
      
      if (exportBtn) {
        if (checkedCount > 0) {
          exportBtn.textContent = 'Export ' + checkedCount + ' Selected';
        } else {
          exportBtn.textContent = 'Export Selected';
        }
      }
    });
  });

  // New project button with modal simulation
  const newProjectBtn = document.getElementById('newProjectBtn');
  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', function() {
      const projectName = prompt('Enter new project name:');
      if (projectName && projectName.trim()) {
        toast('Project "' + projectName.trim() + '" would be created');
      }
    });
  }

  // Export button interactions on file rows
  const exportButtons = document.querySelectorAll('.file-actions .ghost');
  exportButtons.forEach(function(btn) {
    if (btn.textContent.toLowerCase().includes('export')) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const fileName = e.target.closest('.file-row').querySelector('.file-name').textContent;
        toast('Starting export: ' + fileName);
      });
    }
  });

  // Category card interactions with visual feedback
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(function(card, index) {
    const categoryNameNode = card.querySelector('.category-name');
    if (!categoryNameNode) return;

    card.addEventListener('click', function() {
      toast('Viewing ' + categoryNameNode.textContent + ' category');
    });
    
    // Allow keyboard navigation
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Preview card interactions
  const previewCards = document.querySelectorAll('.preview-card');
  previewCards.forEach(function(card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', function() {
      const fileName = card.querySelector('.preview-name').textContent;
      toast('Preview: ' + fileName);
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Drag-drop: incoming files -> categories (Incoming view)
  setupIncomingDragAndDrop();

  // Project card click navigation
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function(card) {
    const titleElement = card.querySelector('.project-name');
    if (titleElement && !card.hasAttribute('onclick')) {
      // Already has onclick, don't add another listener
    }
  });

  // Breadcrumb navigation
  const breadcrumbs = document.querySelectorAll('.breadcrumb-item');
  breadcrumbs.forEach(function(crumb) {
    crumb.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        crumb.click();
      }
    });
  });
});
