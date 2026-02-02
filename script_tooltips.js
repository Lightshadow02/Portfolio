document.addEventListener('DOMContentLoaded', () => {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'cyber-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const techItems = document.querySelectorAll('.tech-item');
    let currentActiveItem = null;

    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Throttle function to limit frequency of position updates
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    function updateTooltipPos(e) {
        // Get coordinates from touch or mouse event
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        // Basic positioning
        let x = clientX + 20;
        let y = clientY + 20;

        // Viewport boundary check (Prevent overflow)
        const tooltipRect = tooltip.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        if (x + tooltipRect.width > winWidth) {
            x = clientX - tooltipRect.width - 20;
        }

        if (y + tooltipRect.height > winHeight) {
            y = clientY - tooltipRect.height - 20;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    function showTooltip(item, e) {
        const desc = item.getAttribute('data-description');
        if (desc) {
            tooltip.textContent = desc;
            tooltip.style.display = 'block';
            updateTooltipPos(e);
            currentActiveItem = item;
        }
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
        currentActiveItem = null;
    }

    // Throttle tooltip position updates to every 16ms (~60fps)
    const throttledUpdatePos = throttle(updateTooltipPos, 16);

    techItems.forEach(item => {
        if (isTouchDevice) {
            // Touch events for mobile
            item.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent long-press menu

                // Toggle tooltip on tap
                if (currentActiveItem === item) {
                    hideTooltip();
                } else {
                    hideTooltip(); // Hide any existing tooltip
                    showTooltip(item, e);
                }
            });
        } else {
            // Mouse events for desktop
            item.addEventListener('mouseenter', (e) => {
                showTooltip(item, e);
            });

            item.addEventListener('mousemove', throttledUpdatePos);

            item.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        }
    });

    // Close tooltip when tapping outside on mobile
    if (isTouchDevice) {
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.tech-item') && !e.target.closest('.cyber-tooltip')) {
                hideTooltip();
            }
        });
    }
});
