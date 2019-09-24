/* Можно лучше: Для лучшей читаемости кода можно разбить код по файлам.
Пример разбития кода по файлам:
  - Для каждого класса свой файл.
  - Свой файл для массива карточек.
  - Файл для инициализации проекта.
*/
import CardList from './cardlist.js';
import Popup from './popup.js';

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort2' : 'https://praktikum.tk/cohort2';

/* class Popup {
  constructor(popupLayer) {
    this.popup = popupLayer;

    this.popup.addEventListener("click", event => {
      if (event.target.classList.contains("popup__close")) this.close();
    });
  }
  open() {
    this.popup.classList.add("popup_is-opened");
  }
  close() {
    this.popup.classList.remove("popup_is-opened");
  }
} */

const options = {
  baseUrl: serverUrl,
  headers: {
    authorization: "9922978c-7064-4768-980e-da5942d98e1a",
    "Content-Type": "application/json"
  }
};

class Api {
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

const root = document.querySelector(".root");
const popup = root.querySelector(".popup");
const popupEdit = root.querySelector(".popup-edit"); 
const popupImage = root.querySelector(".popup-image"); 
const form = document.forms.new;
const buttonAdd = form.elements.button;
const title = form.elements.title;
const link = form.elements.link;
const formEdit = document.forms.edit;
const buttonSaveProfile = formEdit.elements.button;
const popupEditInputName = formEdit.elements.name;
const popupEditInputAbout = formEdit.elements.about;
const userInfoName = root.querySelector(".user-info__name");
const userInfoJob = root.querySelector(".user-info__job");
const userInfoPhoto = root.querySelector(".user-info__photo");
const popupErrorMessage = popup.querySelectorAll(".error-message"); 
const popupEditErrorMessage = popupEdit.querySelectorAll(".error-message");
const popupCard = new Popup(popup);
const popupEditProfile = new Popup(popupEdit);
const popupCardImage = new Popup(popupImage);
const cardList = new CardList(document.querySelector(".places-list"), []);
//=============================================
function render(isLoading, button) {
  if (isLoading) {
    button.textContent = "Загрузка...";
  } else if (button === buttonAdd) {
    button.textContent = "+";
  } else {
    button.textContent = "Сохранить";
  }
}

const api = new Api(options);
api
  .getProfileValue()
  .then(res => {
    userInfoName.textContent = res.name;
    userInfoJob.textContent = res.about;
    userInfoPhoto.style.backgroundImage = `url(${res.avatar})`;
  })
  .catch(err => {
    console.log(err);
  });
api
  .getInitialCards()
  .then(res => {
    res.forEach(card => cardList.addCard(card.name, card.link))
  })
  .catch(err => {
    console.log(err);
  });

//==========================
function profileValue() {
  popupEditInputName.value = userInfoName.textContent;
  popupEditInputAbout.value = userInfoJob.textContent;
  popupEditErrorMessage[0].textContent = ""; 
  popupEditErrorMessage[1].textContent = "";
}
function validate(event) {
  const errorElement = document.querySelector(
    `.error-message_${event.target.name}`
  );
  if (!event.target.checkValidity() && event.target.type === "url") {
    errorElement.textContent = "Здесь должна быть ссылка";
    buttonAdd.classList.remove("popup__button_active");
  } else if (!event.target.checkValidity() && event.target.type === "text") {
    errorElement.textContent = "Это обязательное поле";
    event.target.classList.add("popup-edit__input_invalid-margin");
    buttonAdd.classList.remove("popup__button_active");
  } else if (
    (event.target.value.trim().length <= 1 ||
      event.target.value.trim().length > 30) &&
    event.target.type === "text"
  ) {
    errorElement.textContent = "Должно быть от 2 до 30 символов";
    event.target.classList.add("popup-edit__input_invalid-margin");
    buttonAdd.classList.remove("popup__button_active");
  } else {
    errorElement.textContent = "";
    event.target.classList.remove("popup-edit__input_invalid-margin");
    buttonAdd.classList.add("popup__button_active");
    buttonAdd.removeAttribute("disabled");
  }
  return;
}
root.addEventListener("click", function(event) {
  if (event.target.classList.contains("user-info__button")) {
    form.reset();
    popupCard.open();
    popupErrorMessage[0].textContent = ""; 
    popupErrorMessage[1].textContent = "";
    buttonAdd.classList.remove("popup__button_active");
    buttonAdd.setAttribute("disabled", true);
  } else if (event.target.classList.contains("user-info__edit")) {
    profileValue();
    popupEditProfile.open();
    buttonSaveProfile.classList.add("popup-edit__button_active");
    buttonSaveProfile.removeAttribute("disabled");
  } else if (event.target.classList.contains("place-card__image")) {
    popupCardImage.open();
    const image = root.querySelector(".popup-image__image");
    const imageValue = event.target.getAttribute("style").split('"');
    image.src = imageValue[1];
  }
});
buttonAdd.addEventListener("click", function() {
  api.addCardRequest(title.value, link.value)
  .then((res) => {
    console.log(res)
    cardList.addCard(res.name, res.link)
    popupCard.close();
  } )
  .catch((err) => console.log(err))
  .finally(() =>  render(false, buttonAdd));

  render(true, buttonAdd);
  form.reset();
});
buttonSaveProfile.addEventListener("click", function() {
  render(true, buttonSaveProfile);
  api.patchProfile(popupEditInputName.value, popupEditInputAbout.value)
  .then(() => {
     userInfoName.textContent = popupEditInputName.value;
     userInfoJob.textContent = popupEditInputAbout.value;
     popupEditProfile.close();
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
  render(false, buttonSaveProfile); 
  });

  
});
form.addEventListener("input", function() {
  if (
    title.value.trim().length <= 1 ||
    title.value.trim().length >= 30 ||
    !link.checkValidity()
  ) {
    buttonAdd.classList.remove("popup__button_active");
    buttonAdd.setAttribute("disabled", true);
  } else {
    buttonAdd.classList.add("popup__button_active");
    buttonAdd.removeAttribute("disabled");
  }
});
formEdit.addEventListener("input", function() {
  if (
    popupEditInputName.value.trim().length <= 1 ||
    popupEditInputName.value.trim().length > 30 ||
    (popupEditInputAbout.value.trim().length <= 1 ||
      popupEditInputAbout.value.trim().length > 30)
  ) {
    buttonSaveProfile.classList.remove("popup-edit__button_active");
    buttonSaveProfile.setAttribute("disabled", true);
  } else {
    buttonSaveProfile.classList.add("popup-edit__button_active");
    buttonSaveProfile.removeAttribute("disabled");
  }
});

popupEditInputName.addEventListener("input", validate);
popupEditInputAbout.addEventListener("input", validate);
title.addEventListener("input", validate);
link.addEventListener("input", validate);




