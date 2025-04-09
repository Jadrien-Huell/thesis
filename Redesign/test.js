const dropdown_containers = document.querySelectorAll('.dropdown-container');
const lineup_containers = document.querySelectorAll('.lineup-container');

dropdown_containers.forEach(container => {
    const trigger = container.querySelector('.trigger');
    const menu  = container.querySelector('.dropdown-menu');

    trigger.addEventListener('click', function(event) {
        menu.classList.toggle('show');
    })

    // Hides menu when not used
    document.addEventListener('click', function(event) {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
})

lineup_containers.forEach(container => {
    const trigger = container.querySelector('.trigger');
    const menu = container.querySelector('.roster')

    trigger.addEventListener('click', function(event) {
        menu.classList.toggle('show');
    })

    // Hides menu when not used
    document.addEventListener('click', function(event) {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
})