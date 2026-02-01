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
  }
  
  switchScreen('files');
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
    card.addEventListener('click', function() {
      const categoryName = card.querySelector('.category-name').textContent;
      toast('Viewing ' + categoryName + ' category');
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
  const incomingFiles = document.querySelectorAll('#files-incoming-view .file-placeholder');
  incomingFiles.forEach(function(file) {
    file.setAttribute('draggable', 'true');
    file.addEventListener('dragstart', function(e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', file.dataset.fileName || file.textContent.trim());
    });
  });

  const incomingDropTargets = document.querySelectorAll('#files-incoming-view .category-card');
  incomingDropTargets.forEach(function(card) {
    const categoryNameNode = card.querySelector('.category-name');
    const categoryName = categoryNameNode ? categoryNameNode.textContent : 'Category';
    let originalShadow = card.style.boxShadow;

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
      const fileName = e.dataTransfer.getData('text/plain') || 'File';
      handleCategoryDrop(categoryName, fileName);
    });
  });

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
