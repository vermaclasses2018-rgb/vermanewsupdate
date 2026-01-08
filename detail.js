// Detail Page Application
import { ref, get, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

document.addEventListener('DOMContentLoaded', function() {
  initializeDetailPage();
});

function initializeDetailPage() {
  // Get ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  // Determine type from page name
  const page = window.location.pathname.split('/').pop();
  let type = '';
  
  if (page.includes('news')) type = 'news';
  else if (page.includes('job')) type = 'job';
  else if (page.includes('result')) type = 'result';
  else if (page.includes('answerkey')) type = 'answer-key';
  else if (page.includes('admitcard')) type = 'admit-card';
  
  if (!id) {
    window.location.href = 'index.html';
    return;
  }
  
  renderDetailPage(type, id);
}

async function renderDetailPage(type, id) {
  const db = window.firebaseDatabase;
  let dbPath = '';
  
  // Map URL type to Firebase path
  switch(type) {
    case 'news':
      dbPath = 'news';
      break;
    case 'job':
      dbPath = 'jobs';
      break;
    case 'result':
      dbPath = 'results';
      break;
    case 'answer-key':
      dbPath = 'answerKeys';
      break;
    case 'admit-card':
      dbPath = 'admitcards';
      break;
    default:
      window.location.href = 'index.html';
      return;
  }
  
  try {
    const itemRef = ref(db, `${dbPath}/${id}`);
    const snapshot = await get(itemRef);
    
    if (!snapshot.exists()) {
      renderNotFound();
      return;
    }
    
    const data = snapshot.val();
    
    // Increment view count
    const currentViews = data.views || 0;
    await update(itemRef, { views: currentViews + 1 });
    
    // Render based on type
    switch(type) {
      case 'news':
        renderNewsDetail(data, id);
        break;
      case 'job':
        renderJobDetail(data, id);
        break;
      case 'result':
        renderResultDetail(data, id);
        break;
      case 'answer-key':
        renderAnswerKeyDetail(data, id);
        break;
      case 'admit-card':
        renderAdmitCardDetail(data, id);
        break;
    }
    
  } catch (error) {
    console.error('Error loading detail:', error);
    renderError();
  }
}

function renderNewsDetail(data, id) {
  const date = new Date(data.timestamp).toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const content = `
    <!-- Simple Header -->
    <header class="bg-blue-900 text-white py-4 shadow-lg">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">VERMA NEWS</h1>
          <a href="index.html" class="text-yellow-400 hover:text-yellow-300">
            <i class="fas fa-home mr-2"></i>Back to Home
          </a>
        </div>
      </div>
    </header>
    
    <main class="max-w-5xl mx-auto px-4 py-8">
      
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-600 mb-6">
        <a href="index.html" class="hover:text-blue-600">Home</a>
        <i class="fas fa-chevron-right mx-2 text-xs"></i>
        <a href="index.html#latest-news" class="hover:text-blue-600">News</a>
        <i class="fas fa-chevron-right mx-2 text-xs"></i>
        <span class="text-gray-800">${data.title}</span>
      </nav>
      
      <!-- Article Header -->
      <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="mb-6">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
          <div class="flex items-center text-sm text-gray-600 space-x-6">
            <span><i class="far fa-calendar mr-2"></i>${date}</span>
            <span><i class="fas fa-eye mr-2"></i>${data.views || 0} Views</span>
            ${data.isNew ? '<span class="badge-new text-white text-xs px-3 py-1 rounded-full">NEW</span>' : ''}
          </div>
        </div>
        
       <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2191457384978539"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-2191457384978539"
     data-ad-slot="1602970018"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
        <!-- Description -->
        ${data.description ? `<div class="text-lg text-gray-700 mb-6 leading-relaxed">${data.description}</div>` : ''}
        
        <!-- Content -->
        <div class="prose max-w-none text-gray-800 leading-relaxed">
          ${formatContent(data.content || '')}
        </div>
        
        <!-- Important Links -->
        ${data.links && data.links.length > 0 ? `
        <div class="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <i class="fas fa-link mr-2 text-blue-600"></i>Important Links
          </h3>
          <div class="space-y-3">
            ${data.links.map(link => `
              <div class="flex items-center justify-between bg-white p-4 rounded shadow">
                <span class="font-semibold text-gray-800">${link.text}</span>
                <a href="${link.url}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                  <i class="fas fa-external-link-alt mr-2"></i>Click Here
                </a>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- PDF Documents -->
        ${data.pdfUrl ? `
        <div class="mt-8 bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <i class="fas fa-file-pdf mr-2 text-red-600"></i>Download Documents
          </h3>
          <a href="${data.pdfUrl}" target="_blank" class="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold">
            <i class="fas fa-download mr-2"></i>Download PDF
          </a>
        </div>
        ` : ''}
        
        <!-- Share Buttons -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h4 class="text-lg font-bold text-gray-900 mb-4">Share This Article:</h4>
          <div class="flex space-x-3">
            <button onclick="shareOnFacebook()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              <i class="fab fa-facebook mr-2"></i>Facebook
            </button>
            <button onclick="shareOnTwitter()" class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded">
              <i class="fab fa-twitter mr-2"></i>Twitter
            </button>
            <button onclick="shareOnWhatsApp()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              <i class="fab fa-whatsapp mr-2"></i>WhatsApp
            </button>
          </div>
        </div>
      </article>
      
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2191457384978539"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-2191457384978539"
     data-ad-slot="5259660913"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
    <!-- Footer -->
    <footer class="footer mt-12 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>&copy; 2025 VERMA NEWS. All Rights Reserved.</p>
      </div>
    </footer>
  `;
  
  document.getElementById('detail-app').innerHTML = content;
}

function renderJobDetail(data, id) {
  const date = new Date(data.timestamp).toLocaleDateString('en-IN');
  const lastDate = data.lastDate ? new Date(data.lastDate).toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'Not Specified';
  
  const content = `
    <header class="bg-green-900 text-white py-4 shadow-lg">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">VERMA NEWS - Jobs</h1>
          <a href="index.html" class="text-yellow-400 hover:text-yellow-300">
            <i class="fas fa-home mr-2"></i>Back to Home
          </a>
        </div>
      </div>
    </header>
    
    <main class="max-w-5xl mx-auto px-4 py-8">
      
      <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="mb-6">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
          <div class="flex items-center text-sm text-gray-600 space-x-6 mb-4">
            <span><i class="far fa-calendar mr-2"></i>Posted: ${date}</span>
            ${data.isHot ? '<span class="badge-hot text-white text-xs px-3 py-1 rounded-full">HOT</span>' : ''}
          </div>
          <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p class="text-red-800 font-bold text-lg">
              <i class="far fa-clock mr-2"></i>Last Date to Apply: ${lastDate}
            </p>
          </div>
        </div>
        
        <!-- Quick Info -->
        <div class="grid md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-lg">
          <div>
            <p class="text-gray-700 mb-2"><i class="fas fa-building mr-2 text-green-600"></i><strong>Organization:</strong> ${data.organization || 'N/A'}</p>
            <p class="text-gray-700 mb-2"><i class="fas fa-users mr-2 text-green-600"></i><strong>Total Posts:</strong> ${data.vacancies || 'N/A'}</p>
            <p class="text-gray-700 mb-2"><i class="fas fa-map-marker-alt mr-2 text-green-600"></i><strong>Location:</strong> ${data.location || 'All India'}</p>
          </div>
          <div>
            <p class="text-gray-700 mb-2"><i class="fas fa-rupee-sign mr-2 text-green-600"></i><strong>Salary:</strong> ${data.salary || 'As per norms'}</p>
            <p class="text-gray-700 mb-2"><i class="fas fa-graduation-cap mr-2 text-green-600"></i><strong>Qualification:</strong> ${data.qualification || 'See Details'}</p>
            <p class="text-gray-700 mb-2"><i class="fas fa-calendar-check mr-2 text-green-600"></i><strong>Application Mode:</strong> ${data.applicationMode || 'Online'}</p>
          </div>
        </div>
        
       <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2191457384978539"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-2191457384978539"
     data-ad-slot="6663725003"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
        
        <!-- Eligibility Table -->
        ${data.eligibility ? `
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            <i class="fas fa-check-circle mr-2 text-green-600"></i>Eligibility Criteria
          </h3>
          <div class="overflow-x-auto">
            ${createEligibilityTable(data.eligibility)}
          </div>
        </div>
        ` : ''}
        
        <!-- Content -->
        <div class="prose max-w-none text-gray-800 leading-relaxed mb-8">
          ${formatContent(data.content || '')}
        </div>
        
        <!-- Important Links -->
        <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded mb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <i class="fas fa-link mr-2 text-green-600"></i>Important Links
          </h3>
          <div class="space-y-3">
            ${data.applyLink ? `
            <div class="flex items-center justify-between bg-white p-4 rounded shadow">
              <span class="font-semibold text-gray-800">Apply Online</span>
              <a href="${data.applyLink}" target="_blank" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
                <i class="fas fa-external-link-alt mr-2"></i>Apply Now
              </a>
            </div>
            ` : ''}
            ${data.notificationLink ? `
            <div class="flex items-center justify-between bg-white p-4 rounded shadow">
              <span class="font-semibold text-gray-800">Official Notification</span>
              <a href="${data.notificationLink}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                <i class="fas fa-download mr-2"></i>Download
              </a>
            </div>
            ` : ''}
            ${data.officialWebsite ? `
            <div class="flex items-center justify-between bg-white p-4 rounded shadow">
              <span class="font-semibold text-gray-800">Official Website</span>
              <a href="${data.officialWebsite}" target="_blank" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
                <i class="fas fa-globe mr-2"></i>Visit
              </a>
            </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Share Buttons -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h4 class="text-lg font-bold text-gray-900 mb-4">Share This Job:</h4>
          <div class="flex space-x-3">
            <button onclick="shareOnFacebook()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              <i class="fab fa-facebook mr-2"></i>Facebook
            </button>
            <button onclick="shareOnTwitter()" class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded">
              <i class="fab fa-twitter mr-2"></i>Twitter
            </button>
            <button onclick="shareOnWhatsApp()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              <i class="fab fa-whatsapp mr-2"></i>WhatsApp
            </button>
          </div>
        </div>
      </article>
      
    </main>
    
    <footer class="footer mt-12 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>&copy; 2025 VERMA NEWS. All Rights Reserved.</p>
      </div>
    </footer>
  `;
  
  document.getElementById('detail-app').innerHTML = content;
}

function renderResultDetail(data, id) {
  const date = new Date(data.timestamp).toLocaleDateString('en-IN');
  
  const content = `
    <header class="bg-yellow-900 text-white py-4 shadow-lg">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">VERMA NEWS - Results</h1>
          <a href="index.html" class="text-yellow-400 hover:text-yellow-300">
            <i class="fas fa-home mr-2"></i>Back to Home
          </a>
        </div>
      </div>
    </header>
    
    <main class="max-w-5xl mx-auto px-4 py-8">
      <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
        <p class="text-xl text-gray-700 mb-6">${data.examName || ''}</p>
        <div class="text-sm text-gray-600 mb-6">
          <span><i class="far fa-calendar mr-2"></i>Published: ${date}</span>
        </div>
        
       <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2191457384978539"
     crossorigin="anonymous"></script>
<!-- unit12 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2191457384978539"
     data-ad-slot="1411398323"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
        <div class="prose max-w-none text-gray-800 leading-relaxed mb-8">
          ${formatContent(data.content || '')}
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <i class="fas fa-trophy mr-2 text-yellow-600"></i>Check Result
          </h3>
          ${data.resultLink ? `
          <a href="${data.resultLink}" target="_blank" class="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-bold text-lg">
            <i class="fas fa-external-link-alt mr-2"></i>Check Result Now
          </a>
          ` : '<p class="text-gray-600">Result link will be updated soon.</p>'}
        </div>
      </article>
    </main>
    
    <footer class="footer mt-12 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>&copy; 2025 VERMA NEWS. All Rights Reserved.</p>
      </div>
    </footer>
  `;
  
  document.getElementById('detail-app').innerHTML = content;
}

function renderAnswerKeyDetail(data, id) {
  const date = new Date(data.timestamp).toLocaleDateString('en-IN');
  
  const content = `
    <header class="bg-red-900 text-white py-4 shadow-lg">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">VERMA NEWS - Answer Keys</h1>
          <a href="index.html" class="text-yellow-400 hover:text-yellow-300">
            <i class="fas fa-home mr-2"></i>Back to Home
          </a>
        </div>
      </div>
    </header>
    
    <main class="max-w-5xl mx-auto px-4 py-8">
      <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
        <p class="text-xl text-gray-700 mb-6">${data.examName || ''}</p>
        <div class="text-sm text-gray-600 mb-6">
          <span><i class="far fa-calendar mr-2"></i>Published: ${date}</span>
        </div>
        
        <div class="ad-container rounded-lg mb-8">
          <div class="text-center text-gray-500">
            <i class="fas fa-ad text-4xl mb-2"></i>
            <p>Advertisement Space</p>
          </div>
        </div>
        
        <div class="prose max-w-none text-gray-800 leading-relaxed mb-8">
          ${formatContent(data.content || '')}
        </div>
        
        <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <i class="fas fa-key mr-2 text-red-600"></i>Download Answer Key
          </h3>
          ${data.answerKeyLink ? `
          <a href="${data.answerKeyLink}" target="_blank" class="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg">
            <i class="fas fa-download mr-2"></i>Download Answer Key
          </a>
          ` : '<p class="text-gray-600">Answer key will be uploaded soon.</p>'}
        </div>
      </article>
    </main>
    
    <footer class="footer mt-12 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>&copy; 2025 VERMA NEWS. All Rights Reserved.</p>
      </div>
    </footer>
  `;
  
  document.getElementById('detail-app').innerHTML = content;
}
function renderAdmitCardDetail(data, id) {
  const date = new Date(data.timestamp).toLocaleDateString('en-IN');
  
  const content = `
    <header class="bg-purple-900 text-white py-4 shadow-lg">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">VERMA NEWS - Admit Cards</h1>
          <a href="index.html" class="text-yellow-400 hover:text-yellow-300">
            <i class="fas fa-home mr-2"></i>Back to Home
          </a>
        </div>
      </div>
    </header>
    
    <main class="max-w-5xl mx-auto px-4 py-8">
      <article class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${data.title}</h1>
        <p class="text-xl text-gray-700 mb-6">${data.examName || ''}</p>
        <div class="text-sm text-gray-600 mb-6">
          <span><i class="far fa-calendar mr-2"></i>Published: ${date}</span>
        </div>
        
        <div class="ad-container rounded-lg mb-8">
          <div class="text-center text-gray-500">
            <i class="fas fa-ad text-4xl mb-2"></i>
            <p>Advertisement Space</p>
          </div>
        </div>
        
        <div class="prose max-w-none text-gray-800 leading-relaxed mb-8">
          ${formatContent(data.content || '')}
        </div>
        
        <div class="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <i class="fas fa-id-card mr-2 text-purple-600"></i>Download Admit Card
          </h3>
          ${data.admitCardLink ? `
          <a href="${data.admitCardLink}" target="_blank" class="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg">
            <i class="fas fa-download mr-2"></i>Download Admit Card
          </a>
          ` : '<p class="text-gray-600">Admit card will be uploaded soon.</p>'}
        </div>
      </article>
    </main>
    
    <footer class="footer mt-12 py-6">
      <div class="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>&copy; 2025 VERMA NEWS. All Rights Reserved.</p>
      </div>
    </footer>
  `;
  
  document.getElementById('detail-app').innerHTML = content;
}

function createEligibilityTable(eligibility) {
  if (typeof eligibility === 'string') {
    return `<div class="bg-gray-50 p-4 rounded">${eligibility}</div>`;
  }
  
  if (Array.isArray(eligibility)) {
    return `
      <table class="eligibility-table">
        <thead>
          <tr>
            <th>Post Name</th>
            <th>Qualification</th>
            <th>Age Limit</th>
            <th>Vacancies</th>
          </tr>
        </thead>
        <tbody>
          ${eligibility.map(item => `
            <tr>
              <td>${item.post || 'N/A'}</td>
              <td>${item.qualification || 'N/A'}</td>
              <td>${item.age || 'N/A'}</td>
              <td>${item.vacancies || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  return '';
}

function formatContent(content) {
  // Convert line breaks to paragraphs
  return content
    .split('\n\n')
    .map(para => `<p class="mb-4">${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function renderNotFound() {
  document.getElementById('detail-app').innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Content Not Found</h1>
        <p class="text-gray-600 mb-6">The content you're looking for doesn't exist or has been removed.</p>
        <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
          <i class="fas fa-home mr-2"></i>Go to Homepage
        </a>
      </div>
    </div>
  `;
}

function renderError() {
  document.getElementById('detail-app').innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <i class="fas fa-times-circle text-6xl text-red-500 mb-4"></i>
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Error Loading Content</h1>
        <p class="text-gray-600 mb-6">There was an error loading the content. Please try again later.</p>
        <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
          <i class="fas fa-home mr-2"></i>Go to Homepage
        </a>
      </div>
    </div>
  `;
}

// Share functions
window.shareOnFacebook = function() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.shareOnTwitter = function() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(document.title);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
};

window.shareOnWhatsApp = function() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(document.title);
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
};
