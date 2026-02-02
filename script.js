document.addEventListener('DOMContentLoaded', () => {
    // Navigation Burger Menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);

        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.setAttribute('aria-expanded', 'false');
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        });
    });

    // GitHub Projects Integration
    const projectsGrid = document.getElementById('projects-grid');
    const username = 'Lightshadow02';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
    const CACHE_KEY = 'github_projects_cache';
    const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    const LAST_SYNC_KEY = 'github_last_sync';

    async function fetchProjects() {
        try {
            // Check cache first
            const cachedData = localStorage.getItem(CACHE_KEY);
            const lastSync = localStorage.getItem(LAST_SYNC_KEY);
            const now = Date.now();

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);

                // Use cache if less than 12 hours old
                if (now - timestamp < CACHE_DURATION) {
                    console.log('✅ Using cached GitHub data (fresh)');
                    renderProjects(data);
                    return;
                }
            }

            // Try to sync with GitHub API (only if cache expired or doesn't exist)
            console.log('🔄 Syncing with GitHub API...');
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // Check if rate limit exceeded
                if (response.status === 403) {
                    throw new Error('Rate limit exceeded');
                }
                throw new Error('GitHub API Error');
            }

            const data = await response.json();

            // Filter by topic 'cours' (case insensitive), sort by updated date, and take top 6
            const recentProjects = data
                .filter(repo => repo.topics && repo.topics.some(t => t.toLowerCase() === 'cours'))
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 6);

            // Cache the filtered data
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: recentProjects,
                timestamp: Date.now()
            }));
            localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());

            console.log('✅ GitHub sync successful');
            renderProjects(recentProjects);

        } catch (error) {
            console.error('❌ Error fetching projects:', error);

            // Fallback 1: Try to use cached data even if expired
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const cacheAge = Math.round((Date.now() - timestamp) / (1000 * 60 * 60));
                console.log(`⚠️ Using expired cache (${cacheAge}h old)`);
                renderProjects(data);
                showWarning(`⚠️ Projets affichés depuis le cache (dernière sync: il y a ${cacheAge}h)`);
                return;
            }

            // Fallback 2: Use local data from projects-data.js
            if (typeof LOCAL_PROJECTS !== 'undefined' && LOCAL_PROJECTS.length > 0) {
                console.log('📁 Using local projects data (fallback)');
                renderProjects(LOCAL_PROJECTS);
                showWarning('📁 Affichage des projets depuis les données locales');
                return;
            }

            // Final fallback: Error message
            if (error.message === 'Rate limit exceeded') {
                projectsGrid.innerHTML = '<p class="loading" style="color: var(--accent-secondary);">⚠️ Limite de requêtes GitHub atteinte. Prochaine sync dans ~12h.</p>';
            } else {
                projectsGrid.innerHTML = '<p class="loading">Impossible de charger les projets pour le moment.</p>';
            }
        }
    }

    // Helper function to show warning messages
    function showWarning(message) {
        // Remove existing warning if any
        const existingWarning = document.querySelector('.api-warning');
        if (existingWarning) {
            existingWarning.remove();
        }

        const warning = document.createElement('p');
        warning.className = 'api-warning';
        warning.style.color = 'var(--accent-secondary)';
        warning.style.fontSize = '0.85rem';
        warning.style.textAlign = 'center';
        warning.style.marginTop = '1rem';
        warning.style.fontFamily = 'var(--font-mono)';
        warning.textContent = message;
        projectsGrid.parentElement.insertBefore(warning, projectsGrid.nextSibling);
    }

    function renderProjects(projects) {
        projectsGrid.innerHTML = ''; // Clear loading

        if (projects.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'Aucun projet public trouvé.';
            projectsGrid.appendChild(message);
            return;
        }

        projects.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Voir le projet ${repo.name} sur GitHub`);

            // Create card structure with DOM methods (safer than innerHTML)
            const projectInner = document.createElement('div');
            projectInner.className = 'project-inner';

            // Front face
            const projectFront = document.createElement('div');
            projectFront.className = 'project-front';

            const title = document.createElement('h3');
            title.className = 'project-title';
            title.textContent = formatRepoName(repo.name); // Default title, will be updated from README

            projectFront.appendChild(title);

            // Back face - will be populated with README
            const projectBack = document.createElement('div');
            projectBack.className = 'project-back';

            const loadingText = document.createElement('p');
            loadingText.className = 'project-desc';
            loadingText.textContent = 'Chargement du README...';
            projectBack.appendChild(loadingText);

            projectInner.appendChild(projectFront);
            projectInner.appendChild(projectBack);
            card.appendChild(projectInner);

            // Fetch README for this repo and update title
            fetchReadme(repo.name, projectBack, title);

            // Detect mobile
            const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            let isFlipped = false;

            // Make the whole card clickable to open repo
            const openRepo = () => {
                window.open(repo.html_url, '_blank', 'noopener,noreferrer');
            };

            if (isMobile) {
                // On mobile: first tap flips, second tap opens link
                card.addEventListener('click', (e) => {
                    if (!isFlipped) {
                        // First tap: flip the card
                        e.preventDefault();
                        projectInner.style.transform = 'rotateY(180deg)';
                        isFlipped = true;
                    } else {
                        // Second tap: open repo
                        openRepo();
                    }
                });
            } else {
                // On desktop: click opens directly (hover already shows back)
                card.addEventListener('click', openRepo);
            }

            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openRepo();
                }
            });

            projectsGrid.appendChild(card);
        });
    }

    // Helper function to remove emojis from text
    function removeEmojis(text) {
        // Remove emojis using regex (covers most emoji ranges)
        return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]/gu, '').trim();
    }

    // Fetch README content for a specific repository
    async function fetchReadme(repoName, backElement, titleElement) {
        const readmeUrl = `https://api.github.com/repos/${username}/${repoName}/readme`;

        try {
            const response = await fetch(readmeUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (!response.ok) {
                throw new Error('README not found');
            }

            let readmeContent = await response.text();

            // Extract first title (# Title) from README for the card front
            const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
            if (titleMatch && titleElement) {
                const extractedTitle = removeEmojis(titleMatch[1]);
                if (extractedTitle) {
                    titleElement.textContent = extractedTitle;
                }
            }

            // Clean up README: remove badges, images, and excessive whitespace
            readmeContent = readmeContent
                .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
                .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '') // Remove badge links
                .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
                .trim();

            // Limit README length for display (first 600 characters of cleaned content)
            if (readmeContent.length > 600) {
                // Try to cut at a sentence or paragraph break
                let cutIndex = readmeContent.lastIndexOf('\n', 600);
                if (cutIndex === -1 || cutIndex < 400) {
                    cutIndex = readmeContent.lastIndexOf('. ', 600);
                }
                if (cutIndex === -1 || cutIndex < 400) {
                    cutIndex = 600;
                }
                readmeContent = readmeContent.substring(0, cutIndex) + '...';
            }

            // Parse Markdown to HTML using marked.js
            let htmlContent = '';
            if (typeof marked !== 'undefined') {
                // Configure marked for security
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: false,
                    mangle: false
                });
                htmlContent = marked.parse(readmeContent);
            } else {
                // Fallback if marked.js is not loaded
                htmlContent = `<p>${readmeContent.replace(/\n/g, '<br>')}</p>`;
            }

            // Clear loading message and display README
            backElement.innerHTML = '';
            const readmeContainer = document.createElement('div');
            readmeContainer.className = 'project-readme';
            readmeContainer.innerHTML = htmlContent;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '15px';

            const button = document.createElement('span');
            button.className = 'btn secondary-btn';
            button.style.padding = '5px 15px';
            button.style.fontSize = '0.8rem';
            button.textContent = 'Voir le code';

            buttonContainer.appendChild(button);
            backElement.appendChild(readmeContainer);
            backElement.appendChild(buttonContainer);

        } catch (error) {
            console.error(`Error fetching README for ${repoName}:`, error);
            backElement.innerHTML = '';
            const errorText = document.createElement('p');
            errorText.className = 'project-desc';
            errorText.textContent = 'README non disponible pour ce projet.';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '15px';

            const button = document.createElement('span');
            button.className = 'btn secondary-btn';
            button.style.padding = '5px 15px';
            button.style.fontSize = '0.8rem';
            button.textContent = 'Voir le code';

            buttonContainer.appendChild(button);
            backElement.appendChild(errorText);
            backElement.appendChild(buttonContainer);
        }
    }

    // Helper to make repo names prettier (replace - with space, capitalize properly)
    function formatRepoName(name) {
        // Replace - and _ with spaces
        let formatted = name.replace(/[-_]/g, ' ');

        // Title Case: capitalize first letter of each word, preserve accents
        formatted = formatted.split(' ').map(word => {
            if (word.length === 0) return word;
            // Capitalize first letter, keep rest lowercase
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');

        return formatted;
    }

    // Initialize
    fetchProjects();
});
