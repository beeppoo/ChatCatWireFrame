// Page-specific shared functions

// Workspaces page functions
function renderWorkspacesList() {
  const listEl = document.getElementById('workspacesList');
  if (!listEl) return;
  
  listEl.innerHTML = '';
  
  if (workspaces.length === 0) {
    listEl.innerHTML = '<p class="muted" style="padding: 20px; text-align: center;">No workspaces yet. Create one to get started.</p>';
    return;
  }
  
  workspaces.forEach(function(w, index) {
    const item = document.createElement('div');
    item.className = 'workspace-item';
    item.innerHTML = '<div class="workspace-item-info"><div><div class="workspace-item-name">' + w.name + '</div><div class="workspace-item-count">' + w.tags + ' tags</div></div></div><div class="workspace-item-actions"><button class="ghost" data-action="edit" data-index="' + index + '">Edit</button><button class="ghost" data-action="delete" data-index="' + index + '">Delete</button></div>';
    
    const infoSection = item.querySelector('.workspace-item-info');
    const editBtn = item.querySelector('[data-action="edit"]');
    const deleteBtn = item.querySelector('[data-action="delete"]');
    
    if (infoSection) {
      infoSection.addEventListener('click', function() {
        showWorkspaceDetail(index);
      });
    }
    
    if (editBtn) {
      editBtn.addEventListener('click', function() {
        renameWorkspace(index);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        deleteWorkspace(index);
      });
    }
    
    listEl.appendChild(item);
  });
}

function renderQueue() {
  const queueEl = document.getElementById('queueList');
  if (!queueEl) return;
  
  queueEl.innerHTML = '';
  queue.forEach(function(q) {
    const li = document.createElement('li');
    li.className = 'list__item';
    li.innerHTML = '<span>' + q.file + '</span><span class="muted">' + q.status + '</span>';
    queueEl.appendChild(li);
  });
}

function renderEmotions() {
  const emotionEl = document.getElementById('emotionList');
  if (!emotionEl) return;
  
  emotionEl.innerHTML = '';
  emotions.forEach(function(e) {
    const card = document.createElement('div');
    card.className = 'emotion__item';
    card.innerHTML = '<p class="emotion__title">' + e.who + '</p><p class="emotion__tone">' + e.tone + '</p><p class="muted">"' + e.msg + '"</p>';
    emotionEl.appendChild(card);
  });
}

function renderRecentUploads() {
  const uploadsList = document.getElementById('uploadsList');
  if (!uploadsList) return;
  
  uploadsList.innerHTML = '';
  recentUploads.forEach(function(upload) {
    const item = document.createElement('div');
    item.className = 'upload-item';
    const statusClass = upload.status === 'completed' ? 'completed' : 'processing';
    item.innerHTML = '<div class="upload-status"><div class="status-dot ' + statusClass + '"></div><div><p class="upload-name">' + upload.name + '</p><p class="upload-meta">' + upload.time + '</p></div></div><button class="ghost" style="font-size: 12px;">⋮</button>';
    uploadsList.appendChild(item);
  });
}

