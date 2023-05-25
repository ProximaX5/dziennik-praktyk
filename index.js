// navbar hooki
const studentPage = document.querySelector('.student');
const managingPage = document.querySelector('.managing');
const summaryPage = document.querySelector('.summary');
const weatherPage = document.querySelector('.weather');
const navStudent = document.querySelector('.nav-student');
const navManaging = document.querySelector('.nav-managing');
const navSummary = document.querySelector('.nav-summary');
const navWeather = document.querySelector('.nav-weather');


// metryczka hooki
const newStudentSubpage = document.querySelector('.student-new');
const studentDataSubpage = document.querySelector('.student-data');
const formNewStudent = document.querySelector('#new-student-form');
const btnFormChangeStudentData = document.querySelector('#form-change-student-data');
const inputName = document.querySelector('#name');
const inputSurname = document.querySelector('#surname');
const inputClass = document.querySelector('#class');
const inputYear = document.querySelector('#school-year');
const inputWhere = document.querySelector('#where');
const inputDateBegin = document.querySelector('#date-begin');
const inputDateEnd = document.querySelector('#date-end');
const spanName = document.querySelector('#data--name');
const spanClass = document.querySelector('#data--class');
const spanYear = document.querySelector('#data--year');
const spanWhere = document.querySelector('#data--where');
const spanDateBegin = document.querySelector('#data--begin');
const spanDateEnd = document.querySelector('#data--end');

// dzienniczek hooki
const formNewDay = document.querySelector('#new-day-form');
const inputDate = document.querySelector('#date');
const inputSector = document.querySelector('#sector');
const inputTopic = document.querySelector('#topic');
const inputHours = document.querySelector('#hours');
const inputGrade = document.querySelector('#grade');
const inputRaport = document.querySelector('#raport');
const spanHours = document.querySelector('#hours-selected');
const spanGrade = document.querySelector('#grade-selected');

// podsumowanie hooki
const realizedTopicsSubpage = document.querySelector('.topics-realized');
const summaryTable = document.querySelector('table');
const fieldHoursAdded = document.querySelector('#hours-added');
const fieldHoursLeft = document.querySelector('#hours-left');

// pogoda hooki
const formWeather = document.querySelector('#weather-form')
const inputCity = document.querySelector('#city');
const spanCity = document.querySelector('#city-name');
const spanCountry = document.querySelector('#country-name');
const spanWind = document.querySelector('#wind');
const spanTemperature = document.querySelector('#temperature');

// inne
const apiKey = 'b2ccc49b954b01ff45bf64dadeeb4929';
const translator = new Intl.DisplayNames(['pl'], { type: 'region' });
const program = {
    hoursRequired: 160,
    sectors: [
        {
            name: 'Frontend',
            topics: [
                'Projekt strony internetowej',
                'HTML',
                'Style CSS',
                'JavaScript',
            ]
        },
        {
            name: 'Backend',
            topics: [
                'Tworzenie bazy danych',
                'Administrowanie bazą danych',
                'PHP',
                'Node JS',
                'Express.js',
            ]
        },
        {
            name: 'Inne',
            topics: [
                'Grafika rastrowa',
                'Grafika wektorowa',
                'Testowanie aplikacji',
                'Konfiguracja środowiska',
                'Instalacja oprogramowania',
                'Serwis urządzeń'
            ]
        },
    ]
};

const disableAllPages = () => {
    studentPage.classList.add('disabled');
    managingPage.classList.add('disabled');
    summaryPage.classList.add('disabled');
    weatherPage.classList.add('disabled');
};

const enableSubpage = page => {
    page.classList.remove('disabled');
};

const disableSubpage = page => {
    page.classList.add('disabled');
};

const getWeather = (city = 'Gliwice') => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const temp = data.main.temp;
        const wind = data.wind.speed;

        spanTemperature.innerText = `${Math.round(parseInt(temp))}°C`;
        spanWind.innerText = `${wind} km/h`;
        spanCity.innerText = city;
        spanCountry.innerText = translator.of(data.sys.country);
    });
}

const printData = () => {
    spanName.innerText = `${localStorage.getItem('name')} ${localStorage.getItem('surname')}`;
    spanClass.innerText = localStorage.getItem('class');
    spanYear.innerText = localStorage.getItem('years');
    spanWhere.innerText = localStorage.getItem('where');
    spanDateBegin.innerText = localStorage.getItem('beginDate');
    spanDateEnd.innerText = localStorage.getItem('endDate');
};

const printLessons = () => {
    let html = '';

    if(localStorage.getItem('lessons')){
        const topicDivs = JSON.parse(localStorage.getItem('lessons')).map(element => {
            return `
                <div class="topic">
                    <h2 class="topic-title custom-text">${element.topic}</h2>
                    <div class="topic-sector">Dział: <span class="custom-text">${element.sector}</span></div>
                    <div class="topic-date">Data: <span class="custom-text">${element.date}</span></div>
                    <div class="topic-hours">Zrealizowane godziny: <span class="custom-text">${element.hours}h</span></div>
                    <div class="topic-raport">Sprawozdanie: <span class="custom-text">${element.raport}</span></div>
                    <div class="topic-grade">Ocena: <span class="custom-text">${element.grade}</span></div>
                </div>
            `
        })

        topicDivs.forEach(div => html += div);
    }

    realizedTopicsSubpage.innerHTML = html;
}

