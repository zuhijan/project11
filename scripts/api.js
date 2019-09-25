export default class Api {
    constructor(options) {
      this.baseUrl = options.baseUrl;
      this.headers = options.headers;
    }
    getResponseJson(res) {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(res.status);
      }
    }
    getProfileValue() {
      return fetch(`${this.baseUrl}/users/me`, { headers: this.headers }).then(
        res => this.getResponseJson(res)
      );
    }
    getInitialCards() {
      return fetch(`${this.baseUrl}/cards`, { headers: this.headers }).then(res =>
        this.getResponseJson(res)
      );
    }
    patchProfile(name, about) {    
      return fetch(`${this.baseUrl}/users/me`, {   
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
        .then(res => this.getResponseJson(res))        
    }
    addCardRequest(name, link) {
      return fetch(`${this.baseUrl}/cards`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          name: name,
          link: link
        })
      })
        .then(res => this.getResponseJson(res))      
    }
  }