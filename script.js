// ============================================
// 3D Hero Section with Floating Torus Knot
// ============================================

let heroScene, heroCamera, heroRenderer, heroTorusKnot;
let heroAnimationId;

function initHero3D() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene setup
    heroScene = new THREE.Scene();
    heroScene.fog = new THREE.FogExp2(0x0a0a0f, 0.001);

    // Camera setup with slight tilt
    heroCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    heroCamera.position.set(0, 2, 8);
    heroCamera.lookAt(0, 0, 0);

    // Renderer setup
    heroRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.shadowMap.enabled = true;
    heroRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x8b5cf6, 0.3);
    heroScene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 1, 100);
    purpleLight.position.set(5, 5, 5);
    purpleLight.castShadow = true;
    heroScene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 1, 100);
    blueLight.position.set(-5, -5, 5);
    blueLight.castShadow = true;
    heroScene.add(blueLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    heroScene.add(directionalLight);

    // Create torus knot with glassy material
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6,
        metalness: 0.8,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.5,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    heroTorusKnot = new THREE.Mesh(geometry, material);
    heroTorusKnot.castShadow = true;
    heroTorusKnot.receiveShadow = true;
    heroScene.add(heroTorusKnot);

    // Add glow effect
    const glowGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.set(1.1, 1.1, 1.1);
    heroScene.add(glow);

    // Animate
    animateHero();
}

let heroTime = 0;
function animateHero() {
    heroAnimationId = requestAnimationFrame(animateHero);
    heroTime += 0.01;

    if (heroTorusKnot) {
        // Smooth rotation
        heroTorusKnot.rotation.x += 0.005;
        heroTorusKnot.rotation.y += 0.01;
        
        // Floating motion
        heroTorusKnot.position.y = Math.sin(heroTime * 2) * 0.5;
        heroTorusKnot.position.x = Math.cos(heroTime * 1.5) * 0.3;
    }

    // Camera slight movement for depth
    if (heroCamera) {
        heroCamera.position.x = Math.sin(heroTime * 0.5) * 0.5;
        heroCamera.position.y = 2 + Math.cos(heroTime * 0.3) * 0.3;
    }

    heroRenderer.render(heroScene, heroCamera);
}

// Handle window resize
function onHeroResize() {
    if (!heroCamera || !heroRenderer) return;
    heroCamera.aspect = window.innerWidth / window.innerHeight;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onHeroResize);

// ============================================
// 3D Skills Sphere with Orbiting Icons
// ============================================

// Skills section now uses grid layout instead of 3D sphere
const skills = [
    'Python', 'MySQL', 'Java', 'HTML', 'CSS',
    'Excel', 'Power BI', 'Tableau', 
    'Data Cleaning', 'Data Modeling', 'Data Visualization',
    'N8N', 'SupaBase', 'Generative AI Developer', 'Web Scraping'
];

// Skill icons mapping with logo URLs
const skillIcons = {
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    'Excel': 'https://img.icons8.com/color/96/000000/microsoft-excel-2019.png',
    'Power BI': 'https://img.icons8.com/color/96/000000/power-bi.png',
    'Tableau': 'https://img.icons8.com/color/96/000000/tableau-software.png',
    'Data Cleaning': 'https://cdn.simpleicons.org/databricks/FF3621',
    'Data Modeling': 'https://cdn.simpleicons.org/databricks/FF3621',
    'Data Visualization': 'https://cdn.simpleicons.org/databricks/FF3621',
    'N8N': 'https://avatars.githubusercontent.com/u/45587716?s=200&v=4',
    'SupaBase': 'https://cdn.simpleicons.org/supabase/3ECF8E',
    'Generative AI Developer': 'https://cdn.simpleicons.org/openai/412991',
    'Web Scraping': 'https://cdn.simpleicons.org/scrapy/FF6C37'
};

function initSkills3D() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    // Clear any existing content
    skillsGrid.innerHTML = '';

    // Create skill cards
    skills.forEach((skill, index) => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.style.transitionDelay = `${index * 0.1}s`;
        skillCard.setAttribute('data-skill', skill);
        
        const icon = document.createElement('div');
        icon.className = 'skill-icon';
        
        // Check if it's a URL (logo) or text
        const iconSrc = skillIcons[skill];
        if (iconSrc && iconSrc.startsWith('http')) {
            const img = document.createElement('img');
            img.src = iconSrc;
            img.alt = skill;
            img.className = 'skill-logo';
            img.onerror = function() {
                // Fallback to text if image fails to load
                this.style.display = 'none';
                icon.textContent = skill.substring(0, 2).toUpperCase();
                icon.style.fontSize = '2rem';
            };
            icon.appendChild(img);
        } else {
            icon.textContent = iconSrc || skill.substring(0, 2).toUpperCase();
        }
        
        const name = document.createElement('div');
        name.className = 'skill-name';
        name.textContent = skill;
        
        skillCard.appendChild(icon);
        skillCard.appendChild(name);
        skillsGrid.appendChild(skillCard);
    });

    // Animate skills on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });
}

