// Infobulles des technologies (.tech-item[data-description])
// - Souris : l'infobulle suit le pointeur.
// - Toucher : un appui l'ouvre sous le logo (un second appui la ferme), sans
//   jamais bloquer le défilement de la page.
// - Clavier : elle s'ouvre au focus, Échap la ferme.
// L'infobulle reste toujours dans l'écran (marge de 12 px).
document.addEventListener('DOMContentLoaded', () => {
    const MARGIN = 12;
    const tooltip = document.createElement('div');
    tooltip.className = 'cyber-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.id = 'tech-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const items = document.querySelectorAll('.tech-item[data-description]');
    let active = null;
    let lastPointer = 'mouse';
    document.addEventListener('pointerdown', e => { lastPointer = e.pointerType || 'mouse'; }, true);

    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    function place(x, y, below) {
        const w = tooltip.offsetWidth;
        const h = tooltip.offsetHeight;
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;
        let left = clamp(x - w / 2, MARGIN, vw - w - MARGIN);
        let top = below.top + 10;
        if (top + h > vh - MARGIN) {
            top = below.bottom - h - 10;
        }
        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(clamp(top, MARGIN, vh - h - MARGIN))}px`;
    }

    // Sous l'élément, centrée sur lui (toucher, clavier)
    function placeUnder(item) {
        const r = item.getBoundingClientRect();
        place(r.left + r.width / 2, 0, { top: r.bottom, bottom: r.top });
    }

    // Près du pointeur (souris)
    function placeAtPointer(e) {
        place(e.clientX, 0, { top: e.clientY + 8, bottom: e.clientY - 8 });
    }

    function show(item) {
        tooltip.textContent = item.getAttribute('data-description');
        tooltip.style.display = 'block';
        item.setAttribute('aria-describedby', 'tech-tooltip');
        active = item;
    }

    function hide() {
        if (active) active.removeAttribute('aria-describedby');
        tooltip.style.display = 'none';
        active = null;
    }

    items.forEach(item => {
        item.setAttribute('tabindex', '0');

        item.addEventListener('pointerenter', e => {
            if (e.pointerType !== 'mouse') return;
            show(item);
            placeAtPointer(e);
        });

        item.addEventListener('pointermove', e => {
            if (e.pointerType === 'mouse' && active === item) placeAtPointer(e);
        });

        item.addEventListener('pointerleave', e => {
            if (e.pointerType === 'mouse') hide();
        });

        // Un « click » n'est émis que pour un vrai appui, jamais pour un geste
        // de défilement : le scroll reste libre sur toute la grille.
        item.addEventListener('click', () => {
            if (lastPointer === 'mouse') return;
            if (active === item) {
                hide();
            } else {
                show(item);
                placeUnder(item);
            }
        });

        item.addEventListener('focus', () => {
            if (item.matches(':focus-visible')) {
                show(item);
                placeUnder(item);
            }
        });

        item.addEventListener('blur', () => {
            if (active === item) hide();
        });
    });

    // Fermer : appui ailleurs, défilement, redimensionnement, Échap
    document.addEventListener('pointerdown', e => {
        if (active && !e.target.closest('.tech-item')) hide();
    });
    window.addEventListener('scroll', () => { if (active) hide(); }, { passive: true });
    window.addEventListener('resize', () => { if (active) hide(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') hide();
    });
});
