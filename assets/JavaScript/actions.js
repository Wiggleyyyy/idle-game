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

function updateGUI() {
    try {
        document.getElementById('customers_value').textContent = customers + " / " + customers_max;
        document.getElementById('money_value').textContent = money + "$";
        document.getElementById('raw_food_value').textContent = raw_food + " / " + raw_food_max;
        document.getElementById('cooked_food_value').textContent = cooked_food + " / " + cooked_food_max;
        document.getElementById('hygiene_value').textContent = hygiene + "%";
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
            performAction: () => { raw_food--; cooked_food++; }
        },
        serving: {
            buttonId: 'serving_button',
            progressId: 'serving_progress',
            startText: 'Start Serving',
            stopText: 'Stop Serving',
            checkCondition: () => cooked_food > 0,
            performAction: () => { cooked_food--; money += 10; }
        },
        cleaning: {
            buttonId: 'cleaning_button',
            progressId: 'cleaning_progress',
            startText: 'Start Cleaning',
            stopText: 'Stop Cleaning',
            checkCondition: () => hygiene < hygiene_max,
            performAction: () => { hygiene += 10; }
        }
    };

    const details = taskDetails[task];
    const button = document.getElementById(details.buttonId);
    const progressElement = document.getElementById(details.progressId);

    if (button.textContent === details.startText) {
        if (!details.checkCondition()) {
            alert(`Not enough resources or max capacity to start ${task}!`);
            return;
        }

        clearCurrentTask();

        button.textContent = details.stopText;
        let time = 0;

        currentTask = {
            interval: setInterval(() => {
                if (time < 100) {
                    time += 10;
                    progressElement.value = time;
                    if (button.id === "cooking_button"){
                        hygiene--;
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
            }, 1000),
            buttonId: details.buttonId,
            progressId: details.progressId,
            startText: details.startText,
            stopText: details.stopText
        };
    } else {
        clearCurrentTask();
    }
}

function autoCustomers() {
    setInterval(() => {
        if (customers < customers_max) {
            customers++;
            updateGUI();
        }
    }, 20000-hygiene*90);
}

function buyRawfood(){
    if (money >= 2 && raw_food < raw_food_max){
        raw_food++;
        money -= 2;
        updateGUI()
    }
    else{
        alert(`Not enough money or max capacity!`)
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateGUI();
    autoCustomers();
});
