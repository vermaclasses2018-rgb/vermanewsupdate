// Admin Panel Application
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { 
  ref, 
  push, 
  set, 
  get, 
  update, 
  remove, 
  onValue,
  query,
  orderByChild
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

let currentUser = null;
let currentSection = 'news';

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('admin-app')) {
    initializeAdmin();
  }
});

function initializeAdmin() {
  const auth = window.firebaseAuth;
  
  // Check auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      renderAdminPanel();
    } else {
      renderLoginForm();
    }
  });
}

function renderLoginForm() {
  const loginHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <i class="fas fa-shield-alt text-6xl text-blue-600 mb-4"></i>
          <h1 class="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p class="text-gray-600">VERMA NEWS Admin Panel</p>
        </div>
        
        <form id="loginForm" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="far fa-envelope mr-2"></i>Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              required
              class="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@verma-news.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-lock mr-2"></i>Password
            </label>
            <input 
              type="password" 
              id="password" 
              required
              class="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div id="loginError" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div>
          
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>Login to Admin Panel
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600">
          <p><i class="fas fa-info-circle mr-1"></i>Secure Firebase Authentication</p>
        </div>
        
        <div class="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p class="text-sm text-yellow-800">
            <strong>Setup Instructions:</strong><br>
            1. Go to Firebase Console<br>
            2. Enable Email/Password Authentication<br>
            3. Create admin user in Authentication section<br>
            4. Enable Realtime Database with proper rules
          </p>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('admin-app').innerHTML = loginHTML;
  
  // Handle login
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
      const auth = window.firebaseAuth;
      await signInWithEmailAndPassword(auth, email, password);
      // User will be redirected by onAuthStateChanged
    } catch (error) {
      errorDiv.textContent = `Login failed: ${error.message}`;
      errorDiv.classList.remove('hidden');
    }
  });
}

function renderAdminPanel() {
  const adminHTML = `
    <!-- Admin Sidebar -->
    <div class="admin-sidebar text-white">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-2">VERMA NEWS</h1>
        <p class="text-sm text-blue-200">Admin Panel</p>
      </div>
      
      <nav class="mt-6">
        <a href="#" onclick="switchSection('news')" data-section="news" class="nav-item flex items-center px-6 py-3 hover:bg-blue-700 transition">
          <i class="fas fa-newspaper mr-3"></i>News
        </a>
        <a href="#" onclick="switchSection('jobs')" data-section="jobs" class="nav-item flex items-center px-6 py-3 hover:bg-blue-700 transition">
          <i class="fas fa-briefcase mr-3"></i>Jobs
        </a>
        <a href="#" onclick="switchSection('results')" data-section="results" class="nav-item flex items-center px-6 py-3 hover:bg-blue-700 transition">
          <i class="fas fa-trophy mr-3"></i>Results
        </a>
        <a href="#" onclick="switchSection('answer-keys')" data-section="answer-keys" class="nav-item flex items-center px-6 py-3 hover:bg-blue-700 transition">
          <i class="fas fa-key mr-3"></i>Answer Keys
        </a>
         <a href="#" onclick="switchSection('admit-cards')" data-section="admit-cards" class="nav-item flex items-center px-6 py-3 hover:bg-blue-700 transition">
          <i class="fas fa-id-card mr-3"></i>Admit Cards
        </a>
        <a href="#" onclick="switchSection('analytics')" data-section="analytics" class="nav-item flex items-center px-6 py-3 hover:bg-blue-700 transition">
          <i class="fas fa-chart-bar mr-3"></i>Analytics
        </a>
      </nav>
      
      <div class="absolute bottom-0 w-full p-6 border-t border-blue-700">
        <div class="mb-4 text-sm">
          <p class="text-blue-200">Logged in as:</p>
          <p class="font-semibold truncate">${currentUser.email}</p>
        </div>
        <button onclick="handleLogout()" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition">
          <i class="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </div>
    </div>
    
    <!-- Admin Content -->
    <div class="admin-content">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800" id="sectionTitle">News Management</h2>
        <p class="text-gray-600">Create, edit, and manage content</p>
      </div>
      
      <div id="adminContent">
        <!-- Content will be loaded here -->
      </div>
    </div>
  `;
  
  document.getElementById('admin-app').innerHTML = adminHTML;
  
  // Load default section
  switchSection('news');
}

