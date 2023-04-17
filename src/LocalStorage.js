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
