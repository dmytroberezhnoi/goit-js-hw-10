import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEL = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const countryCardEl = document.querySelector('.country-info');

inputEL.addEventListener('input', debounce(handleCountryForm, DEBOUNCE_DELAY));

function handleCountryForm(event) {
  const seekedCity = inputEL.value.trim();
  //   console.log(seekedCity);

  if (seekedCity === '') {
    ulEl.innerHTML = '';
    countryCardEl.innerHTML = '';
    return;
  }

  fetchCountries(seekedCity)
    .then(data => {
      //   console.log(data.length);

      if (data.length > 10) {
        countryCardEl.innerHTML = '';
        ulEl.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (2 < data.length && data.length <= 10) {
        countryCardEl.innerHTML = '';
        ulEl.innerHTML = '';

        data.forEach(dataItem => {
          const nameOfCountry = dataItem.name.official;
          const flagOfCountry = dataItem.flags.svg;

          const htmlCountryAndFlag = `
          <li class="countries-list-item">
            <img src="${flagOfCountry}" alt="flag of country" width="25" height="15"/>
            <p class="country-name-list">${nameOfCountry}</p>
          </li>
        `;

          ulEl.innerHTML += `${htmlCountryAndFlag}`;
        });
      }

      if (data.length === 1) {
        ulEl.innerHTML = '';

        data.forEach(dataItem => {
          const nameOfCountry = dataItem.name.official;
          const flagOfCountry = dataItem.flags.svg;
          const capitalOfCountry = dataItem.capital.join(', ');
          const populationOfCountry = dataItem.population;
          const langOfCountry = Object.values(dataItem.languages).join(', ');

          const htmlCountryCard = `<div class="country-container">
            <img
              src="${flagOfCountry}"
              alt="flag of country"
              width="35"
              height="25"
            />
            <h1 class="card-title">${nameOfCountry}</h1>
          </div>
          <ul>
            <li class="list-item-card">
              <span class="key-list-item">Capital:</span>${capitalOfCountry}
            </li>
            <li class="list-item-card">
              <span class="key-list-item">Population:</span>${populationOfCountry}
            </li>
            <li class="list-item-card">
              <span class="key-list-item">Languages:</span>${langOfCountry}
            </li>
          </ul>`;

          countryCardEl.innerHTML = `${htmlCountryCard}`;
        });
      }
    })
    .catch(erorr => {
      ulEl.innerHTML = '';
      countryCardEl.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
