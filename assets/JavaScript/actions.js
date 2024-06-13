let raw_food = 5;
let raw_food_max = 10;

let cooked_food = 0;
let cooked_food_max = 10;

let hygiene = 80;
let hygiene_max = 100;

let money = 0;

let customers = 0;
let customers_max = 10;

let currentTask = false;

let cooking_sec = 0;
let serving_sec = 0;
let cleaning_sec = 0;

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
        document.getElementById('cleaning_persec').textContent = cleaning_sec.toFixed(2)+" Hygiene/sec"; 

        

        let price = (workers+cooking_workers+serving_workers+cleaning_workers+1)*50;
        document.getElementById('hire_button').textContent = `Hire new worker ($${price})`;
    } catch (error) {
        console.log(error);
    }
}

function cooking_secAddAndRemove(){
    const button = document.getElementById("cooking_button");

    if(button.textContent === "Start Cooking" && !currentTask){
        button.textContent = "Stop Cooking";
        cooking_sec += 0.1;
        currentTask = true;
    }
    else if (button.textContent === "Stop Cooking"){
        button.textContent = "Start Cooking";
        cooking_sec -= 0.1;
        currentTask = false;
    }

    updateGUI();
}
function serving_secAddAndRemove(){
    const button = document.getElementById("serving_button");

    if(button.textContent === "Start Serving" && !currentTask){
        button.textContent = "Stop Serving";
        serving_sec += 0.1;
        currentTask = true;
    }
    else if (button.textContent === "Stop Serving"){
        button.textContent = "Start Serving";
        serving_sec -= 0.1;
        currentTask = false;
    }

    updateGUI();
}
function cleaning_secAddAndRemove(){
    const button = document.getElementById("Cleaning_button");

    if(button.textContent === "Start Cleaning" && !currentTask){
        button.textContent = "Stop Cleaning";
        cleaning_sec += 0.1;
        currentTask = true;
    }
    else if (button.textContent === "Stop Cleaning"){
        button.textContent = "Start Cleaning";
        cleaning_sec -= 0.1;
        currentTask = false;
    }

    updateGUI();
}

function overwriteClick(id) {
    switch (id)
    {
        case 0:
            serving_secAddAndRemove();
            cleaning_secAddAndRemove();
            break;
        case 1:
            cooking_secAddAndRemove();
            cleaning_secAddAndRemove();
            break;
        case 2:
            cooking_secAddAndRemove();
            serving_secAddAndRemove();
            break;
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
                    money += 10;
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
                    hygiene++;
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

async function autoCustomers() {
    while (true) {
        if (customers < customers_max) {
            customers++;
            updateGUI();
        }
        if(customers > customers_max){
            customers = customers_max;
        }
        await wait(30000 - hygiene * 110 * adsmult);
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateGUI();
    autoCustomers();
    advertisement();

    AutoCooking()
    AutoServing()
    AutoCleaning()
});
