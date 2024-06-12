let raw_food = 5;
let raw_food_max = 10;

let cooked_food = 0;
let cooked_food_max = 10;

let hygiene = 80;
let hygiene_max = 100;

let money = 0;

let customers = 0;
let customers_max = 10;

let currentTask = null;
let currentTask_ForGUI = null;

function updateGUI() {
    try {
        if(raw_food < 0){
            raw_food = 0;
        }
        if (cooked_food < 0){
            cooked_food = 0;
        }

        document.getElementById('customers_value').textContent = customers.toFixed(0) + " / " + customers_max;
        document.getElementById('money_value').textContent = money.toFixed(2) + "$";
        document.getElementById('raw_food_value').textContent = raw_food.toFixed(2) + " / " + raw_food_max;
        document.getElementById('cooked_food_value').textContent = cooked_food.toFixed(2) + " / " + cooked_food_max;
        document.getElementById('hygiene_value').textContent = hygiene.toFixed(2) + "%";
        document.getElementById('worker_stats').textContent = workers+ " / "+ workers_max;
        document.getElementById('cooking_workers_label').textContent = ` ${cooking_workers}`;
        document.getElementById('serving_workers_label').textContent = serving_workers;
        document.getElementById('cleaning_workers_label').textContent = cleaning_workers; 

        document.getElementById('cooking_persec').textContent = (1 * cooking_workers / 15).toFixed(2)+" Cooked Food/sec";
        document.getElementById('serving_persec').textContent = (10*serving_workers/15).toFixed(2)+" $/sec";
        document.getElementById('cleaning_persec').textContent = (10*cleaning_workers/15).toFixed(2)+" Hygiene/sec"; 

        switch(currentTask_ForGUI){
            case "cooking":
                        document.getElementById('cooking_persec').textContent = (1 * cooking_workers / 15+0.1).toFixed(2)+" Cooked Food/sec";
                break;
            case "serving":
                        document.getElementById('serving_persec').textContent = (10*serving_workers/15+1).toFixed(2)+" $/sec";
                break;
            case "cleaning":
                        document.getElementById('cleaning_persec').textContent = (10*cleaning_workers/15+1).toFixed(2)+" Hygiene/sec"; 
                break;
        }

        let price = (workers+cooking_workers+serving_workers+cleaning_workers+1)*50;
        document.getElementById('hire_button').textContent = `Hire new worker (${price}$)`;
    } catch (error) {
        console.log(error);
    }
}

function clearCurrentTask() {
    if (currentTask) {
        clearInterval(currentTask.interval);
        document.getElementById(currentTask.buttonId).textContent = currentTask.startText;
        document.getElementById(currentTask.progressId).value = 0;
        currentTask = null;
        currentTask_ForGUI = null;
        updateGUI();
    }
}

function startTask(task) {
    const taskDetails = {
        cooking: {
            buttonId: 'cooking_button',
            progressId: 'cooking_progress',
            startText: 'Start Cooking',
            stopText: 'Stop Cooking',
            checkCondition: () => raw_food > 0 && cooked_food < cooked_food_max,
            performAction: () => { raw_food -= 0.1; cooked_food += 0.1; }
        },
        serving: {
            buttonId: 'serving_button',
            progressId: 'serving_progress',
            startText: 'Start Serving',
            stopText: 'Stop Serving',
            checkCondition: () => cooked_food > 0 && customers > 0,
            performAction: () => { cooked_food -= 0.1; money += 1; customers -= 0.1;}
        },
        cleaning: {
            buttonId: 'cleaning_button',
            progressId: 'cleaning_progress',
            startText: 'Start Cleaning',
            stopText: 'Stop Cleaning',
            checkCondition: () => hygiene < hygiene_max,
            performAction: () => { hygiene += 1; }
        }
    };

    const details = taskDetails[task];
    const button = document.getElementById(details.buttonId);
    const progressElement = document.getElementById(details.progressId);

    if (button.textContent === details.startText) {
        if (!details.checkCondition()) {
            showErrorToast(`Not enough resources or max capacity to start ${task}!`);
            return;
        }

        clearCurrentTask();

        currentTask_ForGUI = task;

        button.textContent = details.stopText;
        let time = 0;

        currentTask = {
            interval: setInterval(() => {
                if (time < 100) {
                    time += 10;
                    progressElement.value = time;
                    if (button.id === "cooking_button"){
                        hygiene -= 0.1;
                        if (hygiene < 0){
                            hygiene = 0
                        }
                        updateGUI();
                    }
                } else {
                    time = 0;
                    progressElement.value = time;
                    details.performAction();
                    updateGUI();

                    if (!details.checkCondition()) {
                        clearCurrentTask();
                    }
                }
            }, 100),
            buttonId: details.buttonId,
            progressId: details.progressId,
            startText: details.startText,
            stopText: details.stopText
        };
    } else {
        clearCurrentTask();
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
        await wait(30000 - hygiene * 90 * adsmult);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateGUI();
    autoCustomers();
    workersDoStuff();
    advertisement();
});
