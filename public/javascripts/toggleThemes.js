const lightBtn = document.querySelector('#lightBtn');
const darkBtn = document.querySelector('#darkBtn');
const navbar = document.querySelector('#navbar');
const body = document.querySelector('#body');
const footer = document.querySelector('#footer');
const footerText = document.querySelector('#footerText');

lightBtn.addEventListener('click', toggleLight);
darkBtn.addEventListener('click', toggleDark)

function toggleLight() {
    sessionStorage.setItem('theme', 'light');
    console.log('toggled light')
    applyTheme();
}

function toggleDark() {
    sessionStorage.setItem('theme', 'dark');
    console.log('toggled dark')
    applyTheme();
}

function applyTheme() {
    const theme = sessionStorage.getItem('theme');

    if (theme === 'dark') {

        body.setAttribute('data-bs-theme', 'dark');
        footer.classList.remove('bg-dark');
        footer.style.backgroundColor = '#31373D';
        footerText.classList.remove('text-secondary');
    } else {

        body.setAttribute('data-bs-theme', 'light');
        footer.classList.add('bg-dark');
        footerText.classList.add('text-secondary');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const lightBtn = document.querySelector('#lightBtn');
    const darkBtn = document.querySelector('#darkBtn');
    const navbar = document.querySelector('#navbar');
    const body = document.querySelector('body');
    const footer = document.querySelector('#footer');
    const footerText = document.querySelector('#footerText');

    lightBtn.addEventListener('click', toggleLight);
    darkBtn.addEventListener('click', toggleDark);



    // Apply the theme after initializing the maps
    applyTheme();
});

applyTheme();

