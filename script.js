// PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE
const webAppUrl = "https://script.google.com/macros/s/AKfycbzJe4H4kR_9svilR97ml5CdsPs-Ds5qt3U1uQfxEVmHsz03zj8N5T8p-X9gWIp3NkQh/exec";

// 1. Listen for Form Submissions
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page from reloading

    const submitBtn = document.getElementById('submitBtn');
    
    // Show visual loading spinner feedback on the button
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registering...`;
    submitBtn.disabled = true;

    // Capture explicit field data values
    const userEmail = document.getElementById('email').value;
    const formData = {
        name: document.getElementById('name').value,
        email: userEmail,
        phone: document.getElementById('phone').value,
        college: document.getElementById('college').value,
        department: document.getElementById('department').value,
        year: document.getElementById('year').value
    };

    // Send payload background POST request to Google Sheet Web App API
    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // Trigger modal success alert display 
        showSuccessPopup(`🎉 Successfully Registered!\nA confirmation email has been sent to:\n${userEmail}`);
        
        // Reset the form fields safely
        document.getElementById('form').reset();
        
        // Refresh dashboard statistics and table listings dynamically
        fetchLiveData(); 
    })
    .catch(error => {
        console.error('System Submission Error:', error);
        showSuccessPopup("❌ Connection issue occurred.\nPlease verify backend configuration and try again.");
    })
    .finally(() => {
        // Restore button back to normal active state
        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Register`;
        submitBtn.disabled = false;
    });
});

// 2. Custom Success Modal Popup Controller
function showSuccessPopup(message) {
    const popup = document.getElementById("toast");
    const overlay = document.getElementById("modalOverlay");
    
    // Replace text line breaks to match clean layout styling format
    popup.innerHTML = message.replace(/\n/g, "<br>");
    
    // Apply layout display classes
    popup.classList.add("show");
    overlay.classList.add("active");
    
    // Automatically hide modal components cleanly after 4.5 seconds
    setTimeout(() => {
        popup.classList.remove("show");
        overlay.classList.remove("active");
    }, 4500);
}

// 3. Live Dashboard Updates and Data Rendering Engine
function fetchLiveData() {
    const tableBody = document.getElementById('table');
    const totalElement = document.getElementById('total');
    const todayElement = document.getElementById('today');
    
    if (!webAppUrl || webAppUrl === "YOUR_WEB_APP_URL_HERE") return;

    fetch(webAppUrl)
        .then(response => response.json())
        .then(data => {
            // Update Dashboard Counters
            if (totalElement) totalElement.textContent = data.length;
            if (todayElement) todayElement.textContent = data.length; // Active count trackers

            // Clear old HTML rows
            if (tableBody) {
                tableBody.innerHTML = "";
                
                // Populate Table dynamically with matching row arrays
                data.forEach(participant => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${escapeHtml(participant.name)}</td>
                        <td>${escapeHtml(participant.email)}</td>
                        <td>${escapeHtml(participant.college)}</td>
                        <td>${escapeHtml(participant.year)}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(err => console.warn("Dashboard sync pending active responses: ", err));
}

// Security Helper to sanitize data strings safely inside HTML
function escapeHtml(text) {
    if (!text) return "";
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Run metrics sync when the page loads initial resources
window.addEventListener('DOMContentLoaded', fetchLiveData);

// --- Accordion Q&A Control System ---

// ஆன்லைன் லிங்கிற்கு பதிலாக, உங்கள் ஃபிரண்ட் எண்ட் ஃபோல்டரில் உள்ள ஃபைல் பெயர்
const githubJsonUrl = "faqs.json"; 

// Handles panel visibility transitions
function toggleQAWidget() {
    const widget = document.getElementById('qaWidget');
    widget.classList.toggle('active');
    
    // Automatically trigger population if opening for the first time
    if(widget.classList.contains('active')) {
        fetchAccordionData();
    }
}

// Downloads raw JSON collection arrays down to the interactive container viewport
function fetchAccordionData() {
    const contentBox = document.getElementById('qaContent');
    
    // Safety check to prevent repetitive networking downloads if loaded already
    if (contentBox.querySelectorAll('.qa-item').length > 0) return;

    // லோக்கல் ஃபைலில் இருந்து டேட்டாவை எடுக்கும் (Fetch)
    fetch(githubJsonUrl)
        .then(res => {
            if (!res.ok) throw new Error("Data retrieval anomaly detected");
            return res.json();
        })
        .then(questionsArray => {
            contentBox.innerHTML = ""; // Flushes out loading message elements
            
            questionsArray.forEach(item => {
                // Generate container shell wrappers
                const itemDiv = document.createElement('div');
                itemDiv.className = 'qa-item';
                
                // Create interactive questions trigger layouts
                const btn = document.createElement('button');
                btn.className = 'qa-question';
                btn.innerHTML = `<span>${item.question}</span> <i class="fa-solid fa-chevron-down"></i>`;
                
                // Create answer description blocks
                const answerDiv = document.createElement('div');
                answerDiv.className = 'qa-answer';
                answerDiv.innerText = item.answer;
                
                // Intercept button context events to switch CSS visibility behaviors
                btn.addEventListener('click', () => {
                    const isOpen = itemDiv.classList.contains('open');
                    
                    // Collapse any alternative open menus to keep focus tidy
                    document.querySelectorAll('.qa-item').forEach(el => el.classList.remove('open'));
                    
                    if(!isOpen) {
                        itemDiv.classList.add('open');
                    }
                });
                
                itemDiv.appendChild(btn);
                itemDiv.appendChild(answerDiv);
                contentBox.appendChild(itemDiv);
            });
        })
        .catch(err => {
            console.error("Accordion fetch processing exception:", err);
            contentBox.innerHTML = `<div class="loading-span" style="color:#ef4444;">❌ Could not retrieve Q&A documents.</div>`;
        });
}
