let workers = gameData.workers;
let workers_max = gameData.workers_max;

let cooking_workers = 0;
let serving_workers = 0;
let cleaning_workers = 0;

let ads = 0;
let adsmult = 1;

function workerBuy(){
    let totalworkers = workers+cooking_workers+serving_workers+cleaning_workers;
    let price = (totalworkers+1)*50;
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
                    cooking_sec += 0.05+rebirth*0.005
                break;
            case 'serving':
                    serving_workers++;
                    serving_sec += 0.05+rebirth*0.005
                break;
            case 'cleaning':
                    cleaning_workers++;
                    cleaning_sec += 0.05+rebirth*0.005
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
                cooking_sec -= 0.05+rebirth*0.005
            }
            else{
                showErrorToast("You dont have any workers to remove");
            }
            break;
        case 'serving':
            if (serving_workers > 0){
                serving_workers--;
                workers++;
                serving_sec -= 0.05+rebirth*0.005
            }
            else{
                showErrorToast("You dont have any workers to remove");
            }
            break;
        case 'cleaning':
            if (cleaning_workers > 0){
                cleaning_workers--;
                workers++;
                cleaning_sec -= 0.05+rebirth*0.005
            }
            else{
                showErrorToast("You dont have any workers to remove");
            }
            break;
    }
    updateGUI();

}

function buyRawfood(times){
    if (money >= times * 2 && raw_food+times <= raw_food_max){
        raw_food += times;
        money -= times * 2;
        updateGUI()
        showSuccessToast(`Successfully bought ${times} Raw Food`);
    }
    else{
        showErrorToast("Not enough money or max capacity!");
    }
}

function advertisement(){
    setInterval(() => {
        if(ads > 0){
            ads--;
            adsmult = 2.5;
            document.getElementById('adds_stats').textContent = formatSeconds(ads); 
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
    if(money >= 15 * seconds){
        ads += 1 * seconds;
        money -= 15 * seconds
        showSuccessToast(`Successfully bought ${seconds} seconds of advertisement`);
    }
    updateGUI();
    document.getElementById('adds_stats').textContent = formatSeconds(ads); 
}

function buyRawStorage(times) {;
    let price = 5 * times;
    if(money >= price){
        raw_food_max += times;
        money -= price;
        showSuccessToast(`Successfully bought ${times} raw storage capacity`);
    }
    updateGUI();
    document.getElementById('adds_stats').textContent = formatSeconds(ads); 
}

function buyCookedStorage(times) {
    let price = 5 * times;
    if(money >= price){
        cooked_food_max += times;
        money -= price;
        showSuccessToast(`Successfully bought ${times} cooked storage capacity`);
    }
    updateGUI();
    document.getElementById('adds_stats').textContent = formatSeconds(ads); 
}

function buyCustomerStorage(times) {
    let price = 20 * times;
    if(money >= price){
        customers_max += times;
        money -= price;
        showSuccessToast(`Successfully bought ${times} customer capacity`);
    }
    updateGUI();
    document.getElementById('adds_stats').textContent = formatSeconds(ads); 
}

function buyWorkerStorage(times) {
    let price = (workers_max+1)*75;
    if(money >= price){
        workers_max += 1;
        money -= price;
        showSuccessToast(`Successfully bought 1 worker capacity`);
    }
    updateGUI();
    document.getElementById('adds_stats').textContent = formatSeconds(ads); 
}