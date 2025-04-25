function handleResponse(response) {
  if (response.status === 501) {
    return response.json().then((error) => {
      throw new Error('The function is not implemented on the server.');
    });
  }
  if (response.status === 404) {
    throw new Error('Not found.');
  }
  if (!response.ok) {
    return response.json().then((error) => {
      throw new Error(error.message);
    });
  }
  return response.json();
}

async function fetchAndPopulateCountries(selectElementId) {
  try {
    const res = await fetch('/api/project-settings/countries');
    const countries = await res.json();
    console.log('Available countries:', countries);

    const select = document.getElementById(selectElementId);
    if (!select) {
      console.warn(`No <select> element found with ID "${selectElementId}"`);
      return;
    }

    select.innerHTML = ''; // Clear existing options
    countries.sort().forEach((countryCode) => {
      const option = document.createElement('option');
      option.value = countryCode;
      option.textContent = countryCode;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to fetch countries:', error);
  }
}
