let workers = 0;
let workers_max = 5;

let cooking_workers = 0;
let serving_workers = 0;
let cleaning_workers = 0;

let ads = 0;
let adsmult = 1;

function workerBuy(){
    let totalworkers = workers+cooking_workers+serving_workers+cleaning_workers;
    let price = (totalworkers+1)*100;
    if (money >= price && totalworkers < workers_max){
        money -= price;
        workers++;
        updateGUI()
        showSuccessToast("Successfully bought worker");
    }
    else{
        showErrorToast("Not enough money or max workers");
    }
    
}

function workerAdd(task) {
    if(workers > 0){
        switch(task) {
            case 'cooking':
              cooking_workers++;
                break;
            case 'serving':
              serving_workers++;
                break;
            case 'cleaning':
                cleaning_workers++;
                break;
        }
        workers--;
        updateGUI()
    }
    else{
        showErrorToast("You dont have a free worker");
    }

}

function workerRemove(task) {
    
    switch(task) {
        case 'cooking':
            if (cooking_workers > 0){
                cooking_workers--;
                workers++;
            }
            else{
                showErrorToast("You dont have any workers to remove");
            }
            break;
        case 'serving':
            if (serving_workers > 0){
                serving_workers--;
                workers++;
            }
            else{
                showErrorToast("You dont have any workers to remove");
            }
            break;
        case 'cleaning':
            if (cleaning_workers > 0){
                cleaning_workers--;
                workers++;
            }
            else{
                showErrorToast("You dont have any workers to remove");
            }
            break;
    }
    updateGUI();

}

function buyRawfood(){
    if (money >= 2 && raw_food < raw_food_max){
        raw_food++;
        money -= 2;
        updateGUI()
        showSuccessToast("Successfully bought Raw Food");
    }
    else{
        showErrorToast("Not enough money or max capacity!");
    }
}

function workersDoStuff(){
    setInterval(() => {
        for (let i = 0; i < cooking_workers; i++) {
            if(raw_food >= 1/15 && cooked_food < cooked_food_max){
                raw_food -= 1/15;
                cooked_food += 1/15;
                hygiene -= 10/15;
                if (hygiene < 0){
                    hygiene = 0;
                }
            }
        }

        for (let i = 0; i < serving_workers; i++) {
            if(cooked_food >= 1/15){
                cooked_food -= 1/15;
                money += 10/15;
            }
        }

        for (let i = 0; i < cleaning_workers; i++) {
            if(hygiene < hygiene_max){
                hygiene += 10 / 15;
                if(hygiene > 100){
                    hygiene = 100;
                }
            }
        }
        updateGUI()
    }, 1000);
}

function advertisement(){
    setInterval(() => {
        if(ads > 0){
            ads--;
            adsmult = 1.5;
            document.getElementById('adds_stats').textContent = "Time remaining: "+ formatSeconds(ads); 
        }
        else{
            adsmult = 1;
        }
    }, 1000);
}

function formatSeconds(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }

    return minutes + ':' + remainingSeconds;
}

function adsAdd(seconds) {
    
    switch(seconds) {
        case 10:
            if (money >= 250){
                money -= 250;
                ads += 10;
                showSuccessToast("Successfully bought 10 seconds of advertisement");
            }
            else{
                showErrorToast("You don't have enough money");
            }
            break;
        case 30:
            if (money >= 750){
                money -= 750;
                ads += 30;
                showSuccessToast("Successfully bought 30 seconds of advertisement");
            }
            else{
                showErrorToast("You don't have enough money");
            }
            break;
        case 60:
            if (money >= 1500){
                money -= 1500;
                ads += 60;
                showSuccessToast("Successfully bought 1 minute of advertisement");
            }
            else{
                showErrorToast("You don't have enough money");
            }
            break;
    }
    updateGUI();
    document.getElementById('adds_stats').textContent = "Time remaining: "+ formatSeconds(ads); 
}