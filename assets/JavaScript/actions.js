var gameData = JSON.parse(localStorage.getItem("idleCookingSaveData"));

let raw_food = gameData.raw_food;
let raw_food_max = gameData.raw_food_max;

let cooked_food = gameData.cooked_food;
let cooked_food_max = gameData.cooked_food_max;

let hygiene = gameData.hygiene;
let hygiene_max = gameData.hygiene_max;

let money = gameData.money;

let rebirth = gameData.rebirth;

let customers = gameData.customers;
let customers_max = gameData.customers_max;

let currentTask = null;

let cooking_sec = 0;
let serving_sec = 0;
let cleaning_sec = 0;

let customers_sec = 0;

let curretEvent = null;
let eventTimeRemaining = 0;
let eventMoneyMuti = 1;
let eventCustomersMulti = 1;

let upgrades = gameData.upgrades;  

var serveIsShown = false;
var cleanIsShown = false;
var managementIsShown = false;
var rawFoodQuantityBuyIsShown = false;
var workersIsShown = false;
var adsIsShown = false;

function updateGUI() {
    try {

        document.getElementById('customers_value').textContent = customers + " / " + customers_max;
        document.getElementById('money_value').textContent =  "$" + money;
        document.getElementById('raw_food_value').textContent = raw_food + " / " + raw_food_max;
        document.getElementById('cooked_food_value').textContent = cooked_food + " / " + cooked_food_max;
        document.getElementById('hygiene_value').textContent = hygiene + "%";
        document.getElementById('worker_stats').textContent = `${workers+cooking_workers+serving_workers+cleaning_workers} (${workers}) / ${workers_max}`;
        document.getElementById('cooking_workers_label').textContent = ` ${cooking_workers}`;
        document.getElementById('serving_workers_label').textContent = serving_workers;
        document.getElementById('cleaning_workers_label').textContent = cleaning_workers; 
        document.getElementById('buy_worker_capacity').textContent = "+1 ($" + (workers_max+1)*75 + ")";



        document.getElementById('cooking_persec').textContent = cooking_sec.toFixed(2)+" Cooked Food/sec";
        document.getElementById('serving_persec').textContent = "$"+(serving_sec*10).toFixed(2)+" /sec";
        document.getElementById('cleaning_persec').textContent = (cleaning_sec*10).toFixed(2)+" Hygiene/sec";

        let price = (workers+cooking_workers+serving_workers+cleaning_workers+1)*50;
        document.getElementById('hire_button').textContent = `Hire new worker ($${price})`;

        document.getElementById('upgrades_counter').textContent = upgrades+"/10";

        document.getElementById('rebirth_button').textContent = "$"+1000*(rebirth+1);
    } catch (error) {
        console.log(error);
    }

    // Show elements
    if (cooked_food > 0 & serveIsShown === false) {
        serveIsShown = true;
    }
    if (hygiene <= 20 & cleanIsShown === false) {
        cleanIsShown = true;
    }
    if (raw_food >= 2 & managementIsShown === false) {
        managementIsShown = true;
    }

    showElements();

    saveData();
}

function showElements() {
    if (serveIsShown === true){
        document.getElementById("serving_card_wrapper").className = "card_wrapper";
    }
    if (cleanIsShown === true) {
        document.getElementById("cleaning_card_wrapper").className = "card_wrapper";
    }
    if (managementIsShown === true) {
        document.getElementById("management_card").className = "";
        document.getElementById("management_card_wrapper").className = "card_wrapper_large";
    }
    if (rawFoodQuantityBuyIsShown === true) {
        document.getElementById("management_food_1").className = "hide";
        document.getElementById("management_food_2").className = "management_food_2";
    }
    if (workersIsShown === true) {
        document.getElementById("workers_upgrade").className = "workers_upgrade";
    }
    if (adsIsShown === true) {
        document.getElementById("adds_upgrade").className = "adds_upgrade";
    }
    return;
}

function researchBuy(research, price, id){
    if(money >= price){
        money -= price;
        document.getElementById(id).className = "hide";
        upgrades++;
        switch(research){
            case "unlock_workers":
                workersIsShown = true;
                break;
            case "workers_cooking":
                break;
            case "workers_serving":
                break;
            case "workers_cleaning":
                break;
            case "storage_raw_food":
                break;
            case "storage_cooked_food":
                break;
            case "storage_customers":
                break;
            case "raw_food_buy_upgrade":
                rawFoodQuantityBuyIsShown = true;
                break;
            case "advertisement_unlock":
                adsIsShown = true;
                break;
            case "events_upgrade":
                break;
        }
    }
    else{
        showErrorToast("You dont have enough money");
    }
}

