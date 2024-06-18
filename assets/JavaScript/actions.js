let raw_food = 5;
let raw_food_max = 10;

let cooked_food = 0;
let cooked_food_max = 10;

let hygiene = 80;
let hygiene_max = 100;

let money = 1000;

let rebirth = 0;

let customers = 0;
let customers_max = 10;

let currentTask = null;

let cooking_sec = 0;
let serving_sec = 0;
let cleaning_sec = 0;

let customers_sec = 0;

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

    if(button.textContent === "Start Cooking" && currentTask === null){
        button.textContent = "Stop Cooking";
        cooking_sec += 0.1+rebirth*0.05;
        showWarningToast("amogus");
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


async function autoUpdateGifs(){
    const names = ["serving"]; // "cooking", "cleaning"
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
                } else if (value <= 0.1){
                    change.src = `./assets/gifs/${name}/${name}_very_slow.gif`;
                } else if (value <= 0.2){
                    change.src = `./assets/gifs/${name}/${name}_slow.gif`;
                } else if (value <= 0.25){
                    change.src = `./assets/gifs/${name}/${name}_medium.gif`;
                } else if (value <= 0.3){
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
            customers_sec = (30000-rebirth*2000) - hygiene * 110 * adsmult;
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

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateGUI();
    autoCustomers();
    advertisement();

    autoUpdateGifs();

    AutoCooking()
    AutoServing()
    AutoCleaning()
});
