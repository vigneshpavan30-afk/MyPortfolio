/* ============================================================
   Pavan Vignesh — Portfolio (3D redesign)
   Three.js r128 background scene + UI interactions
   ============================================================ */

'use strict';

// Mark that JS is running so CSS only hides content we will actually reveal.
// If this script fails to load/parse, the class is never added and all
// content stays visible (no blank page).
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const isSmall = window.innerWidth < 768;

/* ============================================================
   Skills data
   ============================================================ */
const skills = [
    'Python', 'MySQL', 'Java', 'HTML', 'CSS',
    'Excel', 'Power BI', 'Tableau',
    'Data Cleaning', 'Data Modeling', 'Data Visualization',
    'n8n', 'Supabase', 'Generative AI', 'Web Scraping'
];

const skillIcons = {
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    'Excel': 'https://img.icons8.com/color/96/000000/microsoft-excel-2019.png',
    'Power BI': 'https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/SVG/Power-BI.svg',
    'Tableau': 'https://img.icons8.com/color/96/000000/tableau-software.png',
    'n8n': 'https://cdn.jsdelivr.net/gh/n8n-io/n8n@master/assets/n8n-logo.png',
    'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg'
};

/* ============================================================
   Three.js background scene
   ============================================================ */
let scene, camera, renderer, coreMesh, coreWire, stars, orbits;
const basePositions = [];                 // base vertex positions for the breathing core
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
let scrollY = 0;

function initScene() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return false;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060c, 0.035);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isSmall, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));

    // ---- Lights ----
    scene.add(new THREE.AmbientLight(0x6d7bff, 0.45));
    const l1 = new THREE.PointLight(0x8b5cf6, 1.6, 50); l1.position.set(6, 6, 6); scene.add(l1);
    const l2 = new THREE.PointLight(0x06b6d4, 1.3, 50); l2.position.set(-7, -4, 4); scene.add(l2);
    const l3 = new THREE.PointLight(0x3b82f6, 1.1, 50); l3.position.set(0, 5, -6); scene.add(l3);

    // ---- Core icosahedron (breathing) ----
    const detail = isSmall ? 1 : 2;
    const coreGeo = new THREE.IcosahedronGeometry(2.1, detail);
    const pos = coreGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        basePositions.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x14182c, metalness: 0.6, roughness: 0.25,
        emissive: 0x3b1d6b, emissiveIntensity: 0.5, flatShading: true
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // glowing wireframe shell
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.35 });
    coreWire = new THREE.Mesh(new THREE.IcosahedronGeometry(2.45, detail), wireMat);
    scene.add(coreWire);

    // ---- Orbiting particles around the core ----
    const orbitCount = isSmall ? 120 : 260;
    const orbitGeo = new THREE.BufferGeometry();
    const op = new Float32Array(orbitCount * 3);
    for (let i = 0; i < orbitCount; i++) {
        const r = 3 + Math.sin(i * 12.9898) * 0.5 + (i % 7) * 0.18;
        const a = i * 0.61803398875 * Math.PI * 2;
        const y = ((i / orbitCount) - 0.5) * 4;
        op[i * 3] = Math.cos(a) * r;
        op[i * 3 + 1] = y;
        op[i * 3 + 2] = Math.sin(a) * r;
    }
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(op, 3));
    orbits = new THREE.Points(orbitGeo, new THREE.PointsMaterial({
        color: 0x06b6d4, size: 0.05, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(orbits);

    // ---- Starfield ----
    const starCount = isSmall ? 700 : 1800;
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        sp[i * 3] = (rand(i + 1) - 0.5) * 60;
        sp[i * 3 + 1] = (rand(i + 2) - 0.5) * 60;
        sp[i * 3 + 2] = (rand(i + 3) - 0.5) * 60 - 10;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
        color: 0xaab4ff, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false
    }));
    scene.add(stars);

    window.addEventListener('resize', onResize);
    if (!isCoarse) {
        window.addEventListener('mousemove', (e) => {
            mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    return true;
}

// deterministic pseudo-random (Math.random avoided for reproducibility)
function rand(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

let t = 0;
function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    // smooth mouse follow
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    const scrollNorm = scrollY / (document.body.scrollHeight - window.innerHeight || 1);

    if (coreMesh) {
        // breathing vertex displacement
        const pos = coreMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const b = basePositions[i];
            const n = Math.sin(t * 1.5 + b.x * 1.6 + b.y * 1.6 + b.z * 1.6);
            const s = 1 + n * 0.06;
            pos.setXYZ(i, b.x * s, b.y * s, b.z * s);
        }
        pos.needsUpdate = true;
        coreMesh.geometry.computeVertexNormals();

        coreMesh.rotation.y = t * 0.3 + mouse.x * 0.4;
        coreMesh.rotation.x = t * 0.15 + mouse.y * 0.3;
        coreWire.rotation.copy(coreMesh.rotation);
        coreWire.rotation.y += 0.1;

        // camera flies through / past the core as you scroll
        camera.position.z = 9 - scrollNorm * 5;
        camera.position.y = mouse.y * 0.8 - scrollNorm * 1.2;
        camera.position.x = mouse.x * 0.8;
        camera.lookAt(0, 0, 0);

        const coreScale = 1 - scrollNorm * 0.35;
        coreMesh.scale.setScalar(coreScale);
        coreWire.scale.setScalar(coreScale);
    }

    if (orbits) orbits.rotation.y = t * 0.4;
    if (stars) { stars.rotation.y = t * 0.02; stars.rotation.x = t * 0.01; }

    renderer.render(scene, camera);
}

// Static single render for reduced-motion users
function renderStatic() {
    if (coreMesh) { coreMesh.rotation.set(0.4, 0.6, 0); coreWire.rotation.set(0.4, 0.6, 0); }
    if (renderer) renderer.render(scene, camera);
}

function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (reduceMotion) renderStatic();
}

