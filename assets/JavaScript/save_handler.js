function saveData() {
    // Create object
    const gameDataToSave = {};

    // Setting vars in object
    gameDataToSave.raw_food = raw_food;
    gameDataToSave.raw_food_max = raw_food_max;
    gameDataToSave.cooked_food = cooked_food;
    gameDataToSave.cooked_food_max = cooked_food_max;
    gameDataToSave.hygiene = hygiene;
    gameDataToSave.hygiene_max = hygiene_max;
    gameDataToSave.money = money;
    gameDataToSave.rebirth = rebirth;
    gameDataToSave.customers = customers;
    gameDataToSave.customers_max = customers_max;
    gameDataToSave.upgrades = upgrades;
    gameDataToSave.workers = workers + cooking_workers + serving_workers + cleaning_workers;
    gameDataToSave.workers_max = workers_max;

    // Make data into json string for saving
    const gamedataToSaveString = JSON.stringify(gameDataToSave);

    // Set item in local storage
    localStorage.setItem("idleCookingSaveData", gamedataToSaveString);
}

function resetData() {
    gameData = {};

    gameData.raw_food = 5;
    gameData.raw_food_max = 10;
    gameData.cooked_food = 0;
    gameData.cooked_food_max = 10;
    gameData.hygiene = 80;
    gameData.hygiene_max = 100;
    gameData.money = 0;
    gameData.rebirth = 0;
    gameData.customers = 0;
    gameData.customers_max = 10;
    gameData.upgrades = 0;
    gameData.workers = 0;
    gameData.workers_max = 5;

    const gamedataToSaveString = JSON.stringify(gameData);

    localStorage.setItem("idleCookingSaveData", gamedataToSaveString);
}

window.onload = function() {
    try {
        // Load data into object from local storage
        const loadedGameData = JSON.parse(localStorage.getItem("idleCookingSaveData"));

        if (loadedGameData === null) {
            resetData();
            location.reload();
        }
    } catch (error) {
        console.log("test");
        resetData();   
        location.reload();
    }
};