window.switchSection = function(section) {
  currentSection = section;
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('bg-blue-700');
  });
  document.querySelector(`[data-section="${section}"]`).classList.add('bg-blue-700');
  
  // Update title
  const titles = {
    'news': 'News Management',
    'jobs': 'Jobs Management',
    'results': 'Results Management',
    'answer-keys': 'Answer Keys Management',
    'admit-cards': 'Admit Card Management',
    'analytics': 'Analytics Dashboard'
  };
  document.getElementById('sectionTitle').textContent = titles[section];
  
  // Load section content
  if (section === 'analytics') {
    renderAnalytics();
  } else {
    renderContentManager(section);
  }
};

function renderContentManager(section) {
  const contentHTML = `
    <div class="grid lg:grid-cols-3 gap-8">
      
      <!-- Form Panel -->
      <div class="lg:col-span-1">
        <div class="admin-card sticky top-4">
          <h3 class="text-xl font-bold text-gray-800 mb-4">
            <i class="fas fa-plus-circle mr-2 text-blue-600"></i>Add New ${section.charAt(0).toUpperCase() + section.slice(1)}
          </h3>
          
          <form id="contentForm" class="space-y-4">
            <input type="hidden" id="editId" value="">
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input type="text" id="title" required class="form-input" placeholder="Enter title">
            </div>
            
            ${section === 'jobs' ? `
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
              <input type="text" id="organization" class="form-input" placeholder="e.g., SSC, Railway">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Vacancies</label>
                <input type="text" id="vacancies" class="form-input" placeholder="e.g., 5000">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input type="text" id="location" class="form-input" placeholder="All India">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Last Date</label>
              <input type="date" id="lastDate" class="form-input">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
              <input type="text" id="salary" class="form-input" placeholder="e.g., Rs. 25,000-50,000">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
              <input type="text" id="qualification" class="form-input" placeholder="e.g., 10th, 12th, Graduate">
            </div>
            ` : ''}
            
            ${section === 'results' || section === 'answer-keys' ? `
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Exam Name</label>
              <input type="text" id="examName" class="form-input" placeholder="e.g., SSC CGL 2025">
            </div>
            ` : ''}
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea id="description" rows="3" class="form-input" placeholder="Short description"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
              <textarea id="content" rows="6" required class="form-input" placeholder="Full content with details"></textarea>
            </div>
            
            ${section === 'jobs' ? `
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Apply Link</label>
              <input type="url" id="applyLink" class="form-input" placeholder="https://apply.example.com">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Notification Link</label>
              <input type="url" id="notificationLink" class="form-input" placeholder="https://notification.pdf">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Official Website</label>
              <input type="url" id="officialWebsite" class="form-input" placeholder="https://official.gov.in">
            </div>
            ` : ''}
            
            ${section === 'results' ? `
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Result Link</label>
              <input type="url" id="resultLink" class="form-input" placeholder="https://result.gov.in">
            </div>
            ` : ''}
            
            ${section === 'answer-keys' ? `
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Answer Key Link</label>
              <input type="url" id="answerKeyLink" class="form-input" placeholder="https://answerkey.pdf">
            </div>
            ` : ''}

             ${section === 'admit-cards' ? `
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Admit Card Link</label>
              <input type="url" id="resultLink" class="form-input" placeholder="https://admitcard.gov.in">
            </div>
            ` : ''}
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Upload PDF/Document</label>
              <div class="file-upload-area" id="fileUploadArea">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                <p class="text-gray-600">Click or drag file to upload</p>
                <p class="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (Max 10MB)</p>
                <input type="file" id="fileInput" accept=".pdf,.doc,.docx" class="hidden">
              </div>
              <div id="uploadStatus" class="mt-2 text-sm"></div>
            </div>
            
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="checkbox" id="isNew" class="mr-2">
                <span class="text-sm font-semibold text-gray-700">Mark as NEW</span>
              </label>
              
              ${section === 'jobs' ? `
              <label class="flex items-center">
                <input type="checkbox" id="isHot" class="mr-2">
                <span class="text-sm font-semibold text-gray-700">Mark as HOT</span>
              </label>
              ` : ''}
            </div>
            
            <div class="flex gap-2">
              <button type="submit" class="btn-primary text-white px-6 py-3 rounded-lg font-semibold flex-1">
                <i class="fas fa-save mr-2"></i><span id="submitBtnText">Save</span>
              </button>
              <button type="button" onclick="resetForm()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold">
                <i class="fas fa-times mr-2"></i>Clear
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- List Panel -->
      <div class="lg:col-span-2">
        <div class="admin-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">
              <i class="fas fa-list mr-2 text-blue-600"></i>All ${section.charAt(0).toUpperCase() + section.slice(1)}
            </h3>
            <div class="text-sm text-gray-600">
              Total: <span id="totalCount" class="font-bold text-blue-600">0</span>
            </div>
          </div>
          
          <div id="contentList" class="space-y-4">
            <!-- Content items will be loaded here -->
            <div class="text-center py-12 text-gray-500">
              <div class="loading-spinner mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;
  
  document.getElementById('adminContent').innerHTML = contentHTML;
  
  // Setup file upload
  setupFileUpload();
  
  // Setup form handler
  setupFormHandler(section);
  
  // Load content list
  loadContentList(section);
}

function setupFileUpload() {
  const uploadArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('fileInput');
  
  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  });
}

async function handleFileUpload(file) {
  const statusDiv = document.getElementById('uploadStatus');
  
  if (file.size > 10 * 1024 * 1024) {
    statusDiv.innerHTML = '<span class="text-red-600"><i class="fas fa-times-circle mr-1"></i>File too large (max 10MB)</span>';
    return;
  }
  
  try {
    statusDiv.innerHTML = '<span class="text-blue-600"><i class="fas fa-spinner fa-spin mr-1"></i>Uploading...</span>';
    
    const storage = window.firebaseStorage;
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, `documents/${fileName}`);
    
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    // Store URL in hidden input or data attribute
    document.getElementById('fileUploadArea').dataset.fileUrl = downloadURL;
    
    statusDiv.innerHTML = `<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>Uploaded: ${file.name}</span>`;
  } catch (error) {
    console.error('Upload error:', error);
    statusDiv.innerHTML = '<span class="text-red-600"><i class="fas fa-times-circle mr-1"></i>Upload failed</span>';
  }
}

function setupFormHandler(section) {
  document.getElementById('contentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveContent(section);
  });
}

async function saveContent(section) {
  const db = window.firebaseDatabase;
  const editId = document.getElementById('editId').value;
  
  // Map section to Firebase path
  const dbPaths = {
    'news': 'news',
    'jobs': 'jobs',
    'results': 'results',
    'answer-keys': 'answerKeys'
  };
  
  const dbPath = dbPaths[section];
  
  // Collect form data
  const data = {
    title: document.getElementById('title').value,
    description: document.getElementById('description')?.value || '',
    content: document.getElementById('content').value,
    isNew: document.getElementById('isNew').checked,
    timestamp: Date.now(),
    views: 0
  };
  
  // Add section-specific fields
  if (section === 'jobs') {
    data.organization = document.getElementById('organization')?.value || '';
    data.vacancies = document.getElementById('vacancies')?.value || '';
    data.location = document.getElementById('location')?.value || '';
    data.lastDate = document.getElementById('lastDate')?.value || '';
    data.salary = document.getElementById('salary')?.value || '';
    data.qualification = document.getElementById('qualification')?.value || '';
    data.applyLink = document.getElementById('applyLink')?.value || '';
    data.notificationLink = document.getElementById('notificationLink')?.value || '';
    data.officialWebsite = document.getElementById('officialWebsite')?.value || '';
    data.isHot = document.getElementById('isHot')?.checked || false;
  }
  
  if (section === 'results' || section === 'answer-keys') {
    data.examName = document.getElementById('examName')?.value || '';
  }
  
  if (section === 'results') {
    data.resultLink = document.getElementById('resultLink')?.value || '';
  }
  
  if (section === 'answer-keys') {
    data.answerKeyLink = document.getElementById('answerKeyLink')?.value || '';
  }
  
  // Add uploaded file URL
  const fileUrl = document.getElementById('fileUploadArea').dataset.fileUrl;
  if (fileUrl) {
    data.pdfUrl = fileUrl;
  }
  
  try {
    if (editId) {
      // Update existing
      await update(ref(db, `${dbPath}/${editId}`), data);
      alert('Updated successfully!');
    } else {
      // Create new
      await push(ref(db, dbPath), data);
      alert('Created successfully!');
    }
    
    resetForm();
    loadContentList(section);
  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving: ' + error.message);
  }
}

window.resetForm = function() {
  document.getElementById('contentForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('submitBtnText').textContent = 'Save';
  document.getElementById('fileUploadArea').dataset.fileUrl = '';
  document.getElementById('uploadStatus').innerHTML = '';
};

function loadContentList(section) {
  const db = window.firebaseDatabase;
  
  const dbPaths = {
    'news': 'news',
    'jobs': 'jobs',
    'results': 'results',
    'answer-keys': 'answerKeys'
  };
  
  const dbPath = dbPaths[section];
  const listRef = query(ref(db, dbPath), orderByChild('timestamp'));
  
  onValue(listRef, (snapshot) => {
    const listContainer = document.getElementById('contentList');
    listContainer.innerHTML = '';
    
    if (!snapshot.exists()) {
      listContainer.innerHTML = '<div class="text-center py-12 text-gray-500"><i class="fas fa-inbox text-4xl mb-4"></i><p>No items yet</p></div>';
      document.getElementById('totalCount').textContent = '0';
      return;
    }
    
    const items = [];
    snapshot.forEach((child) => {
      items.push({ id: child.key, ...child.val() });
    });
    
    // Reverse to show latest first
    items.reverse();
    
    document.getElementById('totalCount').textContent = items.length;
    
    items.forEach((item) => {
      const card = createListItemCard(item, section);
      listContainer.insertAdjacentHTML('beforeend', card);
    });
  });
}

function createListItemCard(item, section) {
  const date = new Date(item.timestamp).toLocaleDateString('en-IN');
  
  return `
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <h4 class="font-bold text-gray-800 text-lg mb-1">${item.title}</h4>
          <p class="text-sm text-gray-600 mb-2">${item.description || ''}</p>
          <div class="flex items-center space-x-4 text-xs text-gray-500">
            <span><i class="far fa-calendar mr-1"></i>${date}</span>
            <span><i class="fas fa-eye mr-1"></i>${item.views || 0} views</span>
            ${item.isNew ? '<span class="badge-new text-white px-2 py-1 rounded-full">NEW</span>' : ''}
            ${item.isHot ? '<span class="badge-hot text-white px-2 py-1 rounded-full">HOT</span>' : ''}
          </div>
        </div>
        <div class="flex space-x-2 ml-4">
          <button onclick='editContent(${JSON.stringify(item)}, "${section}")' class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick='deleteContent("${item.id}", "${section}")' class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

window.editContent = function(item, section) {
  document.getElementById('editId').value = item.id;
  document.getElementById('title').value = item.title;
  document.getElementById('description').value = item.description || '';
  document.getElementById('content').value = item.content || '';
  document.getElementById('isNew').checked = item.isNew || false;
  
  if (section === 'jobs') {
    document.getElementById('organization').value = item.organization || '';
    document.getElementById('vacancies').value = item.vacancies || '';
    document.getElementById('location').value = item.location || '';
    document.getElementById('lastDate').value = item.lastDate || '';
    document.getElementById('salary').value = item.salary || '';
    document.getElementById('qualification').value = item.qualification || '';
    document.getElementById('applyLink').value = item.applyLink || '';
    document.getElementById('notificationLink').value = item.notificationLink || '';
    document.getElementById('officialWebsite').value = item.officialWebsite || '';
    document.getElementById('isHot').checked = item.isHot || false;
  }
  
  if (section === 'results' || section === 'answer-keys') {
    document.getElementById('examName').value = item.examName || '';
  }
  
  if (section === 'results') {
    document.getElementById('resultLink').value = item.resultLink || '';
  }
  
  if (section === 'answer-keys') {
    document.getElementById('answerKeyLink').value = item.answerKeyLink || '';
  }
  
  if (item.pdfUrl) {
    document.getElementById('fileUploadArea').dataset.fileUrl = item.pdfUrl;
    document.getElementById('uploadStatus').innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>File attached</span>';
  }
  
  document.getElementById('submitBtnText').textContent = 'Update';
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteContent = async function(id, section) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  const db = window.firebaseDatabase;
  
  const dbPaths = {
    'news': 'news',
    'jobs': 'jobs',
    'results': 'results',
    'answer-keys': 'answerKeys'
  };
  
  const dbPath = dbPaths[section];
  
  try {
    await remove(ref(db, `${dbPath}/${id}`));
    alert('Deleted successfully!');
    loadContentList(section);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting: ' + error.message);
  }
};

function renderAnalytics() {
  const analyticsHTML = `
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="admin-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm mb-1">Total News</p>
            <h3 class="text-3xl font-bold" id="totalNews">0</h3>
          </div>
          <i class="fas fa-newspaper text-5xl text-blue-300 opacity-50"></i>
        </div>
      </div>
      
      <div class="admin-card bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm mb-1">Total Jobs</p>
            <h3 class="text-3xl font-bold" id="totalJobs">0</h3>
          </div>
          <i class="fas fa-briefcase text-5xl text-green-300 opacity-50"></i>
        </div>
      </div>
      
      <div class="admin-card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm mb-1">Total Results</p>
            <h3 class="text-3xl font-bold" id="totalResults">0</h3>
          </div>
          <i class="fas fa-trophy text-5xl text-yellow-300 opacity-50"></i>
        </div>
      </div>
      
      <div class="admin-card bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-100 text-sm mb-1">Total Answer Keys</p>
            <h3 class="text-3xl font-bold" id="totalKeys">0</h3>
          </div>
          <i class="fas fa-key text-5xl text-red-300 opacity-50"></i>
        </div>
      </div>
    </div>
    
    <div class="admin-card">
      <h3 class="text-xl font-bold text-gray-800 mb-6">
        <i class="fas fa-chart-line mr-2 text-blue-600"></i>Recent Activity
      </h3>
      <div class="text-center text-gray-500 py-12">
        <i class="fas fa-info-circle text-4xl mb-4"></i>
        <p>Analytics dashboard with view counts and engagement metrics</p>
      </div>
    </div>
  `;
  
  document.getElementById('adminContent').innerHTML = analyticsHTML;
  
  // Load analytics data
  loadAnalytics();
}

async function loadAnalytics() {
  const db = window.firebaseDatabase;
  
  try {
    const newsSnapshot = await get(ref(db, 'news'));
    const jobsSnapshot = await get(ref(db, 'jobs'));
    const resultsSnapshot = await get(ref(db, 'results'));
    const keysSnapshot = await get(ref(db, 'answerKeys'));
    
    document.getElementById('totalNews').textContent = newsSnapshot.exists() ? Object.keys(newsSnapshot.val()).length : 0;
    document.getElementById('totalJobs').textContent = jobsSnapshot.exists() ? Object.keys(jobsSnapshot.val()).length : 0;
    document.getElementById('totalResults').textContent = resultsSnapshot.exists() ? Object.keys(resultsSnapshot.val()).length : 0;
    document.getElementById('totalKeys').textContent = keysSnapshot.exists() ? Object.keys(keysSnapshot.val()).length : 0;
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

window.handleLogout = async function() {
  if (!confirm('Are you sure you want to logout?')) return;
  
  try {
    const auth = window.firebaseAuth;
    await signOut(auth);
    // Will redirect to login by onAuthStateChanged
  } catch (error) {
    console.error('Logout error:', error);
    alert('Logout failed');
  }
};