function showWorkspaceDetail(index) {
  const workspace = workspaces[index];
  if (!workspace) return;
  
  const detailPanel = document.getElementById('workspaceDetailPanel');
  const detailTitle = document.getElementById('workspaceDetailTitle');
  const detailContent = document.getElementById('workspaceDetailContent');
  
  if (!detailPanel || !detailTitle || !detailContent) return;
  
  detailTitle.textContent = workspace.name;
  
  let html = '<div class="workspace-stat">';
  html += '<div class="stat-box"><div class="stat-label">Messages</div><p class="stat-value">' + workspace.messages + '</p></div>';
  html += '<div class="stat-box"><div class="stat-label">Attachments</div><p class="stat-value">' + workspace.attachments + '</p></div>';
  html += '<div class="stat-box"><div class="stat-label">Messages tagged</div><p class="stat-value">' + workspace.tags + '</p></div>';
  html += '</div>';
  
  html += '<div class="workspace-tags-section">';
  html += '<div class="workspace-tags-header">';
  html += '<h4>AI Generated Tags</h4>';
  html += '<button class="primary" data-generate-tags="' + index + '">Generate tags</button>';
  html += '</div>';
  html += '<div class="workspace-tags-list" id="tagsList-' + index + '">';
  
  if (workspace.generatedTags && workspace.generatedTags.length > 0) {
    workspace.generatedTags.forEach(function(tag) {
      html += '<div class="tag-chip"><span class="tag-label">' + tag.name + '</span><span class="tag-count">' + tag.count + '</span></div>';
    });
  } else {
    html += '<p class="muted" style="padding: 16px; text-align: center; font-size: 14px;">No tags generated yet. Click "Generate tags" to analyze messages.</p>';
  }
  
  html += '</div></div>';
  
  if (workspace.recentFiles && workspace.recentFiles.length > 0) {
    html += '<div class="workspace-attachments"><h4>Recent files</h4>';
    workspace.recentFiles.forEach(function(file) {
      html += '<div class="attachment-sample"><div class="attachment-icon">' + file.type + '</div><div class="attachment-name"><p class="attachment-name-text">' + file.name + '</p><div class="attachment-date">' + file.date + '</div></div></div>';
    });
    html += '</div>';
  }
  
  detailContent.innerHTML = html;
  detailPanel.style.display = 'block';
  const listPanel = document.querySelector('.panel');
  if (listPanel) listPanel.style.display = 'none';
  
  const generateTagsBtn = detailContent.querySelector('[data-generate-tags]');
  if (generateTagsBtn) {
    generateTagsBtn.addEventListener('click', function() {
      generateWorkspaceTags(index);
    });
  }
}

function generateWorkspaceTags(workspaceIndex) {
  const workspace = workspaces[workspaceIndex];
  if (!workspace) return;
  
  const sampleTags = [
    { name: 'Work', count: Math.floor(Math.random() * 100) + 20 },
    { name: 'Family', count: Math.floor(Math.random() * 80) + 10 },
    { name: 'Photos', count: Math.floor(Math.random() * 60) + 15 },
    { name: 'Important', count: Math.floor(Math.random() * 40) + 5 },
    { name: 'Urgent', count: Math.floor(Math.random() * 30) + 3 },
    { name: 'Meeting', count: Math.floor(Math.random() * 50) + 8 },
    { name: 'Project', count: Math.floor(Math.random() * 70) + 12 },
    { name: 'Social', count: Math.floor(Math.random() * 45) + 6 }
  ];
  
  workspace.generatedTags = sampleTags;
  workspace.tags = sampleTags.reduce(function(sum, tag) { return sum + tag.count; }, 0);
  
  toast('Generated ' + sampleTags.length + ' tags for "' + workspace.name + '"');
  showWorkspaceDetail(workspaceIndex);
  renderWorkspacesList();
}

function createWorkspace() {
  const input = document.getElementById('workspaceNameInput');
  const name = input ? input.value.trim() : '';
  if (!name) {
    toast('Workspace name required.');
    return;
  }
  workspaces.push({ name: name, tags: 0, attachments: 0, messages: 0, recentFiles: [] });
  renderWorkspacesList();
  if (input) input.value = '';
  toast('Workspace created: ' + name);
}

function renameWorkspace(index) {
  const newName = prompt('New workspace name:', workspaces[index].name);
  if (newName && newName.trim()) {
    workspaces[index].name = newName.trim();
    renderWorkspacesList();
    toast('Workspace renamed to ' + newName);
  }
}

function deleteWorkspace(index) {
  const confirmDelete = confirm('Delete workspace "' + workspaces[index].name + '"?');
  if (confirmDelete) {
    const deleted = workspaces.splice(index, 1);
    renderWorkspacesList();
    toast('Deleted: ' + deleted[0].name);
  }
}

