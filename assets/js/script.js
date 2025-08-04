document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
        });
    }
});