function cooking_secAddAndRemove(){
    const button = document.getElementById("cooking_button");

    if(button.textContent === "Start Cooking" && currentTask === null){
        button.textContent = "Stop Cooking";
        cooking_sec += 0.1+rebirth*0.05;
        currentTask = "cooking_button";
    }
    else if (button.textContent === "Stop Cooking"){
        button.textContent = "Start Cooking";
        cooking_sec -= 0.1+rebirth*0.05;
        currentTask = null;
    }

    updateGUI();
}

function serving_secAddAndRemove(){
    const button = document.getElementById("serving_button");

    if(button.textContent === "Start Serving" && currentTask === null){
        button.textContent = "Stop Serving";
        serving_sec += 0.1+rebirth*0.05;
        currentTask = "serving_button";
    }
    else if (button.textContent === "Stop Serving"){
        button.textContent = "Start Serving";
        serving_sec -= 0.1+rebirth*0.05;
        currentTask = null;
    }

    updateGUI();
}
function cleaning_secAddAndRemove(){
    const button = document.getElementById("cleaning_button");

    if(button.textContent === "Start Cleaning" && currentTask === null){
        button.textContent = "Stop Cleaning";
        cleaning_sec += 0.1+rebirth*0.05;
        currentTask = "cleaning_button";
    }
    else if (button.textContent === "Stop Cleaning"){
        button.textContent = "Start Cleaning";
        cleaning_sec -= 0.1+rebirth*0.05;
        currentTask = null;
    }

    updateGUI();
}

function nextRebirth(){
    if(money >= 1000*(rebirth+1) ){
        
    }
    else{
        showErrorToast("Not enough money or max capacity!");
    }
}

async function AutoCooking() {
    let interval = (1 / cooking_sec * 1000) / 10;
    let progress = 0;

    while (true) {
        const progressElement = document.getElementById("cooking_progress");

        while (progress <= 10) {
            if (cooking_sec.toFixed(2) <= 0.04) {
                break;
            } else {
                interval = (1 / cooking_sec * 1000) / 10;
            }

            progressElement.value = progress * 10;

            if (progress !== 10) {
                hygiene--;
                if (hygiene < 0) {
                    hygiene = 0;
                }
            }

            updateGUI();

            if (progress === 10) {
                if (raw_food >= 1 && cooked_food < cooked_food_max) {
                    raw_food--;
                    cooked_food++;
                    progress = 0;
                    progressElement.value = progress * 10;
                }
                break;
            }

            await wait(interval);
            progress++;
        }

        await wait(100);
    }
}

async function AutoServing() {
    let interval = (1 / serving_sec * 1000) / 10;
    let progress = 0;

    while (true) {
        const progressElement = document.getElementById("serving_progress");

        while (progress <= 10) {
            if (serving_sec.toFixed(2) <= 0.04) {
                break;
            } else {
                interval = (1 / serving_sec * 1000) / 10;
            }

            progressElement.value = progress * 10;

            updateGUI();

            if (progress === 10) {
                if (cooked_food >= 1 && customers >= 1) {
                    cooked_food--;
                    customers--;
                    money += 10 * eventMoneyMuti;
                    progress = 0;
                    progressElement.value = progress * 10;
                }
                break;
            }

            await wait(interval);
            progress++;
        }

        await wait(100);
    }
}

async function AutoCleaning() {
    let interval = (1 / cleaning_sec * 1000) / 10;
    let progress = 0;

    while (true) {
        const progressElement = document.getElementById("cleaning_progress");

        while (progress <= 10) {
            if (cleaning_sec.toFixed(2) <= 0.04) {
                break;
            } else {
                interval = (1 / cleaning_sec * 1000) / 10;
            }

            progressElement.value = progress * 10;

            updateGUI();

            if (progress === 10) {
                if (hygiene < hygiene_max) {
                    hygiene += 10;
                    if(hygiene > hygiene_max){
                        hygiene = hygiene_max;
                    }
                    progress = 0;
                    progressElement.value = progress * 10;
                }
                break;
            }

            await wait(interval);
            progress++;
        }

        await wait(100);
    }
}