// ============================================
// Magnetic Contact Button
// ============================================

function initMagneticButton() {
    const button = document.querySelector('.magnetic-button');
    if (!button) return;

    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.2;
        const moveY = y * 0.2;

        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0) scale(1)';
    });

    button.addEventListener('click', (e) => {
        const ripple = button.querySelector('.button-ripple');
        if (ripple) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = ripple.style.height = '20px';
            ripple.style.animation = 'none';
            setTimeout(() => {
                ripple.style.animation = 'ripple 0.6s ease-out';
            }, 10);
        }
    });
}

// ============================================
// Smooth Scroll Animations
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                if (entry.target.classList.contains('education-item')) {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.about-section, .experience-section, .education-section, .skills-section, .projects-section, .certifications-section, .contact-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe experience items
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe education items
    document.querySelectorAll('.education-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe certification cards
    document.querySelectorAll('.certification-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ============================================
// Enhanced Project Card Interactions (Optimized)
// ============================================

function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    let rafId = null;
    
    cards.forEach(card => {
        let isHovering = false;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        
        // Throttled mousemove using requestAnimationFrame
        const handleMouseMove = (e) => {
            if (!isHovering) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            targetX = (centerX - x) / 15; // Reduced sensitivity
            targetY = (y - centerY) / 15;
            
            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    // Smooth interpolation
                    currentX += (targetX - currentX) * 0.2;
                    currentY += (targetY - currentY) * 0.2;
                    
                    // Use translate3d for GPU acceleration
                    card.style.transform = `translate3d(0, -10px, 0) rotateX(${currentY}deg) rotateY(${currentX}deg) scale(1.03)`;
                    
                    rafId = null;
                });
            }
        };
        
        card.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        card.addEventListener('mousemove', handleMouseMove);
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            currentX = 0;
            currentY = 0;
            targetX = 0;
            targetY = 0;
            
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            
            // Smooth reset
            card.style.transform = 'translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================================
// Navigation Smooth Scroll
// ============================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Initialize Everything
// ============================================

// This will be initialized at the end after all functions are defined

// ============================================
// 3D Background Particles
// ============================================

let particlesScene, particlesCamera, particlesRenderer;
let particles = [];
let particlesAnimationId;

function initParticles3D() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    particlesScene = new THREE.Scene();
    particlesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    particlesCamera.position.z = 5;

    particlesRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    particlesRenderer.setSize(window.innerWidth, window.innerHeight);
    particlesRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.02, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x8b5cf6 : 0x3b82f6,
            transparent: true,
            opacity: 0.6
        });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        
        particle.userData = {
            speed: Math.random() * 0.01 + 0.005,
            rotationSpeed: Math.random() * 0.02 + 0.01
        };
        
        particlesScene.add(particle);
        particles.push(particle);
    }

    animateParticles();
}

function animateParticles() {
    particlesAnimationId = requestAnimationFrame(animateParticles);
    
    particles.forEach(particle => {
        particle.position.y += particle.userData.speed;
        particle.rotation.x += particle.userData.rotationSpeed;
        particle.rotation.y += particle.userData.rotationSpeed;
        
        if (particle.position.y > 10) {
            particle.position.y = -10;
        }
    });

    if (particlesRenderer && particlesScene && particlesCamera) {
        particlesRenderer.render(particlesScene, particlesCamera);
    }
}

function onParticlesResize() {
    if (!particlesCamera || !particlesRenderer) return;
    particlesCamera.aspect = window.innerWidth / window.innerHeight;
    particlesCamera.updateProjectionMatrix();
    particlesRenderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onParticlesResize);

// ============================================
// 3D About Section Background
// ============================================

let aboutScene, aboutCamera, aboutRenderer;
let aboutShapes = [];
let aboutAnimationId;

