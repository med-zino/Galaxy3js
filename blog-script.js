// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // Smooth scroll for TOC links
    const tocLinks = document.querySelectorAll('.toc a');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = 20; // Offset from top
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Highlight active section in TOC
    const sections = document.querySelectorAll('.content section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                tocLinks.forEach(link => {
                    link.style.fontWeight = 'normal';
                    link.style.color = 'var(--text-primary)';
                });
                
                // Add active class to current link
                const activeLink = document.querySelector(`.toc a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.style.fontWeight = '600';
                    activeLink.style.color = 'var(--link-color)';
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyButton.title = 'Copy code';
        
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                copyButton.style.color = '#28a745';
                
                setTimeout(() => {
                    copyButton.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                    copyButton.style.color = '';
                }, 2000);
            });
        });
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
    
    // Add keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            themeToggle.click();
        }
    });
    
    // Detect system theme preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only apply system preference if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', systemTheme);
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only apply if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
        }
    });
    
    // Add reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });
    
    console.log('🚀 Three.js Blog loaded successfully!');
    console.log('💡 Tip: Press Ctrl/Cmd + Shift + T to toggle theme');
});