async function autoUpdateGifs(){
    const names = ["cooking", "serving"]; //"cleaning"
    cooking_sec_temp = 0;
    serving_sec_temp = 0;
    cleaning_sec_temp = 0;
    try{
    while(true){
        for (const name of names) {
            let value = 0;
            let compareValue = 0;
            let change = document.getElementById(`${name}_gif`);
            switch(name){
                case "cooking":
                    value = cooking_sec;
                    compareValue = cooking_sec_temp;
                    break;
                case "serving":
                    value = serving_sec;
                    compareValue = serving_sec_temp;
                    break;
                case "cleaning":
                    value = cleaning_sec;
                    compareValue = cleaning_sec_temp;
                    break;
            }
            if(value != compareValue){
                switch(name){
                    case "cooking":
                        cooking_sec_temp = value;
                        break;
                    case "serving":
                        serving_sec_temp = value;
                        break;
                    case "cleaning":
                        cleaning_sec_temp = value;
                        break;
                }
                if(value < 0.04){
                    change.src = `./assets/gifs/${name}/${name}.png`;
                } else if (value <= 0.25){
                    change.src = `./assets/gifs/${name}/${name}_very_slow.gif`;
                } else if (value <= 0.5){
                    change.src = `./assets/gifs/${name}/${name}_slow.gif`;
                } else if (value <= 1){
                    change.src = `./assets/gifs/${name}/${name}_medium.gif`;
                } else if (value <= 5){
                    change.src = `./assets/gifs/${name}/${name}_fast.gif`;
                } else{
                    change.src = `./assets/gifs/${name}/${name}_very_fast.gif`;
                }
            }
        }
        await wait(1000);
    }
    }
    catch(error){
        console.log(error);
    }
}


async function autoCustomers() {
    try{
        while (true) {
            if (customers < customers_max) {
                customers++;
            }
            if(customers > customers_max){
                customers = customers_max;
            }
            customers_sec = Math.round(35000*(1-(hygiene/100+adsmult/2.5+eventCustomersMulti/2+rebirth/100)/5));
            for (let progress = customers_sec/100; progress > 0; progress--) {
                customers_sec -= 100;
                if(customers_sec < 0){
                    customers_sec = 0;
                }
                document.getElementById("customers_time").textContent = customers_sec/1000+" Sec";
                await wait(100);
            }
            updateGUI();
        }
        
    }
    catch (error){
        console.log(error);
    }
}

async function autoEvents() {
    document.getElementById('event_info').textContent = "";
    document.getElementById('event_timer').textContent = formatSeconds(0); 
    document.getElementById('event_title').textContent = "";
    while (true) {
        let max = 20; // 10
        let randomInt = Math.floor(Math.random() * max);
        if(randomInt == 0){
            max = 5;
            randomInt = Math.floor(Math.random() * max);
            let description = "None";
            let titel = "None";
            switch(randomInt){
                case 0:
                    titel = "Rush hour";
                    description = "Its rush hour so you get more customers into your restaurant.";
                    eventTimeRemaining = 60;
                    eventCustomersMulti = 2;
                    break;
                case 1:
                    titel = "Health Inspection";
                    description = "Theres a Health Inspection, so if you dont have above 50% hygiene at the end of the event you get a fine.";
                    eventTimeRemaining = 20;
                    break;
                case 2:
                    titel = "Donation";
                    description = "A person has come and given you a donation.";
                    eventTimeRemaining = 10;
                    money += 100;
                    break;
                case 3:
                    titel = "Happy Hour";
                    description = "People are more happy so you get a little extra cash after giving people their food.";
                    eventTimeRemaining = 60;
                    eventMoneyMuti = 1.5;
                    break;
                case 4:
                    titel = "Celebrity Appearance";
                    description = "A celebrity has gone into your resturant and therefore give you 1 minute of free advertisement";
                    eventTimeRemaining = 60;
                    ads += 60;
                    break;
            }

            updateGUI();
            document.getElementById('event_info').textContent = description;
            document.getElementById('event_title').textContent = titel;
            while(eventTimeRemaining > 0){
                eventTimeRemaining--;
                document.getElementById('event_timer').textContent = formatSeconds(eventTimeRemaining); 
                await wait(1000);
            }
            document.getElementById('event_info').textContent = "";
            document.getElementById('event_title').textContent = "";

            eventCustomersMulti = 1;
            eventMoneyMuti = 1;
            
            if (randomInt == 1 && hygiene < 50){
                money = money - 100;
                if(money < 0 ){
                    money = 0;
                }
            }
            updateGUI();
            await wait(10000);
        }
        else{
            await wait(10000);
        }
    }
    
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateGUI();
    autoCustomers();
    advertisement();

    autoUpdateGifs();

    autoEvents();

    AutoCooking()
    AutoServing()
    AutoCleaning()
});
