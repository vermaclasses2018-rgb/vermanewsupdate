// Main Frontend Application
import { ref, onValue, query, orderByChild, limitToLast } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Update current date and time
  updateDateTime();
  
  // Initialize app if on main page
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    initializeApp();
  }
});

function updateDateTime() {
  const dateElement = document.getElementById('currentDate');
  const timeElement = document.getElementById('currentTime');
  
  if (dateElement) {
    const date = new Date();
    dateElement.textContent = date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  if (timeElement) {
    const time = new Date();
    timeElement.textContent = time.toLocaleTimeString('en-IN');
  }
}

function initializeApp() {
  const db = window.firebaseDatabase;
  
  // Load data from Firebase (content already in HTML)
  loadLatestNews();
  loadLatestJobs();
  loadLatestResults();
  loadLatestAnswerKeys();
  loadLatestAdmitCards();
}




function loadLatestNews() {
  const db = window.firebaseDatabase;
  const newsRef = query(ref(db, 'news'), orderByChild('timestamp'), limitToLast(2000000));
  
  onValue(newsRef, (snapshot) => {
    const newsContainer = document.getElementById('latest-news');
    newsContainer.innerHTML = '';
    
    if (!snapshot.exists()) {
      newsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12"><i class="fas fa-inbox text-4xl mb-4"></i><p>No news available yet. Check back soon!</p></div>';
      return;
    }
    
    const newsArray = [];
    snapshot.forEach((childSnapshot) => {
      newsArray.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to show latest first
    newsArray.reverse();
    
    newsArray.forEach((item) => {
      const card = createNewsCard(item);
      newsContainer.insertAdjacentHTML('beforeend', card);
    });
  });
}

function createNewsCard(item) {
  const date = new Date(item.timestamp).toLocaleDateString('en-IN');
  const badge = item.isNew ? '<span class="badge-new text-white text-xs px-2 py-1 rounded-full">NEW</span>' : '';
  
  return `
    <div class="news-card rounded-lg shadow-md p-6 hover:shadow-xl" onclick="window.location.href='news-detail.html?id=${item.id}'">
      <div class="flex justify-between items-start mb-3">
        <span class="text-xs text-gray-500"><i class="far fa-calendar mr-1"></i> ${date}</span>
        ${badge}
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${item.title}</h3>
      <p class="text-gray-600 mb-4 line-clamp-2">${item.description || ''}</p>
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-600 font-semibold">
          <i class="fas fa-eye mr-1"></i> ${item.views || 0} views
        </span>
        <button class="text-blue-600 hover:text-blue-800 font-semibold">
          Read More <i class="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
    </div>
  `;
}

function loadLatestJobs() {
  const db = window.firebaseDatabase;
  const jobsRef = query(ref(db, 'jobs'), orderByChild('timestamp'), limitToLast(8));
  
  onValue(jobsRef, (snapshot) => {
    const jobsContainer = document.getElementById('latest-jobs-list');
    jobsContainer.innerHTML = '';
    
    if (!snapshot.exists()) {
      jobsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12"><i class="fas fa-inbox text-4xl mb-4"></i><p>No jobs available yet. Check back soon!</p></div>';
      return;
    }
    
    const jobsArray = [];
    snapshot.forEach((childSnapshot) => {
      jobsArray.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to show latest first
    jobsArray.reverse();
    
    jobsArray.forEach((item) => {
      const card = createJobCard(item);
      jobsContainer.insertAdjacentHTML('beforeend', card);
    });
  });
}

function createJobCard(item) {
  const date = new Date(item.timestamp).toLocaleDateString('en-IN');
  const lastDate = item.lastDate ? new Date(item.lastDate).toLocaleDateString('en-IN') : 'N/A';
  const badge = item.isHot ? '<span class="badge-hot text-white text-xs px-2 py-1 rounded-full">HOT</span>' : '';
  
  return `
    <div class="job-card news-card rounded-lg shadow-md p-6 hover:shadow-xl" onclick="window.location.href='job-detail.html?id=${item.id}'">
      <div class="flex justify-between items-start mb-3">
        <span class="text-xs text-gray-500"><i class="far fa-calendar mr-1"></i> Posted: ${date}</span>
        ${badge}
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${item.title}</h3>
      <div class="space-y-2 mb-4">
        <p class="text-sm text-gray-600"><i class="fas fa-building mr-2 text-green-600"></i><strong>Organization:</strong> ${item.organization || 'N/A'}</p>
        <p class="text-sm text-gray-600"><i class="fas fa-map-marker-alt mr-2 text-green-600"></i><strong>Location:</strong> ${item.location || 'All India'}</p>
        <p class="text-sm text-gray-600"><i class="fas fa-users mr-2 text-green-600"></i><strong>Vacancies:</strong> ${item.vacancies || 'N/A'}</p>
        <p class="text-sm text-red-600 font-semibold"><i class="far fa-clock mr-2"></i><strong>Last Date:</strong> ${lastDate}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-apply text-white px-4 py-2 rounded-lg font-semibold flex-1">
          <i class="fas fa-external-link-alt mr-1"></i> Apply Now
        </button>
        <button class="btn-primary text-white px-4 py-2 rounded-lg font-semibold flex-1">
          <i class="fas fa-info-circle mr-1"></i> Details
        </button>
      </div>
    </div>
  `;
}

function loadLatestResults() {
  const db = window.firebaseDatabase;
  const resultsRef = query(ref(db, 'results'), orderByChild('timestamp'), limitToLast(2000000));
  
  onValue(resultsRef, (snapshot) => {
    const resultsContainer = document.getElementById('latest-results');
    resultsContainer.innerHTML = '';
    
    if (!snapshot.exists()) {
      resultsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12"><i class="fas fa-inbox text-4xl mb-4"></i><p>No results available yet. Check back soon!</p></div>';
      return;
    }
    
    const resultsArray = [];
    snapshot.forEach((childSnapshot) => {
      resultsArray.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to show latest first
    resultsArray.reverse();
    
    resultsArray.forEach((item) => {
      const card = createResultCard(item);
      resultsContainer.insertAdjacentHTML('beforeend', card);
    });
  });
}

function createResultCard(item) {
  const date = new Date(item.timestamp).toLocaleDateString('en-IN');
  const badge = item.isNew ? '<span class="badge-new text-white text-xs px-2 py-1 rounded-full">NEW</span>' : '';
  
  return `
    <div class="result-card news-card rounded-lg shadow-md p-6 hover:shadow-xl" onclick="window.location.href='result-detail.html?id=${item.id}'">
      <div class="flex justify-between items-start mb-3">
        <span class="text-xs text-gray-500"><i class="far fa-calendar mr-1"></i> ${date}</span>
        ${badge}
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${item.title}</h3>
      <p class="text-gray-600 mb-4">${item.examName || ''}</p>
      <div class="flex gap-2">
        <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold flex-1">
          <i class="fas fa-download mr-1"></i> Check Result
        </button>
      </div>
    </div>
  `;
}

function loadLatestAnswerKeys() {
  const db = window.firebaseDatabase;
  const keysRef = query(ref(db, 'answerKeys'), orderByChild('timestamp'), limitToLast(2000000));
  
  onValue(keysRef, (snapshot) => {
    const keysContainer = document.getElementById('latest-answer-keys');
    keysContainer.innerHTML = '';
    
    if (!snapshot.exists()) {
      keysContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12"><i class="fas fa-inbox text-4xl mb-4"></i><p>No answer keys available yet. Check back soon!</p></div>';
      return;
    }
    
    const keysArray = [];
    snapshot.forEach((childSnapshot) => {
      keysArray.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to show latest first
    keysArray.reverse();
    
    keysArray.forEach((item) => {
      const card = createAnswerKeyCard(item);
      keysContainer.insertAdjacentHTML('beforeend', card);
    });
  });
}

function createAnswerKeyCard(item) {
  const date = new Date(item.timestamp).toLocaleDateString('en-IN');
  const badge = item.isNew ? '<span class="badge-new text-white text-xs px-2 py-1 rounded-full">NEW</span>' : '';
  
  return `
    <div class="answer-key-card news-card rounded-lg shadow-md p-6 hover:shadow-xl" onclick="window.location.href='answerkey-detail.html?id=${item.id}'">
      <div class="flex justify-between items-start mb-3">
        <span class="text-xs text-gray-500"><i class="far fa-calendar mr-1"></i> ${date}</span>
        ${badge}
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${item.title}</h3>
      <p class="text-gray-600 mb-4">${item.examName || ''}</p>
      <div class="flex gap-2">
        <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex-1">
          <i class="fas fa-download mr-1"></i> Download Key
        </button>
      </div>
    </div>
  `;
}

function loadLatestAdmitCards() {
  const db = window.firebaseDatabase;
  const keysRef = query(ref(db, 'admitCards'), orderByChild('timestamp'), limitToLast(2000000));
  
  onValue(keysRef, (snapshot) => {
    const keysContainer = document.getElementById('latest-admit-cards');
    keysContainer.innerHTML = '';
    
    if (!snapshot.exists()) {
      keysContainer.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12"><i class="fas fa-inbox text-4xl mb-4"></i><p>No admit cards available yet. Check back soon!</p></div>';
      return;
    }
    
    const keysArray = [];
    snapshot.forEach((childSnapshot) => {
      keysArray.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Reverse to show latest first
    keysArray.reverse();
    
    keysArray.forEach((item) => {
      const card = createAdmitCardCard(item);
      keysContainer.insertAdjacentHTML('beforeend', card);
    });
  });
}

function createAdmitCardCard(item) {
  const date = new Date(item.timestamp).toLocaleDateString('en-IN');
  const badge = item.isNew ? '<span class="badge-new text-white text-xs px-2 py-1 rounded-full">NEW</span>' : '';
  
  return `
    <div class="admit-card news-card rounded-lg shadow-md p-6 hover:shadow-xl" onclick="window.location.href='admitcard-detail.html?id=${item.id}'">
      <div class="flex justify-between items-start mb-3">
        <span class="text-xs text-gray-500"><i class="far fa-calendar mr-1"></i> ${date}</span>
        ${badge}
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">${item.title}</h3>
      <p class="text-gray-600 mb-4">${item.examName || ''}</p>
      <div class="flex gap-2">
        <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex-1">
          <i class="fas fa-download mr-1"></i> Download Key
        </button>
      </div>
    </div>
  `;
}
