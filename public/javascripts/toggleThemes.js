
const navbar = document.querySelector('#navbar');
const body = document.querySelector('#body');
const footer = document.querySelector('#footer');
const footerText = document.querySelector('#footerText');

function toggleLight() {
    sessionStorage.setItem('theme', 'light');
    applyTheme();
}

function toggleDark() {
    sessionStorage.setItem('theme', 'dark');
    applyTheme();
}

function applyTheme() {
    const theme = sessionStorage.getItem('theme');

    if (theme === 'dark') {
        body.setAttribute('data-bs-theme', 'dark');
        navbar.classList.remove('bg-light', 'navbar-light');
        footer.classList.remove('bg-dark');
        navbar.style.backgroundColor = '#31373D';
        footer.style.backgroundColor = '#31373D';
        footerText.classList.remove('text-secondary');
    } else {
        body.setAttribute('data-bs-theme', 'light');
        navbar.classList.add('bg-dark', 'navbar-dark');
        footer.classList.add('bg-dark');
        footerText.classList.add('text-secondary');
    }
}

// Initialize theme on page load
applyTheme();