const printSummary = () => {
    let hoursInTotal = 0;
    let html = `
        <tr>
            <th>Nazwa działu</th>
            <th>Godziny zrealizowane</th>
        </tr>
    `;

    const rows = program.sectors.map(element => {
        let hoursOf = 0;
        if(localStorage.getItem('lessons')){
            hoursOf = JSON.parse(localStorage.getItem('lessons'))
            .filter(lesson => lesson.sector == element.name)
            .reduce((accumulator, current) => accumulator + parseInt(current.hours), 0);
        }
        else{
            hoursOf = 0;
        }
        
        hoursInTotal += hoursOf;
        return `
            <tr>
                <td>${element.name}</td>
                <td>${hoursOf}</td>
            </tr>
        `;
    });

    rows.forEach(row => html += row);
    html += `
        <tr>
            <td class="bold">RAZEM</td>
            <td id="hours-added">${hoursInTotal}</td>
        </tr>
        <tr>
            <td class="bold">POZOSTAŁO DO ZREALIZOWANIA</td>
            <td id="hours-left">${program.hoursRequired - hoursInTotal}</td>
        </tr>
    `

    summaryTable.innerHTML = html;
}

const insertSectorOptions = () => {
    inputSector.innerHTML = '<option></option>';
    program.sectors.forEach(value => {
        const optionHTML = `
            <option value="${value.name}">${value.name}</option>
        `;
        inputSector.insertAdjacentHTML('beforeend', optionHTML);
    })
};


navStudent.addEventListener('click', () => {
    disableAllPages();
    studentPage.classList.remove('disabled');
});

navManaging.addEventListener('click', () => {
    disableAllPages();
    managingPage.classList.remove('disabled');
});

navSummary.addEventListener('click', () => {
    disableAllPages();
    summaryPage.classList.remove('disabled');
});

navWeather.addEventListener('click', () => {
    disableAllPages();
    weatherPage.classList.remove('disabled');
});

formWeather.addEventListener('submit', (e) => {
    e.preventDefault();
    getWeather(inputCity.value);
});

formNewStudent.addEventListener('submit', (e) => {
    e.preventDefault();

    localStorage.setItem('name', inputName.value);
    localStorage.setItem('surname', inputSurname.value);
    localStorage.setItem('class', inputClass.value);
    localStorage.setItem('years', inputYear.value);
    localStorage.setItem('where', inputWhere.value);
    localStorage.setItem('beginDate', inputDateBegin.value);
    localStorage.setItem('endDate', inputDateEnd.value);

    printData();
    enableSubpage(studentDataSubpage);
    disableSubpage(newStudentSubpage);
});

btnFormChangeStudentData.addEventListener('click', () => {
    inputName.value = localStorage.getItem('name');
    inputSurname.value = localStorage.getItem('surname');
    inputClass.value = localStorage.getItem('class');
    inputYear.value = localStorage.getItem('years');
    inputWhere.value = localStorage.getItem('where');
    inputDateBegin.value = localStorage.getItem('beginDate');
    inputDateEnd.value = localStorage.getItem('endDate');

    disableSubpage(studentDataSubpage);
    enableSubpage(newStudentSubpage);
});

formNewDay.addEventListener('submit', e => {
    e.preventDefault();

    const lesson = {
        date: inputDate.value,
        sector: inputSector.options[inputSector.selectedIndex].text,
        topic: inputTopic.options[inputTopic.selectedIndex].text,
        raport: inputRaport.value,
        hours: inputGrade.value,
        grade: inputGrade.value
    }

    if(localStorage.getItem('lessons')){
        const lessonsArr = JSON.parse(localStorage.getItem('lessons'));
        lessonsArr.push(lesson);
        localStorage.setItem('lessons', JSON.stringify(lessonsArr));
    }
    else{
        localStorage.setItem('lessons', JSON.stringify([lesson]));
    }

    printLessons();
    printSummary();
})

inputSector.addEventListener('change', () => { // zaaktualizowanie wyboru tematu na podstawie wybranego działu
    inputTopic.removeAttribute('disabled');
    const selectedSector = inputSector.options[inputSector.selectedIndex].text;
    const [ sectorObjectSelected ] = program.sectors.filter(opt => opt.name === selectedSector);
    inputTopic.innerHTML = '';
    sectorObjectSelected.topics.forEach(value => {
        const optionHTML = `
            <option value="${value}">${value}</option>
        `;
        inputTopic.insertAdjacentHTML('beforeend', optionHTML);
    });
});

inputHours.addEventListener('change', () => {
    spanHours.innerText = inputHours.value + 'h';
})

inputGrade.addEventListener('change', () => {
    spanGrade.innerText = inputGrade.value;
})

window.onload = () => {
    getWeather();
    insertSectorOptions();
    printSummary();
    printLessons();

    if(localStorage.getItem('name') != null){
        printData();
        disableSubpage(newStudentSubpage);
        enableSubpage(studentDataSubpage);
    }
}

console.log(localStorage)