/* ============================================================
   Preloader
   ============================================================ */
function runPreloader(done) {
    const fill = document.getElementById('preloader-fill');
    const count = document.getElementById('preloader-count');
    const pre = document.getElementById('preloader');
    let p = 0;
    const tick = () => {
        p += Math.max(2, (100 - p) * 0.12);
        if (p >= 100) p = 100;
        if (fill) fill.style.width = p + '%';
        if (count) count.textContent = Math.floor(p);
        if (p < 100) {
            setTimeout(tick, 70);
        } else {
            setTimeout(() => {
                pre.classList.add('done');
                document.body.classList.add('loaded');
                if (done) done();
            }, 350);
        }
    };
    tick();
}

/* ============================================================
   Custom cursor
   ============================================================ */
function initCursor() {
    if (isCoarse) return;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    let rx = 0, ry = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', (e) => {
        dx = e.clientX; dy = e.clientY;
        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    });
    const loop = () => {
        rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('[data-cursor="hover"], a, button').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

/* ============================================================
   Skills grid
   ============================================================ */
function buildSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    skills.forEach((skill, i) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.style.transitionDelay = `${(i % 5) * 0.06}s`;

        const icon = document.createElement('div');
        icon.className = 'skill-icon';
        const src = skillIcons[skill];
        if (src) {
            const img = document.createElement('img');
            img.src = src; img.alt = skill; img.className = 'skill-logo'; img.loading = 'lazy';
            img.onerror = function () { this.remove(); icon.textContent = skill.substring(0, 2).toUpperCase(); };
            icon.appendChild(img);
        } else {
            icon.textContent = skill.substring(0, 2).toUpperCase();
        }

        const name = document.createElement('div');
        name.className = 'skill-name';
        name.textContent = skill;

        card.append(icon, name);
        grid.appendChild(card);
    });
}

/* ============================================================
   Scroll reveal + skill cards
   ============================================================ */
function initReveal() {
    const items = document.querySelectorAll('.reveal, .skill-card');

    // Fallback: if IntersectionObserver is missing, reveal everything immediately.
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => {
            el.classList.add('visible');
            if (el.dataset.count !== undefined) animateCount(el);
        });
        return;
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (e.target.dataset.count !== undefined) animateCount(e.target);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => obs.observe(el));
}

function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    if (reduceMotion) { el.textContent = target + suffix; return; }
    let cur = 0;
    const step = target / 45;
    const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target.toFixed(decimals) + suffix; return; }
        el.textContent = cur.toFixed(decimals) + suffix;
        requestAnimationFrame(tick);
    };
    tick();
}

/* ============================================================
   Navbar (scroll state + active link + mobile menu)
   ============================================================ */
function initNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const progress = document.getElementById('scroll-progress');

    const onScroll = () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        const max = document.body.scrollHeight - window.innerHeight;
        if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

        let current = '';
        sections.forEach(sec => {
            if (y >= sec.offsetTop - 140) current = sec.id;
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('open');
        });
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            toggle.classList.remove('active'); menu.classList.remove('open');
        }));
    }
}

/* ============================================================
   3D tilt on cards
   ============================================================ */
function initTilt() {
    if (isCoarse) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
        let raf = null;
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            const rx = (py - 0.5) * -8;
            const ry = (px - 0.5) * 8;
            // feed the project glow position
            card.style.setProperty('--mx', (px * 100) + '%');
            card.style.setProperty('--my', (py * 100) + '%');
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            });
        });
        card.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            card.style.transform = '';
        });
    });
}

/* ============================================================
   Magnetic contact button
   ============================================================ */
function initMagnetic() {
    if (isCoarse) return;
    const btn = document.getElementById('magnetic-btn');
    if (!btn) return;
    const label = btn.querySelector('span');
    btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.45}px)`;
        if (label) label.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        if (label) label.style.transform = '';
    });
}

/* ============================================================
   Boot
   ============================================================ */
function boot() {
    buildSkills();
    initCursor();
    initNav();
    initTilt();
    initMagnetic();
    initReveal();

    const ok = initScene();
    if (ok) {
        if (reduceMotion) renderStatic();
        else animate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    runPreloader(boot);
});
