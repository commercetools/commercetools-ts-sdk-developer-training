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
