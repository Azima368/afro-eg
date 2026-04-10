// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create mobile menu toggle button
    const mainContent = document.querySelector('.admin-main');
    if (mainContent) {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-toggle';
        menuButton.id = 'mobileMenuToggle';
        menuButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>القائمة</span>
        `;
        mainContent.insertBefore(menuButton, mainContent.firstChild);

        // Toggle sidebar
        const sidebar = document.querySelector('.admin-sidebar');
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Close sidebar when clicking a nav item
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
});
