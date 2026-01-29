document.addEventListener('DOMContentLoaded', () => {
    // Navigation Burger Menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
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

    async function fetchProjects() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('GitHub API Error');
            }
            const data = await response.json();

            // Filter by topic 'cours' (case insensitive), sort by updated date, and take top 6
            const recentProjects = data
                .filter(repo => repo.topics && repo.topics.some(t => t.toLowerCase() === 'cours'))
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 6);

            renderProjects(recentProjects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            projectsGrid.innerHTML = '<p class="loading">Impossible de charger les projets pour le moment.</p>';
        }
    }

    function renderProjects(projects) {
        projectsGrid.innerHTML = ''; // Clear loading

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p>Aucun projet public trouvé.</p>';
            return;
        }

        projects.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            // Icon Strategy: Try specific path first, fallback to owner avatar
            // Note: Checking image existence via JS can be slow for many items.
            // We will set the src to the custom icon, and onerror replace with avatar.
            const iconUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/main/assets/icon.png`;
            const fallbackIcon = repo.owner.avatar_url;

            card.innerHTML = `
                <div class="project-inner">
                    <div class="project-front">
                        <div class="project-icon">
                            <img src="${iconUrl}" alt="${repo.name} icon" onerror="this.onerror=null; this.src='${fallbackIcon}'">
                        </div>
                        <h3 class="project-title">${formatRepoName(repo.name)}</h3>
                    </div>
                    <div class="project-back">
                        <p class="project-desc">${repo.description || 'Pas de description disponible.'}</p>
                        <div style="margin-top: 15px;">
                            <span class="btn secondary-btn" style="padding: 5px 15px; font-size: 0.8rem;">Voir le code</span>
                        </div>
                    </div>
                </div>
            `;

            // Make the whole card clickable to open repo
            card.addEventListener('click', () => {
                window.open(repo.html_url, '_blank');
            });

            projectsGrid.appendChild(card);
        });
    }

    // Helper to make repo names prettier (replace - with space, capitalize)
    function formatRepoName(name) {
        return name.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase();
    }

    // Initialize
    fetchProjects();
});
