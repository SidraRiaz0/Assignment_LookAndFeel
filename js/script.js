// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Initialize CRUD functionality if on empower page
    if (document.querySelector('.crud-section')) {
        initializeCRUD();
    }

    // Initialize charts if on analytics page
    if (document.getElementById('genderChart')) {
        initializeCharts();
    }

    // Initialize sample data
    initializeSampleData();
});

// CRUD Functionality
let womenInGaming = [];

function initializeCRUD() {
    // Tab switching
    const crudTabs = document.querySelectorAll('.crud-tab');
    const crudContents = document.querySelectorAll('.crud-content');

    crudTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            crudTabs.forEach(t => t.classList.remove('active'));
            crudContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-content').classList.add('active');
            
            // Update content based on tab
            if (targetTab === 'view') {
                displayEntries();
            } else if (targetTab === 'edit') {
                populateEditSelect();
            } else if (targetTab === 'delete') {
                populateDeleteSelect();
            }
        });
    });

    // Form submissions
    const addForm = document.getElementById('add-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddSubmit);
    }

    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }

    // Delete select change
    const deleteSelect = document.getElementById('delete-select');
    if (deleteSelect) {
        deleteSelect.addEventListener('change', showDeletePreview);
    }

    // Update stats
    updateCommunityStats();
}

function initializeSampleData() {
    // Add some sample data if localStorage is empty
    if (localStorage.getItem('womenInGaming') === null) {
        const sampleData = [
            {
                id: 1,
                name: "Amy Hennig",
                role: "Creative Director",
                company: "Naughty Dog",
                notableWork: "Uncharted Series",
                achievements: "Led the creative direction of the acclaimed Uncharted series, pioneering cinematic storytelling in video games.",
                yearStarted: 1989
            },
            {
                id: 2,
                name: "Kim Swift",
                role: "Game Designer",
                company: "Valve Corporation",
                notableWork: "Portal",
                achievements: "Co-created Portal, one of the most innovative puzzle games ever made, revolutionizing game design.",
                yearStarted: 2005
            },
            {
                id: 3,
                name: "Jade Raymond",
                role: "Producer",
                company: "Ubisoft",
                notableWork: "Assassin's Creed",
                achievements: "Produced the original Assassin's Creed, establishing one of gaming's most successful franchises.",
                yearStarted: 1998
            },
            {
                id: 4,
                name: "Robin Hunicke",
                role: "Game Designer",
                company: "thatgamecompany",
                notableWork: "Journey",
                achievements: "Co-designed Journey, creating an emotionally powerful multiplayer experience without traditional communication.",
                yearStarted: 2005
            },
            {
                id: 5,
                name: "Brenda Romero",
                role: "Game Designer",
                company: "Romero Games",
                notableWork: "Wizardry Series",
                achievements: "Pioneered RPG design and is a leading advocate for diversity in gaming.",
                yearStarted: 1981
            }
        ];
        localStorage.setItem('womenInGaming', JSON.stringify(sampleData));
    }
    
    // Load data from localStorage
    womenInGaming = JSON.parse(localStorage.getItem('womenInGaming')) || [];
}

function saveData() {
    localStorage.setItem('womenInGaming', JSON.stringify(womenInGaming));
    updateCommunityStats();
}

function handleAddSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newEntry = {
        id: Date.now(),
        name: formData.get('name'),
        role: formData.get('role'),
        company: formData.get('company'),
        notableWork: formData.get('notableWork'),
        achievements: formData.get('achievements'),
        yearStarted: parseInt(formData.get('yearStarted'))
    };
    
    womenInGaming.push(newEntry);
    saveData();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showNotification('Entry added successfully!', 'success');
}

function displayEntries() {
    const entriesGrid = document.getElementById('entries-grid');
    if (!entriesGrid) return;
    
    if (womenInGaming.length === 0) {
        entriesGrid.innerHTML = '<p class="text-center">No entries found. Add some notable women in gaming!</p>';
        return;
    }
    
    entriesGrid.innerHTML = womenInGaming.map(entry => `
        <div class="entry-card">
            <div class="entry-name">${entry.name}</div>
            <div class="entry-role">${entry.role} at ${entry.company}</div>
            <div class="entry-details">
                <strong>Notable Work:</strong> ${entry.notableWork}<br>
                <strong>Started:</strong> ${entry.yearStarted}<br>
                <strong>Achievements:</strong> ${entry.achievements}
            </div>
        </div>
    `).join('');
}

