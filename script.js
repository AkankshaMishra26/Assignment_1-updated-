document.addEventListener("DOMContentLoaded", () => {
    const buttonsContainer = document.getElementById('buttons-container');
    const addButton = document.getElementById('add-button');
    const resetButton = document.getElementById('reset-button');
    const resultsDiv = document.getElementById('results');
    const percentagesDiv = document.getElementById('percentages');

    let votes = {};

    function initializeVotes() {
        // Retrieve votes and candidate IDs from localStorage
        const storedVotes = JSON.parse(localStorage.getItem('votes')) || {};
        const storedCandidates = JSON.parse(localStorage.getItem('candidates')) || [];

        // Initialize votes with stored data
        votes = storedVotes;

        // Clear existing buttons and percentage displays
        buttonsContainer.innerHTML = '';
        percentagesDiv.innerHTML = '';

        // Create buttons and percentage displays for stored candidates
        storedCandidates.forEach(id => {
            createButton(id);
            createPercentageDisplay(id);
        });

        calculatePercentages();
    }

    function updateVotes(id) {
        votes[id]++;
        saveVotes();
        calculatePercentages();
    }

    function calculatePercentages() {
        const totalVotes = Object.values(votes).reduce((acc, curr) => acc + curr, 0);
        const percentages = {};

        for (const [id, count] of Object.entries(votes)) {
            percentages[id] = totalVotes ? ((count / totalVotes) * 100).toFixed(2) : 0;
        }

        updatePercentages(percentages);
        displayResults(percentages);
    }

    function updatePercentages(percentages) {
        for (const [id, percentage] of Object.entries(percentages)) {
            const percentageElement = document.getElementById(`percentage${id}`);
            if (percentageElement) {
                percentageElement.textContent = `${id}: ${percentage}% (${votes[id]} votes)`;
            }
        }
    }

    function displayResults(percentages) {
        let highestVote = -1;
        let highestVoteButton = [];
        let resultsHtml = '';

        for (const [id, percentage] of Object.entries(percentages)) {
            if (votes[id] > highestVote) {
                highestVote = votes[id];
                highestVoteButton = [id];
            } else if (votes[id] === highestVote) {
                highestVoteButton.push(id);
            }
        }

        if (highestVoteButton.length > 1) {
            resultsHtml += `<p>It's a tie between: ${highestVoteButton.join(', ')}</p>`;
        } else {
            resultsHtml += `<p>The winner is: ${highestVoteButton[0]}</p>`;
        }

        resultsDiv.innerHTML = resultsHtml;
    }

    function createButton(id) {
        const newButton = document.createElement('button');
        newButton.classList.add('vote-button');
        newButton.setAttribute('data-id', id);
        newButton.textContent = id;
        newButton.addEventListener('click', () => updateVotes(id));
        buttonsContainer.appendChild(newButton);
    }

    function createPercentageDisplay(id) {
        const percentageElement = document.createElement('p');
        percentageElement.id = `percentage${id}`;
        percentageElement.textContent = `${id}: 0%`;
        percentagesDiv.appendChild(percentageElement);
    }

    function addVoteButton() {
        const newButtonId = String.fromCharCode(65 + Object.keys(votes).length);
        createButton(newButtonId);
        votes[newButtonId] = 0;
        saveVotes();
        createPercentageDisplay(newButtonId);
        calculatePercentages();
    }

    function saveVotes() {
        localStorage.setItem('votes', JSON.stringify(votes));
        localStorage.setItem('candidates', JSON.stringify(Object.keys(votes)));
    }

    function resetVotes() {
        for (let id in votes) {
            votes[id] = 0;
        }
        saveVotes();
        calculatePercentages();
    }

    addButton.addEventListener('click', addVoteButton);
    resetButton.addEventListener('click', resetVotes);

    initializeVotes();
});


