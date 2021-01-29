const daysButton = document.getElementById('daysBtn');
const typeButton = document.getElementById('typeBtn');

const daysOpts = document.querySelectorAll('.daysOptions');
const typeOpts = document.querySelectorAll('.typeOptions');

const casesChart = document.getElementById("casesChart").getContext("2d");
const deathsChart = document.getElementById("deathsChart").getContext("2d");
const recoveredChart = document.getElementById("recoveredChart").getContext("2d");

daysOpts.forEach((day)=>{
    day.addEventListener('click',()=>{
        daysButton.innerHTML = day.innerHTML;
        user.days = parseInt(day.innerHTML.slice(0,2))+1;
        console.log(user.days);
        init();
    })
})

typeOpts.forEach((type) => {
    type.addEventListener('click', () => {
        typeButton.innerHTML = type.innerHTML;
        user.type = type.innerHTML;
        console.log(user.type);
        init();
    })
})
