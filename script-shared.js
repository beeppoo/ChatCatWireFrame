// Shared data for all pages
const workspaces = [
  { name: 'demo-main', tags: 248, attachments: 48, messages: 1203, recentFiles: [
    { name: 'PHOTO-2025-12-11-12-19-08', type: 'JPG', date: '11/12/2025' },
    { name: 'VIDEO-2025-11-11-14-14-14', type: 'MP4', date: '11/11/2025' },
    { name: 'PHOTO-2025-07-28-14-06-28', type: 'JPG', date: '28/07/2025' }
  ]},
  { name: 'family-reunion', tags: 112, attachments: 24, messages: 456, recentFiles: [
    { name: 'family-photos-2025', type: 'ZIP', date: '15/12/2025' },
    { name: 'reunion-notes', type: 'DOC', date: '10/12/2025' }
  ]},
  { name: 'client-nyp', tags: 362, attachments: 89, messages: 2341, recentFiles: [
    { name: 'project-proposal-v3', type: 'PDF', date: '20/01/2026' },
    { name: 'wireframes-final', type: 'FIG', date: '18/01/2026' },
    { name: 'requirements', type: 'DOC', date: '15/01/2026' }
  ]},
  { name: 'uni-math', tags: 76, attachments: 12, messages: 234, recentFiles: [
    { name: 'assignment-solutions', type: 'PDF', date: '19/01/2026' },
    { name: 'lecture-notes', type: 'PDF', date: '17/01/2026' }
  ]},
];

const queue = [
  { file: 'WA-2026-01-zip', status: 'Processing - 68%' },
  { file: 'family-chat-2025.zip', status: 'Queued' },
  { file: 'project-nyp-phase2.zip', status: 'Imported - 2h ago' },
];

const emotions = [
  { who: 'Kai', tone: 'Worried - needs reassurance', msg: 'Not sure I can submit on time, the laptop crashed again.' },
  { who: 'Jasmine', tone: 'Relieved - optimistic', msg: 'The client approved the changes. Lets wrap the last tweaks.' },
  { who: 'Dad', tone: 'Confused - neutral', msg: 'Is this the right group for the reunion pictures?' },
  { who: 'Mom', tone: 'Warm - appreciative', msg: 'Thanks for sorting all the photos! They look great.' },
];

const recentUploads = [
  { name: 'Sim Family GC', time: '5 MB', status: 'completed' },
  { name: 'Church Group', time: '15 MB', status: 'completed' },
  { name: 'Work Group Chat', time: '25 MB', status: 'completed' },
  { name: 'Old Friends Reunion', time: '5MB', status: 'completed' },
  { name: 'Mahjong Nights', time: '4 MB', status: 'processing' },
];

// DOM elements
const toastContainer = document.getElementById('toastContainer');
const sidebarToggle = document.getElementById('sidebarToggle');
const seniorToggles = document.querySelectorAll('.senior-toggle-input');
const appRoot = document.getElementById('app');

// Toast notification
function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  toastContainer.appendChild(node);
  requestAnimationFrame(function() { node.classList.add('show'); });
  setTimeout(function() { node.classList.remove('show'); }, 2400);
  setTimeout(function() { node.remove(); }, 2800);
}

// Sidebar toggle
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const app = document.querySelector('.app');
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
      app.style.gridTemplateColumns = '86px 1fr';
      sidebar.style.width = '86px';
      sidebarToggle.textContent = '▶';
    } else {
      app.style.gridTemplateColumns = '280px 1fr';
      sidebar.style.width = '280px';
      sidebarToggle.textContent = '◀';
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
