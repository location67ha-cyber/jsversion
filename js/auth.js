// ============================================
// AUTHENTIFICATION ADMIN (simple, côté client)
// ============================================

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'Admin2024!'

function isAdminLoggedIn() {
  return sessionStorage.getItem('admin_auth') === 'true'
}

function adminLogin(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem('admin_auth', 'true')
    return true
  }
  return false
}

function adminLogout() {
  sessionStorage.removeItem('admin_auth')
  window.location.href = '/admin/login.html'
}

function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = '/admin/login.html'
  }
}
