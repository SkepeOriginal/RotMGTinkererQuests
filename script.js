
var currentQuestGroup = [];
var currentQuests = {};

document.addEventListener('DOMContentLoaded', function() {

    const questGrid = document.getElementById('quest-grid');
    const allQuestGrid = document.getElementById('all-quest-grid');
    const allQuestContainer = document.getElementById('all-quest-container');
    const questGroupContainer = document.getElementById('quest-group-container');
    const refreshBox = document.getElementById('refreshBox');

    refreshBox.addEventListener('click', function () {
        refreshPage();
    });

    // Function to display quests as a grid
    function displayQuests(quests, images, questGroups) {
        allQuestContainer.innerHTML = '';
        Object.keys(quests).forEach(questName => {
            const questData = quests[questName]
            if (!currentQuestGroup.includes(questData.questGroup)) {
                return
            }
            const questContainer = document.createElement('div');
            questContainer.classList.add('quest-container');

            // Left column for quest items
            const itemsColumn = document.createElement('div');
            itemsColumn.classList.add('columnItems');
            questData.itemsNeeded.forEach(item => {
                const itemElement = document.createElement('img');
                const image = `./images/${images[item]}.png`
                itemElement.src = image;
                itemElement.classList.add('item')
                itemElement.addEventListener('click', toggleHighlight);
                itemsColumn.appendChild(itemElement);
            });

            // Right column for quest rewards
            const rewardsColumn = document.createElement('div');
            rewardsColumn.classList.add('column');
            questData.rewards.forEach(reward => {
                const rewardElement = document.createElement('img');
                const image = `./images/${images[reward]}.png`
                rewardElement.src = image;
                rewardsColumn.appendChild(rewardElement);
            });

            // Complete Column to complete quest rewards
            const completeColumn = document.createElement('div');
            completeColumn.classList.add('column');
            const textBox = document.createElement('div');
            textBox.className = 'completeBox';
            textBox.textContent = 'Add';
            textBox.addEventListener('click', function () {
                addQuest(questData, questName);
            });
            completeColumn.appendChild(textBox);

            questContainer.appendChild(itemsColumn);
            questContainer.appendChild(rewardsColumn);
            questContainer.appendChild(completeColumn);

            allQuestContainer.appendChild(questContainer);
        });
    }

    function displayQuestGroups(quests, images, questGroups) {
        questGroupContainer.innerHTML = '';
        Object.keys(questGroups).forEach(questGroupName => {
            const questGroup = questGroups[questGroupName];

            const questGroupImage = document.createElement('img');
            const image = `./images/${images[questGroup.image]}.png`;
            questGroupImage.src = image;
            questGroupImage.id = questGroup.groupName;
            questGroupImage.classList.add('questGroup');
            questGroupImage.addEventListener('click', toggleQuestGroup);
            questGroupContainer.appendChild(questGroupImage);
        });
        questGroupContainer.appendChild(questGroupContainer);
    }

    function refreshQuests() {
        const quests = fetchData('./data/quests.json');
        const images = fetchData('./data/images.json');
        const questGroups = fetchData('./data/questGroups.json');
        Promise.all([quests, images, questGroups])
            .then(dataArray => {
                const [dataOne, dataTwo, dataThree] = dataArray;
                displayQuests(dataOne, dataTwo, dataThree);
            })
    }

    function refreshPage() {
        currentQuestGroup = [];
        currentQuests = {};

        Array.from(document.querySelectorAll('.questGroup')).every(function(item) {
            return item.classList.contains('highlighted');
        });

        const quests = fetchData('./data/quests.json');
        const images = fetchData('./data/images.json');
        const questGroups = fetchData('./data/questGroups.json');
        Promise.all([quests, images, questGroups])
            .then(dataArray => {
                const [dataOne, dataTwo, dataThree] = dataArray;
                displayActiveQuests(dataTwo);
                displayQuests(dataOne, dataTwo, dataThree);
            })
    }

    function setupQuestTracker() {
        

        const quests = fetchData('./data/quests.json');
        const images = fetchData('./data/images.json');
        const questGroups = fetchData('./data/questGroups.json');
        Promise.all([quests, images, questGroups])
            .then(dataArray => {
                const [dataOne, dataTwo, dataThree] = dataArray;
                displayQuestGroups(dataOne, dataTwo, dataThree);
                displayQuests(dataOne, dataTwo, dataThree);
            })
    }

    function toggleQuestGroup() {
        const questGroupContainer = this.closest('.quest-group-container');
        questGroupContainer.querySelectorAll('.questGroup').forEach(function(item) {
            if (item.classList.contains('highlighted')) {
                item.classList.remove('highlighted');
            }
        });
    
        if (currentQuestGroup.includes(this.id)) {
            currentQuestGroup = [];
        } else {
            currentQuestGroup = [this.id];
            this.classList.add('highlighted');
        }
        refreshQuests();
    }

    setupQuestTracker();
});

function toggleHighlight() {
    this.classList.toggle('highlighted');

    const columnItems = this.closest('.columnItems');
    const questContainer = columnItems.closest('.quest-container');

    const allHighlighted = Array.from(columnItems.querySelectorAll('.item')).every(function(item) {
        return item.classList.contains('highlighted');
    });

    if (allHighlighted) {
        questContainer.classList.add('all-highlighted');
    } else {
        questContainer.classList.remove('all-highlighted');
    }
}

function completeQuest() {
    const container = this.closest('.quest-container');
    delete currentQuests[container.id];
    container.remove();
}

function addQuest(questData, questName) {
    currentQuests[questName] = questData

    const images = fetchData('./data/images.json');
    Promise.all([images])
        .then(dataArray => {
            const [dataOne] = dataArray;
            displayActiveQuests(dataOne);
        })
}

function displayActiveQuests(images) {
    const questGrid = document.getElementById('quest-grid');

    questGrid.innerHTML = '';
    Object.keys(currentQuests).forEach(questName => {
        const questData = currentQuests[questName]
        const questContainer = document.createElement('div');
        questContainer.classList.add('quest-container');
        questContainer.id = questName;

        // Left column for quest items
        const itemsColumn = document.createElement('div');
        itemsColumn.classList.add('columnItems');
        questData.itemsNeeded.forEach(item => {
            const itemElement = document.createElement('img');
            const image = `./images/${images[item]}.png`
            itemElement.src = image;
            itemElement.classList.add('item')
            itemElement.addEventListener('click', toggleHighlight);
            itemsColumn.appendChild(itemElement);
        });

        // Right column for quest rewards
        const rewardsColumn = document.createElement('div');
        rewardsColumn.classList.add('column');
        questData.rewards.forEach(reward => {
            const rewardElement = document.createElement('img');
            const image = `./images/${images[reward]}.png`
            rewardElement.src = image;
            rewardsColumn.appendChild(rewardElement);
        });

        // Complete Column to complete quest rewards
        const completeColumn = document.createElement('div');
        completeColumn.classList.add('column');
        const textBox = document.createElement('div');
        textBox.className = 'completeBox';
        textBox.textContent = 'Complete';
        textBox.addEventListener('click', completeQuest);
        completeColumn.appendChild(textBox);

        questContainer.appendChild(itemsColumn);
        questContainer.appendChild(rewardsColumn);
        questContainer.appendChild(completeColumn);

        questGrid.appendChild(questContainer);
    });
}

function fetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    reject(new Error(`Failed to fetch data from ${url}: ${xhr.status}`));
                }
            }
        };
        xhr.send();
    });
}
