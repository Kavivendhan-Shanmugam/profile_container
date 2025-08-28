// Global variables
let clickCount = 0;
let clickTimer = null;
let profileData = {};

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    initializeClickListener();
    initializeModal();
    initializeContactForm();
    smoothScroll();
    loadProjects();
    initializeCardEffects();
    initializeMobileNavigation();
    initializeTouchOptimizations();
});

// Initialize card hover effects
function initializeCardEffects() {
    // Add hover effects to card elements
    const cardElements = document.querySelectorAll('.project-card, .skill-category, .stat, .social-link, .btn');
    cardElements.forEach(element => {
        element.classList.add('card-hover-effect');
    });

    // Add subtle parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        const rate = scrolled * -0.5;

        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }

        // Add floating effect to decorations
        const decorations = document.querySelectorAll('.decoration');
        decorations.forEach((decoration, index) => {
            const speed = 0.3 + (index * 0.1);
            decoration.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Load profile data from API
async function loadProfileData() {
    try {
        const response = await fetch('/.netlify/functions/get_profile');
        if (response.ok) {
            profileData = await response.json();
            updateUIWithData(profileData);
        } else {
            console.log('Using default data - no profile found in database');
            setDefaultData();
        }
    } catch (error) {
        console.log('Using default data - API not available:', error.message);
        setDefaultData();
    }
}

// Set default data when API is not available
function setDefaultData() {
    profileData = {
        name: "I'm Kavi Vendhan",
        subtitle: "A PASSIONATE DEVELOPER & DESIGNER",
        description_line1: "— A passionate developer climbing in the world of technology",
        description_line2: "With boundless curiosity and relentless exploration",
        description_line3: "Building digital experiences that matter",
        about: "I'm a passionate developer with over 3 years of experience in creating digital solutions that make a difference. My journey started with curiosity about how websites work, and it has evolved into a career focused on building exceptional user experiences.",
        projects_count: "25+",
        experience_years: "3+",
        clients_count: "15+",
        email: "kavi@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        contact_description: "I'm always interested in new opportunities and exciting projects. Feel free to reach out if you'd like to collaborate!"
    };
    updateUIWithData(profileData);
}

// Update UI elements with data
function updateUIWithData(data) {
    Object.keys(data).forEach(key => {
        const elements = document.querySelectorAll(`[data-field="${key}"]`);
        elements.forEach(element => {
            element.textContent = data[key];
        });
    });
}

// Initialize navigation logo click listener for admin access
function initializeClickListener() {
    const navLogo = document.querySelector('.nav-logo-img');

    // Add click listener to the navigation logo
    navLogo.addEventListener('click', function(e) {
        clickCount++;

        // Clear existing timer
        if (clickTimer) {
            clearTimeout(clickTimer);
        }

        // Reset counter after 3 seconds of no clicks
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 3000);

        // Check if we've reached 11 clicks
        if (clickCount === 11) {
            openAdminLogin();
            clickCount = 0; // Reset counter
            e.preventDefault();
        }
    });
}

// Open admin login
function openAdminLogin() {
    const modal = document.getElementById('admin-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Show login form first
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Admin Login</h2>
        <form id="admin-login-form">
            <div class="form-group">
                <label for="admin-username">Username:</label>
                <input type="text" id="admin-username" name="username" required>
            </div>
            <div class="form-group">
                <label for="admin-password">Password:</label>
                <input type="password" id="admin-password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <div id="login-error" class="error-message" style="display: none;">
            Invalid credentials. Please try again.
        </div>
    `;

    modal.style.display = 'block';

    // Add login form handler
    const loginForm = document.getElementById('admin-login-form');
    loginForm.addEventListener('submit', handleAdminLogin);

    // Re-add close functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Simple authentication (in production, this should be server-side)
    if (username === 'kavivendhan' && password === '06102004') {
        showAdminDashboard();
    } else {
        const errorDiv = document.getElementById('login-error');
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Show admin dashboard after successful login
function showAdminDashboard() {
    const modal = document.getElementById('admin-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Show the main admin dashboard
    modalContent.innerHTML = `
        <span class="close" title="Close Admin Panel">&times;</span>
        <h2>Admin Dashboard</h2>
        <div class="modal-info">
            <p><i class="fas fa-info-circle"></i> Modal stays open while editing. Use the X button or Logout to close.</p>
        </div>
        <div class="admin-nav">
            <button id="edit-profile-btn" class="btn btn-primary">Edit Profile</button>
            <button id="manage-content-btn" class="btn btn-primary">Manage Content</button>
            <button id="view-analytics-btn" class="btn btn-primary">View Analytics</button>
            <button id="logout-btn" class="btn btn-secondary">Logout</button>
        </div>
        <div id="admin-content">
            <h3>Welcome to Admin Dashboard</h3>
            <p>Select an option above to manage your portfolio.</p>
        </div>
    `;

    // Add dashboard functionality
    document.getElementById('edit-profile-btn').addEventListener('click', showProfileEditor);
    document.getElementById('logout-btn').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Re-add close functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Show profile editor
function showProfileEditor() {
    const adminContent = document.getElementById('admin-content');

    adminContent.innerHTML = `
        <h3>Edit Profile</h3>

        <!-- Image Management Section -->
        <div class="image-management-section">
            <h4>Profile Images</h4>
            <div class="image-uploads">
                <div class="image-upload-group">
                    <label for="real-photo-upload">Real Photo (shown on hover):</label>
                    <div class="current-image-preview">
                        <img id="real-photo-preview" src="https://cdn.builder.io/api/v1/image/assets%2F35bcde9c1868452f8649cd74edf8e7ae%2F71547f016e4544dfa06fa4648dd748a1?format=webp&width=800" alt="Current Real Photo" class="image-preview">
                    </div>
                    <input type="file" id="real-photo-upload" accept="image/*" class="file-input">
                    <button type="button" id="upload-real-photo" class="btn btn-secondary">Upload New Real Photo</button>
                    <button type="button" id="reset-real-photo" class="btn btn-outline">Reset to Default</button>
                </div>

                <div class="image-upload-group">
                    <label for="illustrated-photo-upload">Illustrated Character (default view):</label>
                    <div class="current-image-preview">
                        <img id="illustrated-photo-preview" src="https://cdn.builder.io/api/v1/image/assets%2F35bcde9c1868452f8649cd74edf8e7ae%2F324370f46a8044788fe72961f055c274?format=webp&width=800" alt="Current Illustrated Photo" class="image-preview">
                    </div>
                    <input type="file" id="illustrated-photo-upload" accept="image/*" class="file-input">
                    <button type="button" id="upload-illustrated-photo" class="btn btn-secondary">Upload New Illustrated Photo</button>
                    <button type="button" id="reset-illustrated-photo" class="btn btn-outline">Reset to Default</button>
                </div>
            </div>
        </div>

        <!-- Profile Data Form -->
        <form id="admin-form">
            <div class="form-group">
                <label for="subtitle">Subtitle:</label>
                <input type="text" id="subtitle" name="subtitle">
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description"></textarea>
            </div>
            <div class="form-group">
                <label for="about">About:</label>
                <textarea id="about" name="about"></textarea>
            </div>
            <div class="form-group">
                <label for="projects_count">Projects Count:</label>
                <input type="text" id="projects_count" name="projects_count">
            </div>
            <div class="form-group">
                <label for="experience_years">Experience Years:</label>
                <input type="text" id="experience_years" name="experience_years">
            </div>
            <div class="form-group">
                <label for="clients_count">Clients Count:</label>
                <input type="text" id="clients_count" name="clients_count">
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email">
            </div>
            <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="text" id="phone" name="phone">
            </div>
            <div class="form-group">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location">
            </div>
            <div class="form-group">
                <label for="contact_description">Contact Description:</label>
                <textarea id="contact_description" name="contact_description"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `;

    // Initialize image upload functionality
    initializeImageUploads();

    // Populate form with current data
    Object.keys(profileData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = profileData[key] || '';
        }
    });

    // Add form submission handler
    const form = document.getElementById('admin-form');
    form.addEventListener('submit', saveProfileData);
}

// Initialize image upload functionality
function initializeImageUploads() {
    // Real photo upload
    const realPhotoUpload = document.getElementById('real-photo-upload');
    const uploadRealPhotoBtn = document.getElementById('upload-real-photo');
    const resetRealPhotoBtn = document.getElementById('reset-real-photo');
    const realPhotoPreview = document.getElementById('real-photo-preview');

    // Illustrated photo upload
    const illustratedPhotoUpload = document.getElementById('illustrated-photo-upload');
    const uploadIllustratedPhotoBtn = document.getElementById('upload-illustrated-photo');
    const resetIllustratedPhotoBtn = document.getElementById('reset-illustrated-photo');
    const illustratedPhotoPreview = document.getElementById('illustrated-photo-preview');

    // Real photo upload button click
    uploadRealPhotoBtn.addEventListener('click', () => {
        realPhotoUpload.click();
    });

    // Illustrated photo upload button click
    uploadIllustratedPhotoBtn.addEventListener('click', () => {
        illustratedPhotoUpload.click();
    });

    // Real photo file change
    realPhotoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, realPhotoPreview, 'real');
        }
    });

    // Illustrated photo file change
    illustratedPhotoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, illustratedPhotoPreview, 'illustrated');
        }
    });

    // Reset buttons
    resetRealPhotoBtn.addEventListener('click', () => {
        const defaultRealPhotoUrl = 'https://cdn.builder.io/api/v1/image/assets%2F35bcde9c1868452f8649cd74edf8e7ae%2F71547f016e4544dfa06fa4648dd748a1?format=webp&width=800';
        realPhotoPreview.src = defaultRealPhotoUrl;
        updateProfileImage(defaultRealPhotoUrl, 'real');
        showMessage('Real photo reset to default', 'success');
    });

    resetIllustratedPhotoBtn.addEventListener('click', () => {
        const defaultIllustratedPhotoUrl = 'https://cdn.builder.io/api/v1/image/assets%2F35bcde9c1868452f8649cd74edf8e7ae%2F324370f46a8044788fe72961f055c274?format=webp&width=800';
        illustratedPhotoPreview.src = defaultIllustratedPhotoUrl;
        updateProfileImage(defaultIllustratedPhotoUrl, 'illustrated');
        showMessage('Illustrated photo reset to default', 'success');
    });
}

// Handle image upload
function handleImageUpload(file, previewElement, imageType) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('Image size must be less than 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        previewElement.src = imageUrl;
        updateProfileImage(imageUrl, imageType);
        showMessage(`${imageType === 'real' ? 'Real photo' : 'Illustrated photo'} updated successfully!`, 'success');
    };
    reader.readAsDataURL(file);
}

// Update profile image in the main website
function updateProfileImage(imageUrl, imageType) {
    if (imageType === 'real') {
        // Update the flip-front image (real photo shown on hover)
        const flipFrontImg = document.querySelector('.flip-front .profile-img');
        if (flipFrontImg) {
            flipFrontImg.src = imageUrl;
        }
    } else if (imageType === 'illustrated') {
        // Update the flip-back image (illustrated character - default view)
        const flipBackImg = document.querySelector('.flip-back .profile-img');
        if (flipBackImg) {
            flipBackImg.src = imageUrl;
        }
    }
}

// Initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('admin-modal');

    // Remove the auto-close functionality to prevent accidental closing
    // Modal can only be closed via the X button or logout button
}

// Save profile data
async function saveProfileData() {
    const form = document.getElementById('admin-form');
    const formData = new FormData(form);
    const newData = {};
    
    // Convert form data to object
    for (let [key, value] of formData.entries()) {
        newData[key] = value;
    }
    
    try {
        // Add loading state
        form.classList.add('loading');

        const response = await fetch('/.netlify/functions/update_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData)
        });

        if (response.ok) {
            profileData = { ...profileData, ...newData };
            updateUIWithData(profileData);
            showMessage('Profile updated successfully!', 'success');
            setTimeout(() => {
                const modal = document.getElementById('admin-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }, 1500);
        } else {
            // Try to get error message from response
            let errorMessage = 'Failed to update profile';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // Ignore JSON parsing errors
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error updating profile:', error);

        // Update local data even if API fails
        profileData = { ...profileData, ...newData };
        updateUIWithData(profileData);

        // Show appropriate error message
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showMessage('Changes saved locally. API connection unavailable.', 'success');
        } else {
            showMessage(`Error: ${error.message}`, 'error');
        }
    } finally {
        form.classList.remove('loading');
    }
}

// Show success/error message
function showMessage(text, type) {
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = `${type}-message`;
    message.textContent = text;
    
    const form = document.getElementById('admin-form');
    form.insertBefore(message, form.firstChild);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Here you would typically send the message to a backend service
        // For now, we'll just show a success message
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
    });
}

// Enhanced smooth scrolling with card transition effects
function smoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Add card transition effect
                triggerCardTransition(targetSection);

                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Card transition effect when navigating between sections
function triggerCardTransition(targetSection) {
    // Create or get the transition overlay
    let overlay = document.querySelector('.page-transition');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);
    }

    // Show transition overlay
    overlay.classList.add('active');

    const allSections = document.querySelectorAll('section');

    // First, animate out the current visible sections
    allSections.forEach(section => {
        if (section !== targetSection) {
            section.style.transform = 'translateX(-50px) scale(0.98)';
            section.style.opacity = '0.4';
            section.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    });

    // After a brief delay, animate in the target section with card effect
    setTimeout(() => {
        // Hide transition overlay
        overlay.classList.remove('active');

        // Reset all sections first
        allSections.forEach(section => {
            section.style.transform = 'translateX(50px) scale(0.98)';
            section.style.opacity = '0';
        });

        // Animate in the target section
        setTimeout(() => {
            targetSection.style.transform = 'translateX(0) scale(1)';
            targetSection.style.opacity = '1';
            targetSection.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            // Animate child elements with stagger effect
            animateCardElements(targetSection);
        }, 50);

        // Reset other sections after target is visible
        setTimeout(() => {
            allSections.forEach(section => {
                if (section !== targetSection) {
                    section.style.transform = 'translateX(0) scale(1)';
                    section.style.opacity = '1';
                    section.style.transition = 'all 0.4s ease';
                }
            });
        }, 600);
    }, 200);
}

// Animate elements within a section with staggered card effects
function animateCardElements(section) {
    const cards = section.querySelectorAll('.project-card, .skill-category, .stat, .contact-info, .contact-form');
    const textElements = section.querySelectorAll('h1, h2, h3, p, .hero-description p');

    // Animate cards with stagger
    cards.forEach((card, index) => {
        card.style.transform = 'translateY(50px) scale(0.8)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }, index * 100 + 200);
    });

    // Animate text elements
    textElements.forEach((element, index) => {
        element.style.transform = 'translateY(30px)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, index * 50 + 100);
    });
}

// Load and display projects
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    // Sample projects data - in a real app, this would come from an API
    const projects = [
        {
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution built with React and Node.js. Features include user authentication, payment processing, and admin dashboard.",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            github: "https://github.com/kavivendhan/ecommerce",
            demo: "https://demo.kavivendhan.com/ecommerce"
        },
        {
            title: "Task Management App",
            description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
            technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
            github: "https://github.com/kavivendhan/taskapp",
            demo: "https://demo.kavivendhan.com/taskapp"
        },
        {
            title: "Weather Dashboard",
            description: "A responsive weather dashboard that provides detailed weather information and forecasts using multiple weather APIs.",
            technologies: ["JavaScript", "CSS3", "Weather API", "Chart.js"],
            github: "https://github.com/kavivendhan/weather",
            demo: "https://demo.kavivendhan.com/weather"
        },
        {
            title: "Portfolio Website",
            description: "A modern, responsive portfolio website with admin panel for easy content management and dynamic updates.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Netlify"],
            github: "https://github.com/kavivendhan/portfolio",
            demo: "https://kavivendhan.netlify.app"
        }
    ];
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                ${project.title}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> Code
                    </a>
                    <a href="${project.demo}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Mobile navigation toggle (if you want to add mobile nav later)
function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 31, 77, 0.95)';
    } else {
        header.style.background = 'rgba(26, 31, 77, 0.8)';
    }
});

// Enhanced scroll-based card animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate the section with card effect
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';

            // Trigger staggered animations for child elements
            animateCardElements(entry.target);
        } else {
            // Subtle out animation when leaving viewport
            entry.target.style.opacity = '0.8';
            entry.target.style.transform = 'translateY(10px) scale(0.98)';
        }
    });
}, observerOptions);

// Card element observer for individual cards
const cardElementObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.classList.add('card-visible');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
});

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px) scale(0.95)';
        section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        cardObserver.observe(section);
    });

    // Observe individual card elements
    const cardElements = document.querySelectorAll('.project-card, .skill-category, .stat');
    cardElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px) scale(0.9)';
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        cardElementObserver.observe(element);
    });
});

// Initialize mobile navigation
function initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (!navToggle || !navLinks) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');

            // Reset hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');

            // Reset hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Initialize touch optimizations
function initializeTouchOptimizations() {
    // Improve touch interactions for mobile devices
    const touchElements = document.querySelectorAll('.btn, .card-hover-effect, .social-link');

    touchElements.forEach(element => {
        // Add touch feedback
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Optimize modal for mobile
    const modal = document.getElementById('admin-modal');
    if (modal) {
        // Prevent background scrolling when modal is open
        const originalOpenModal = modal.style.display;
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    if (modal.style.display === 'block') {
                        document.body.style.overflow = 'hidden';
                        // Add padding to prevent layout shift
                        document.body.style.paddingRight = getScrollbarWidth() + 'px';
                    } else {
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }
                }
            });
        });

        observer.observe(modal, { attributes: true });
    }

    // Improve flip container for touch devices
    const flipContainer = document.getElementById('flip-container');
    if (flipContainer) {
        let touchStartTime = 0;

        flipContainer.addEventListener('touchstart', function() {
            touchStartTime = Date.now();
        });

        flipContainer.addEventListener('touchend', function() {
            const touchDuration = Date.now() - touchStartTime;

            // If it's a quick tap (not a scroll), trigger the flip
            if (touchDuration < 200) {
                this.classList.toggle('flipped');
            }
        });
    }

    // Add swipe gestures for project cards on mobile
    initializeSwipeGestures();
}

// Initialize swipe gestures for better mobile interaction
function initializeSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let currentElement = null;

    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentElement = e.target.closest('.project-card');
    });

    document.addEventListener('touchmove', function(e) {
        if (!currentElement) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        // If it's more horizontal than vertical swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            e.preventDefault();

            // Add visual feedback
            currentElement.style.transform = `translateX(${-diffX * 0.3}px) scale(0.95)`;
            currentElement.style.opacity = '0.8';
        }
    });

    document.addEventListener('touchend', function(e) {
        if (!currentElement) return;

        // Reset visual state
        currentElement.style.transform = '';
        currentElement.style.opacity = '';
        currentElement = null;
    });
}

// Get scrollbar width for modal padding compensation
function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

// Optimize animations for mobile performance
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Reduce animations on mobile for better performance
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            .hero::before,
            .decoration {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    // Close mobile menu on orientation change
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');

    if (navLinks && navToggle) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }

    // Recalculate layout after orientation change
    setTimeout(() => {
        window.scrollTo(0, window.scrollY);
    }, 100);
});

// Initialize mobile optimizations
window.addEventListener('load', optimizeForMobile);
