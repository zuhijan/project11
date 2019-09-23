/* Можно лучше: Для лучшей читаемости кода можно разбить код по файлам.
Пример разбития кода по файлам:
  - Для каждого класса свой файл.
  - Свой файл для массива карточек.
  - Файл для инициализации проекта.
*/
class Card {
  constructor(name, link) {
    this.cardElement = this.create(name, link);
    this.cardElement
      .querySelector(".place-card__like-icon")
      .addEventListener("click", this.like);
    this.cardElement
      .querySelector(".place-card__delete-icon")
      .addEventListener("click", this.remove);
  }
  like(event) {
    event.target.classList.toggle("place-card__like-icon_liked");
  }
  remove(event) {
    event.target.closest(".place-card").remove();
  }
  create(nameValue, linkValue) {
    const placeCard = document.createElement("div");
    const placeCardImage = document.createElement("div");   
    const placeCardDeleteIcon = document.createElement("button");
    const placeCardDescription = document.createElement("div");
    const placeCardName = document.createElement("h3");
    const placeCardLikeIcon = document.createElement("button");
    const likeCount = document.createElement("p");
    const containerLike = document.createElement("div");
    placeCard.classList.add("place-card");
    placeCardImage.classList.add("place-card__image");
    placeCardImage.style.backgroundImage = `url(${linkValue})`;
    placeCardDeleteIcon.classList.add("place-card__delete-icon");
    placeCardDescription.classList.add("place-card__description");
    placeCardName.classList.add("place-card__name");
    containerLike.classList.add("place-card__container-like");
    placeCardName.textContent = nameValue;
    placeCardLikeIcon.classList.add("place-card__like-icon");
    likeCount.classList.add("place-card__like-count");
    likeCount.textContent = "0";
    placeCardImage.appendChild(placeCardDeleteIcon);
    placeCard.appendChild(placeCardImage);
    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(containerLike);
    containerLike.appendChild(placeCardLikeIcon);
    containerLike.appendChild(likeCount);
    placeCard.appendChild(placeCardDescription);

    return placeCard;
  }
}
class CardList {
  constructor(container, cards) {
    this.container = container;
    this.cards = cards;
    this.render();
  }
  render() {
    for (let i = 0; i < this.cards.length; i++) {
      const { cardElement } = new Card(this.cards[i].name, this.cards[i].link);
      this.container.appendChild(cardElement);
    }
  }
  addCard(title, link) {
    const { cardElement } = new Card(title, link);

    this.cards.push(cardElement);
    this.container.appendChild(cardElement);
  }
}

class Popup {
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
}

const options = {
  baseUrl: "http://95.216.175.5/cohort2",
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
    /* Надо исправить: необходимо также как в методах getProfileValue и getInitialCards возвращать промис,
    чтобы сохранять данные на странице только после ответа сервера. Сейчас данные пользователя сохраняются
     на странице независимо от того дошли ли они до сервера.ok
     
     Возврат промиса не добавлен, должно быть return fetch(`${this.baseUrl}/users/me`, {   
     */
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
  //   numberLike() {
  //     return fetch(`${this.baseUrl}/cards`, {headers: this.headers})
  //     .then((res) =>  this.getResponseJson(res))
  //     .then((res) =>
  //     { res.forEach((elem) => {
  //         console.log(elem.likes.length);
  //       })
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }
}

const root = document.querySelector(".root");
const popup = root.querySelector(".popup"); // 1 попап
const popupEdit = root.querySelector(".popup-edit"); //2 попап
const popupImage = root.querySelector(".popup-image"); //3 попап
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
const popupErrorMessage = popup.querySelectorAll(".error-message"); //сделать лучше потом
const popupEditErrorMessage = popupEdit.querySelectorAll(".error-message");
// const placeList = document.querySelector(".places-list");
// const placeCardConst = placeList.querySelectorAll("place-card");
// const likeCoundConst = placeList.querySelectorAll("place-card__like-count");

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

    // new CardList(document.querySelector(".places-list"), res);
    // res.forEach((elem) => {
    //   (root.querySelector("place-card__like-count").closest(elem)).textContent = elem.likes.length;
    // })
  })
  .catch(err => {
    console.log(err);
  });
//api.numberLike();
//==========================
function profileValue() {
  popupEditInputName.value = userInfoName.textContent;
  popupEditInputAbout.value = userInfoJob.textContent;
  popupEditErrorMessage[0].textContent = ""; //сделать лучше потом
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
    popupErrorMessage[0].textContent = ""; //сделать лучше потом
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
  // event.preventDefault();
  render(true, buttonSaveProfile);

  /* Надо исправить: из метода patchProfile промис не возвращается, поэтому ошибка
  в консоли при сохранении данных:
    Uncaught TypeError: Cannot read property 'then' of undefined
      at HTMLButtonElement.<anonymous> (script.js:332)
  */
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
//сделать лучше надо
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

/*
 По всей работе: Хорошая работа, качественная структура кода, использования делегирования, понятные названия.
 Нужно исправить неправильное поведение попапа.
*/

/* По всей работе: Задание выполнено. Отличная работа! */
//authorization: '9922978c-7064-4768-980e-da5942d98e1a'



/*
  Методы класса класса Api организованы довольно хорошо. Отлично, что getResponseJson 
  вынесено в отдельный метод чтобы не дублировать проверку.

  Но при вызове patchProfile данные изменяются на странице до ответа сервера, это нужно исправить.

*/


/*
  Хорошо, что некоторые правки внесены, код стал лучше, но из метода patchProfile
  промис все ещё не возвращается, поэтому при сохранении профиля в консоли ошибка

  script.js:332 Uncaught TypeError: Cannot read property 'then' of undefined
    at HTMLButtonElement.<anonymous> (script.js:332)

*/