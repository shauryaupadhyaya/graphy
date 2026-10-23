// team profile cards
const teamCards = document.querySelectorAll('.team-card');
const modal = document.getElementById('profileModal');
const profileImage = document.getElementById('profileImage');
const profileName = document.getElementById('profileName');
const profileRole = document.getElementById('profileRole');
const profileBackground = document.getElementById('profileBackground');
const profileGithub = document.getElementById('profileGithub');
const closeButtons = modal.querySelectorAll('[data-close]');
const closeButton = modal.querySelector('.profile-close');
let lastFocusedCard = null;

function openProfile(card){
    const data = card.dataset;
    lastFocusedCard = card;

    profileImage.src = data.image;
    profileImage.alt = data.name;
    profileName.textContent = data.name;
    profileRole.textContent = data.role;
    profileBackground.textContent = data.background;
    profileGithub.href = data.git;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeButton.focus();
}

function closeProfile(){
    if (!modal.classList.contains('active')) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastFocusedCard){
        lastFocusedCard.focus();
    }
}

teamCards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    card.addEventListener('click', () => {
        openProfile(card);
    });

    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' '){
            event.preventDefault();
            openProfile(card);
        }
    });
});

closeButtons.forEach((button) => {
    button.addEventListener('click', closeProfile);
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){
        closeProfile();
    }
});