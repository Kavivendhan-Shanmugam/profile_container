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
});

// Load profile data from API
async function loadProfileData() {
    try {
        const response = await fetch('/api/get_profile');
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
        name: "我是Kavi Vendhan",
        subtitle: "A BRAVE CLIMBER IN THE WORLD OF PRODUCT DESIGN",
        description_line1: "—一个在产品设计屋努力攀登的新生",
        description_line2: "拥有一颗童真无泪界的好奇心和一颗心无旁骛的探索力",
        description_line3: "这句话来自首席Smao",
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

// Initialize profile image click listener for admin access
function initializeClickListener() {
    const flipContainer = document.getElementById('flip-container');
    
    // Add click listener to the entire flip container
    flipContainer.addEventListener('click', function(e) {
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
            openAdminModal();
            clickCount = 0; // Reset counter
            e.preventDefault(); // Prevent the flip animation
        }
    });
}

// Open admin modal
function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    const form = document.getElementById('admin-form');
    
    // Populate form with current data
    Object.keys(profileData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = profileData[key] || '';
        }
    });
    
    modal.style.display = 'block';
}

// Initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('admin-modal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('admin-form');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveProfileData();
    });
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
        
        const response = await fetch('/api/update_profile', {
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
                document.getElementById('admin-modal').style.display = 'none';
            }, 1500);
        } else {
            throw new Error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile. Please try again.', 'error');
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

// Smooth scrolling for navigation links
function smoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
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
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Add animation on scroll for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
