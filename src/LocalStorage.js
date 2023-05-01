export function saveUserToken(userToken) {
    localStorage.setItem("TOKEN", userToken);
    window.dispatchEvent(new Event("storage"));
  }
export function getUserToken() {
return localStorage.getItem("TOKEN");
}
export function clearUserToken() {
return localStorage.removeItem("TOKEN");
}



export function saveWaiterToken(waiterToken) {
    localStorage.setItem("TOKEN", waiterToken);
    window.dispatchEvent(new Event("storage"));
  }

export function getWaiterToken() {
return localStorage.getItem("TOKEN");
}

export function clearWaiterToken() { 
return localStorage.removeItem("TOKEN");
}

export function saveTableNumber(tableNumber) {
  localStorage.setItem("TABLE", tableNumber);
  window.dispatchEvent(new Event("storage"));
}

export function getTableNumber() {
return localStorage.getItem("TABLE");
}

export function clearTableNumber() {
return localStorage.removeItem("TABLE");
}