function validateWhatsappUploadFile(file) {
  if (!file || !file.name) {
    return { valid: false, reason: 'missing' };
  }

  const fileName = file.name.toLowerCase();
  if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
    return { valid: false, reason: 'pdf' };
  }

  if (fileName.endsWith('.zip')) {
    return { valid: true };
  }

  return { valid: false, reason: 'unsupported' };
}

function handleWhatsappUploadSelection(file, fileInput) {
  const validation = validateWhatsappUploadFile(file);
  if (!validation.valid) {
    if (validation.reason === 'pdf') {
      toast('PDF files are not allowed here. Please upload a WhatsApp .zip export.');
    } else {
      toast('Only WhatsApp .zip exports are supported on this page.');
    }

    if (fileInput) fileInput.value = '';
    return;
  }

  simulateUpload(file.name);
}

// Initialize page-specific elements
document.addEventListener('DOMContentLoaded', function() {
  // Workspaces page setup
  const createWorkspaceBtn = document.getElementById('createWorkspaceBtn');
  const workspaceNameInput = document.getElementById('workspaceNameInput');
  const backToWorkspacesBtn = document.getElementById('backToWorkspacesBtn');
  const importBtn = document.getElementById('importBtn');
  
  if (createWorkspaceBtn) {
    createWorkspaceBtn.addEventListener('click', createWorkspace);
  }
  
  if (workspaceNameInput) {
    workspaceNameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') createWorkspace();
    });
  }
  
  if (backToWorkspacesBtn) {
    backToWorkspacesBtn.addEventListener('click', function() {
      document.getElementById('workspaceDetailPanel').style.display = 'none';
      document.querySelector('.panel').style.display = 'block';
    });
  }
  
  if (importBtn) {
    importBtn.addEventListener('click', function() {
      const fileName = 'whatsapp-import-' + Date.now().toString().slice(-4) + '.zip';
      queue.unshift({ file: fileName, status: 'Queued now' });
      renderQueue();
      toast('Import added to queue.');
    });
  }
  
  // Emotion scan page setup
  const scanEmotionBtn = document.getElementById('scanEmotionBtn');
  const emotionInput = document.getElementById('emotionInput');
  
  if (scanEmotionBtn) {
    scanEmotionBtn.addEventListener('click', function() {
      const sample = emotionInput ? emotionInput.value.trim() : '';
      if (!sample) {
        toast('Paste or type a message to scan.');
        return;
      }
      emotions.unshift({ who: 'AI Scan', tone: 'Detected: thoughtful - slightly stressed', msg: sample });
      renderEmotions();
      toast('Emotion scan completed');
    });
  }
  
  // Upload page setup
  const browseBtn = document.getElementById('browseBtn');
  const fileInput = document.getElementById('fileInput');
  const scanBtn = document.getElementById('scanBtn');
  const uploadProgress = document.getElementById('uploadProgress');
  
  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', function() {
      fileInput.click();
    });
  }
  
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        handleWhatsappUploadSelection(file, fileInput);
      }
    });
  }
  
  if (scanBtn) {
    scanBtn.addEventListener('click', function() {
      toast('Scanning uploaded file...');
    });
  }
  
  // Render initial data
  renderWorkspacesList();
  renderQueue();
  renderEmotions();
  renderRecentUploads();
});

// Simulate file upload with progress
function simulateUpload(fileName) {
  const uploadProgress = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('progressFill');
  const fileNameSpan = document.getElementById('fileName');
  
  if (uploadProgress && progressFill && fileNameSpan) {
    uploadProgress.style.display = 'block';
    fileNameSpan.textContent = fileName;
    
    let progress = 0;
    const interval = setInterval(function() {
      progress += Math.random() * 30;
      if (progress > 100) progress = 100;
      progressFill.style.width = progress + '%';
      
      if (progress === 100) {
        clearInterval(interval);
        recentUploads.unshift({ name: fileName, time: 'Just now', status: 'completed' });
        renderRecentUploads();
        setTimeout(function() {
          uploadProgress.style.display = 'none';
          progressFill.style.width = '0%';
        }, 1000);
        toast('File uploaded successfully!');
      }
    }, 300);
  }
}