function searchEntries() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredEntries = womenInGaming.filter(entry => 
        entry.name.toLowerCase().includes(searchTerm) ||
        entry.company.toLowerCase().includes(searchTerm) ||
        entry.role.toLowerCase().includes(searchTerm) ||
        entry.notableWork.toLowerCase().includes(searchTerm)
    );
    
    const entriesGrid = document.getElementById('entries-grid');
    if (filteredEntries.length === 0) {
        entriesGrid.innerHTML = '<p class="text-center">No entries match your search.</p>';
        return;
    }
    
    entriesGrid.innerHTML = filteredEntries.map(entry => `
        <div class="entry-card">
            <div class="entry-name">${entry.name}</div>
            <div class="entry-role">${entry.role} at ${entry.company}</div>
            <div class="entry-details">
                <strong>Notable Work:</strong> ${entry.notableWork}<br>
                <strong>Started:</strong> ${entry.yearStarted}<br>
                <strong>Achievements:</strong> ${entry.achievements}
            </div>
        </div>
    `).join('');
}

function populateEditSelect() {
    const editSelect = document.getElementById('edit-select');
    if (!editSelect) return;
    
    editSelect.innerHTML = '<option value="">Choose an entry...</option>' +
        womenInGaming.map(entry => 
            `<option value="${entry.id}">${entry.name}</option>`
        ).join('');
}

function loadEditForm() {
    const editSelect = document.getElementById('edit-select');
    const editForm = document.getElementById('edit-form');
    const selectedId = parseInt(editSelect.value);
    
    if (!selectedId) {
        editForm.style.display = 'none';
        return;
    }
    
    const entry = womenInGaming.find(e => e.id === selectedId);
    if (!entry) return;
    
    document.getElementById('edit-name').value = entry.name;
    document.getElementById('edit-role').value = entry.role;
    document.getElementById('edit-company').value = entry.company;
    document.getElementById('edit-notable-work').value = entry.notableWork;
    document.getElementById('edit-achievements').value = entry.achievements;
    document.getElementById('edit-year-started').value = entry.yearStarted;
    
    editForm.style.display = 'block';
    editForm.setAttribute('data-edit-id', selectedId);
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const editId = parseInt(e.target.getAttribute('data-edit-id'));
    const formData = new FormData(e.target);
    
    const entryIndex = womenInGaming.findIndex(e => e.id === editId);
    if (entryIndex === -1) return;
    
    womenInGaming[entryIndex] = {
        ...womenInGaming[entryIndex],
        name: formData.get('name'),
        role: formData.get('role'),
        company: formData.get('company'),
        notableWork: formData.get('notableWork'),
        achievements: formData.get('achievements'),
        yearStarted: parseInt(formData.get('yearStarted'))
    };
    
    saveData();
    
    // Reset form
    e.target.style.display = 'none';
    document.getElementById('edit-select').value = '';
    
    showNotification('Entry updated successfully!', 'success');
}

function populateDeleteSelect() {
    const deleteSelect = document.getElementById('delete-select');
    if (!deleteSelect) return;
    
    deleteSelect.innerHTML = '<option value="">Choose an entry...</option>' +
        womenInGaming.map(entry => 
            `<option value="${entry.id}">${entry.name}</option>`
        ).join('');
}

function showDeletePreview() {
    const deleteSelect = document.getElementById('delete-select');
    const deletePreview = document.getElementById('delete-preview');
    const selectedId = parseInt(deleteSelect.value);
    
    if (!selectedId) {
        deletePreview.style.display = 'none';
        return;
    }
    
    const entry = womenInGaming.find(e => e.id === selectedId);
    if (!entry) return;
    
    document.getElementById('preview-name').textContent = entry.name;
    document.getElementById('preview-details').textContent = 
        `${entry.role} at ${entry.company} - Known for ${entry.notableWork}`;
    
    deletePreview.style.display = 'block';
    deletePreview.setAttribute('data-delete-id', selectedId);
}

