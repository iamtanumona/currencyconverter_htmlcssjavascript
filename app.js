const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btnEl = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const loaderEl = document.querySelector(".loaderHide");
let amountEl = document.querySelector(".amount input");


/* Default conversion rate should be showing at a first-time welcome page load i.e USD to INR */
window.addEventListener("load",() => {
    updateExchangeRate();
});

/* Converting list of countries to individual options and adding them into the select */
for(let select of dropdowns) {
    //console.log(select);
    for(let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        /* Select left:USD && Select right:INR */
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        } else if(select.name === "to" && currCode === "INR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    /* Whenever select is changing, that time we will call updateFlag function so that we can find the target where the change happened*/
    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    })
}

/* Updating country flag based on select country option */
const updateFlag = (element) => {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let imgEl = element.parentElement.querySelector("img");
    imgEl.src = newSrc;
}

/* Exchange rate conversion calculation */
const updateExchangeRate = async () => {
    let amountVal = amountEl.value;
    /* Amount value cannot be less than 1 or null */
    if (amountVal === "" || amountVal < 1){
        amountVal = 1;
        amountEl.value = "1";
    }
    /* Whenever we send a request to the below URL then we will get our exchange rate */
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    /* Detching data from this response */
    let data = await response.json();
    /* First we need to fetch the JSON for fromCurr and then extract the rate for toCurr from that data */
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmount = amountVal * rate;
    msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    loaderEl.classList.add("loaderHide");
}

/* Call exchange rate conversion function after button click*/
btnEl.addEventListener("click",(evt) => {
    /* To prevent default functionalities after form button submission */
    evt.preventDefault(); 
    loaderEl.classList.remove("loaderHide");
    loaderEl.classList.add("loader");
    fromCurr.disabled = true;
    toCurr.disabled = true;
    btnEl.disabled = true;
    amountEl.disabled = true;
    setTimeout(() => {
        updateExchangeRate();
        fromCurr.disabled = false;
        toCurr.disabled = false;
        btnEl.disabled = false;
        amountEl.disabled = false;
    },3000);
});
