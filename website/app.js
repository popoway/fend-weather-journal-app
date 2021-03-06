/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
const key = '3a64c902886a4c9117dfc1a15e7023c4';
const country = 'us';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// An async function that uses fetch() to make a GET request to the OpenWeatherMap API
const getWeather = async (baseURL, zip, key) => {
  const res = await fetch(`${baseURL}?zip=${zip},${country}&units=metric&appid=${key}`);
  try {
    const data = await res.json();
    console.log('Getting weather from OpenWeatherMap API\n' + JSON.stringify(data));
    return data;
  }
  catch (error) {
    console.log('error', error);
  }
};

// An async function that uses fetch() to make a POST request to add data to app
const postData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  try {
    const data = await res.json();
    console.log('Sending data to app:\n' + JSON.stringify(data));
    return data;
  }
  catch (error) {
    console.log('error', error);
  }
};

const getData = async (url = '') => {
  const res = await fetch(url);
  try {
    const data = await res.json();
    console.log('Getting data from app:\n' + JSON.stringify(data));
    return data;
  }
  catch (error) {
    console.log('error', error);
  }
}

document.addEventListener('DOMContentLoaded', (evt) => {
  console.log('DOM is fully loaded.');
  const generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', (evt) => {
    event.preventDefault();
    const zip = document.getElementById('zip').value;
    getWeather(baseURL, zip, key).then((data) => {
      const temp = data.main.temp;
      const content = document.getElementById('feelings').value;
      const postDataObject = {
        temp: temp,
        date: newDate,
        content: content
      }
      postData('/postProjectData', postDataObject).then((data) => {
        getData('/getProjectData').then((data) => {
          const mostRecentEntry = data;
          // Dynamically Update UI
          document.getElementById('date').innerHTML = `Date: ${mostRecentEntry.date}`;
          document.getElementById('temp').innerHTML = `Temperature: ${mostRecentEntry.temp}&deg;C`;
          document.getElementById('content').innerHTML = `Content: ${mostRecentEntry.content}`;
        });
      });
    });
  });
});