function confirmDelete() {
    const deletePreview = document.getElementById('delete-preview');
    const deleteId = parseInt(deletePreview.getAttribute('data-delete-id'));
    
    womenInGaming = womenInGaming.filter(e => e.id !== deleteId);
    saveData();
    
    // Reset delete interface
    document.getElementById('delete-select').value = '';
    deletePreview.style.display = 'none';
    
    showNotification('Entry deleted successfully!', 'success');
}

function cancelDelete() {
    const deletePreview = document.getElementById('delete-preview');
    document.getElementById('delete-select').value = '';
    deletePreview.style.display = 'none';
}

function updateCommunityStats() {
    const totalEntries = document.getElementById('total-entries');
    const developersCount = document.getElementById('developers-count');
    const executivesCount = document.getElementById('executives-count');
    const recentAdditions = document.getElementById('recent-additions');
    
    if (totalEntries) {
        totalEntries.textContent = womenInGaming.length;
    }
    
    if (developersCount) {
        const developers = womenInGaming.filter(entry => 
            entry.role.toLowerCase().includes('developer') || 
            entry.role.toLowerCase().includes('designer')
        ).length;
        developersCount.textContent = developers;
    }
    
    if (executivesCount) {
        const executives = womenInGaming.filter(entry => 
            entry.role.toLowerCase().includes('director') || 
            entry.role.toLowerCase().includes('ceo') ||
            entry.role.toLowerCase().includes('producer')
        ).length;
        executivesCount.textContent = executives;
    }
    
    if (recentAdditions) {
        const currentYear = new Date().getFullYear();
        const recent = womenInGaming.filter(entry => 
            entry.yearStarted >= currentYear - 5
        ).length;
        recentAdditions.textContent = recent;
    }
}

// Chart.js Initialization
function initializeCharts() {
    // Set Chart.js defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#6c757d';

    // Gaming Population by Gender
    const genderCtx = document.getElementById('genderChart');
    if (genderCtx) {
        new Chart(genderCtx, {
            type: 'doughnut',
            data: {
                labels: ['Women', 'Men', 'Other/Non-binary'],
                datasets: [{
                    data: [46, 53, 1],
                    backgroundColor: ['#0066FF', '#3399FF', '#6633FF'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                weight: 600
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

     // Gaming Industry Workforce
    const workforceCtx = document.getElementById('workforceChart');
    if (workforceCtx) {
        new Chart(workforceCtx, {
            type: 'bar',
            data: {
                labels: ['Women', 'Men', 'Non-binary'],
                datasets: [{
                    label: 'Percentage of Workforce',
                    data: [23, 72, 5],
                    backgroundColor: ['#0066FF', '#3399FF', '#6633FF'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% of workforce';
                            }
                        }
                    }
                }
            }
        });
    }

    // Regional Representation
    const regionalCtx = document.getElementById('regionalChart');
    if (regionalCtx) {
        new Chart(regionalCtx, {
            type: 'bar',
            data: {
                labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
                datasets: [{
                    label: 'Female Developers (%)',
                    data: [28, 26, 22, 24, 20, 30],
                    backgroundColor: '#0066FF',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 35,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Harassment Types
    const harassmentCtx = document.getElementById('harassmentChart');
    if (harassmentCtx) {
        new Chart(harassmentCtx, {
            type: 'bar',
            data: {
                labels: ['Verbal Abuse', 'Sexual Harassment', 'Inappropriate Content', 'Threats', 'Doxxing'],
                datasets: [{
                    label: 'Percentage Experiencing',
                    data: [42, 30, 28, 14, 8],
                    backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#6f42c1', '#e83e8c'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 50,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Leadership Representation
    const leadershipCtx = document.getElementById('leadershipChart');
    if (leadershipCtx) {
        new Chart(leadershipCtx, {
            type: 'pie',
            data: {
                labels: ['Executive Positions', 'Senior Management', 'Middle Management', 'Team Leads'],
                datasets: [{
                    data: [16, 22, 28, 35],
                    backgroundColor: ['#0066FF', '#3399FF', '#6633FF', '#9966FF'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Trends Over Time
    const trendsCtx = document.getElementById('trendsChart');
    if (trendsCtx) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Women in Gaming Industry (%)',
                    data: [22, 23, 23, 24, 23],
                    borderColor: '#0066FF',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0066FF',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 30,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% of industry workforce';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066FF'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading states to buttons
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<span class="loading"></span> Processing...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1000);
            }
        });
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.game-card, .stat-item, .insight-card, .entry-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

