document.addEventListener('DOMContentLoaded', () => {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'cyber-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const techItems = document.querySelectorAll('.tech-item');

    techItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const desc = item.getAttribute('data-description');
            if (desc) {
                tooltip.textContent = desc;
                tooltip.style.display = 'block';
                updateTooltipPos(e);
            }
        });

        item.addEventListener('mousemove', (e) => {
            updateTooltipPos(e);
        });

        item.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });

    function updateTooltipPos(e) {
        // Basic positioning
        let x = e.clientX + 20;
        let y = e.clientY + 20;

        // Viewport boundary check (Prevent overflow)
        const tooltipRect = tooltip.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        if (x + tooltipRect.width > winWidth) {
            x = e.clientX - tooltipRect.width - 20;
        }

        if (y + tooltipRect.height > winHeight) {
            y = e.clientY - tooltipRect.height - 20;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }
});
