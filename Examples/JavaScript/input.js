console.log("input.js loaded!")

document.addEventListener('DOMContentLoaded', function() {
    function generate() {
        fetch('/api/text').then(reponse => reponse.json()).then(data => {
            //const header = document.querySelector('.input');
            //header.innerText = data.number;
        });
    }

    function createCard(props) {
        const { id, name, number } = props;
        const componentHTML = `
            <div id=${id} class="player-card">
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="blank-profile-picture">
                <div class="player-card-content">
                    <div class="player-card-name">${name}</div>
                    <div class="player-card-details">
                        <p>Number: ${number}</p>
                    </div>
                </div>    
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = componentHTML;
        
        return container.firstElementChild;
    }

    const myComponent = createCard({
        id: 'my-component',
        name: 'John Doe',
        number: '#00',
    });

    // Initial generation
    generate();
    // Generate elements every 10 seconds
    setInterval(generate, 5000);
});