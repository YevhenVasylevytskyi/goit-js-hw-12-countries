var debounce = require('lodash.debounce');
import createList from './templates/list.hbs';
import createCountry from './templates/country.hbs';
import { success, notice, error } from '@pnotify/core';


const refs = {
    input: document.querySelector('[data-atribute="input"]'),
    countriesList: document.querySelector('[data-atribute="countries"]'),
};

refs.input.addEventListener('input', debounce(fetchCountries, 500));

function fetchCountries(searchQuery) {
    const inputCountry = searchQuery.target.value;
    refs.countriesList.innerHTML = '';
    // console.log(inputCountry);

    fetch(`https://restcountries.eu/rest/v2/name/${inputCountry}`)
        .then((response) => {
            if (!response.ok) {
                error({ text: `Country named ${refs.input} does not exist` });
                refs.countriesList.innerHTML = '';
                return;
            };
            return response.json();
        })
        .then((countries) => {
            if (countries.length === 1) {                
                
                oneCountry(countries);
                // console.log('1 страна');
                return;
            }

            else if (countries.length >= 2 && countries.length <= 10) {
                // console.log('От 2 до 10 стран');
                
                outCountriesList(countries);
                return;
            }
                
            else if (countries.length > 10) {
                // console.log('Больше 10 стран');
                return moreTenCountries();
            }
                
            else if (countries.length >= 2 && countries.length <= 10) {
                // console.log('От 2 до 10 стран');
                
                outCountriesList(countries);
                return;
            }        
        }).catch(err => error({
            text: err,            
        }));
}

function moreTenCountries() {
    const errorCountry = `<h4>To many matches found. Please enter a more specific query!</h4>`;
                    
                refs.countriesList.insertAdjacentHTML('afterbegin', errorCountry);
    error({
        text: 'To many matches found. Please enter a more specific query!',
    });
    // console.log('To many matches found. Please enter a more specific query!');
};

function outCountriesList(countries) {
    
    refs.countriesList.insertAdjacentHTML('afterbegin', createList(countries));

    notice({
        text: 'Уточните подробнее!!!',
    })
};

function oneCountry(countries) {    

    refs.countriesList.insertAdjacentHTML('afterbegin', createCountry(countries));

    success({
        text: 'Ура мы нашли ее!!!',
    })
};