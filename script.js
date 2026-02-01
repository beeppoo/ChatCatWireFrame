// Dashboard script for index.html
const toastContainer = document.getElementById('toastContainer');
const loginOverlay = document.getElementById('loginOverlay');
const loginEmailInput = document.getElementById('loginEmail');
const loginSeniorChoice = document.getElementById('loginSeniorChoice');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginDismissBtn = document.getElementById('loginDismissBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const seniorToggles = document.querySelectorAll('.senior-toggle-input');
const appRoot = document.getElementById('app');
const loginBtn = document.getElementById('loginBtn');

// Toast notification
function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  if (toastContainer) {
    toastContainer.appendChild(node);
    requestAnimationFrame(function() { node.classList.add('show'); });
    setTimeout(function() { node.classList.remove('show'); }, 2400);
    setTimeout(function() { node.remove(); }, 2800);
  }
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

// Login functions
function openLoginOverlay() {
  if (loginOverlay) loginOverlay.style.display = 'flex';
}

function closeLoginOverlay() {
  if (loginOverlay) loginOverlay.style.display = 'none';
}

function completeLogin(useSenior) {
  const prefersSenior = !!useSenior;
  if (loginBtn) {
    loginBtn.textContent = 'Logged in';
    loginBtn.classList.add('pill');
  }
  setSeniorMode(prefersSenior);
  toast(prefersSenior ? 'Logged in with senior UI' : 'You are now logged in.');
  closeLoginOverlay();
}

// Event listeners
if (loginBtn) {
  loginBtn.addEventListener('click', openLoginOverlay);
}

if (loginSubmitBtn) {
  loginSubmitBtn.addEventListener('click', function() {
    completeLogin(loginSeniorChoice && loginSeniorChoice.checked);
  });
}

if (loginEmailInput) {
  loginEmailInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      completeLogin(loginSeniorChoice && loginSeniorChoice.checked);
    }
  });
}

if (loginDismissBtn) {
  loginDismissBtn.addEventListener('click', closeLoginOverlay);
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

// Senior mode toggle
if (seniorToggles.length) {
  seniorToggles.forEach(function(toggle) {
    toggle.addEventListener('change', function(e) {
      setSeniorMode(e.target.checked);
    });
  });
}