function initAbout3D() {
    const canvas = document.getElementById('about-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const section = canvas.parentElement;
    const width = section.clientWidth;
    const height = section.clientHeight;

    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    aboutCamera.position.set(0, 0, 5);

    aboutRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    aboutRenderer.setSize(width, height);
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating geometric shapes
    const shapes = [
        { type: 'box', count: 3 },
        { type: 'torus', count: 2 },
        { type: 'octahedron', count: 2 }
    ];

    shapes.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            let geometry, material, shape;
            
            switch (type) {
                case 'box':
                    geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(0.2, 0.1, 8, 16);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(0.25);
                    break;
            }

            material = new THREE.MeshPhysicalMaterial({
                color: Math.random() > 0.5 ? 0x8b5cf6 : 0x3b82f6,
                metalness: 0.7,
                roughness: 0.3,
                transparent: true,
                opacity: 0.3,
                emissive: Math.random() > 0.5 ? 0x8b5cf6 : 0x3b82f6,
                emissiveIntensity: 0.2
            });

            shape = new THREE.Mesh(geometry, material);
            shape.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 3
            );
            
            shape.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            };

            aboutScene.add(shape);
            aboutShapes.push(shape);
        }
    });

    animateAbout();
}

function animateAbout() {
    aboutAnimationId = requestAnimationFrame(animateAbout);
    
    aboutShapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
        shape.position.y += shape.userData.floatSpeed;
        
        if (shape.position.y > 3) {
            shape.position.y = -3;
        }
    });

    if (aboutRenderer && aboutScene && aboutCamera) {
        aboutRenderer.render(aboutScene, aboutCamera);
    }
}

function onAboutResize() {
    if (!aboutCamera || !aboutRenderer) return;
    const section = document.getElementById('about-3d-canvas').parentElement;
    const width = section.clientWidth;
    const height = section.clientHeight;
    aboutCamera.aspect = width / height;
    aboutCamera.updateProjectionMatrix();
    aboutRenderer.setSize(width, height);
}

window.addEventListener('resize', onAboutResize);

// ============================================
// 3D Contact Section Background
// ============================================

let contactScene, contactCamera, contactRenderer;
let contactShapes = [];
let contactAnimationId;

function initContact3D() {
    const canvas = document.getElementById('contact-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const section = canvas.parentElement;
    const width = section.clientWidth;
    const height = section.clientHeight;

    contactScene = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    contactCamera.position.set(0, 0, 5);

    contactRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    contactRenderer.setSize(width, height);
    contactRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create orbiting rings
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.TorusGeometry(1 + i * 0.5, 0.05, 8, 50);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x8b5cf6 : 0x3b82f6,
            transparent: true,
            opacity: 0.2
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        ring.userData = {
            rotationSpeed: (i + 1) * 0.005,
            index: i
        };
        contactScene.add(ring);
        contactShapes.push(ring);
    }

    animateContact();
}

function animateContact() {
    contactAnimationId = requestAnimationFrame(animateContact);
    
    contactShapes.forEach(ring => {
        ring.rotation.z += ring.userData.rotationSpeed;
        ring.rotation.y += ring.userData.rotationSpeed * 0.5;
    });

    if (contactRenderer && contactScene && contactCamera) {
        contactRenderer.render(contactScene, contactCamera);
    }
}

function onContactResize() {
    if (!contactCamera || !contactRenderer) return;
    const section = document.getElementById('contact-3d-canvas').parentElement;
    const width = section.clientWidth;
    const height = section.clientHeight;
    contactCamera.aspect = width / height;
    contactCamera.updateProjectionMatrix();
    contactRenderer.setSize(width, height);
}

window.addEventListener('resize', onContactResize);

// ============================================
// Initialize All 3D Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Three.js to load
    if (typeof THREE !== 'undefined') {
        initHero3D();
        initParticles3D();
        initAbout3D();
        initContact3D();
    } else {
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                initHero3D();
                initParticles3D();
                initAbout3D();
                initContact3D();
            }
        }, 100);
    }
    
    // Initialize skills (no longer needs Three.js)
    initSkills3D();
    initMagneticButton();
    initScrollAnimations();
    initProjectCards();
    initNavigation();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (heroAnimationId) {
        cancelAnimationFrame(heroAnimationId);
    }
    if (particlesAnimationId) {
        cancelAnimationFrame(particlesAnimationId);
    }
    if (aboutAnimationId) {
        cancelAnimationFrame(aboutAnimationId);
    }
    if (contactAnimationId) {
        cancelAnimationFrame(contactAnimationId);
    }
    if (heroRenderer) {
        heroRenderer.dispose();
    }
    if (particlesRenderer) {
        particlesRenderer.dispose();
    }
    if (aboutRenderer) {
        aboutRenderer.dispose();
    }
    if (contactRenderer) {
        contactRenderer.dispose();
    }
});
