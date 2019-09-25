
export default class Card {
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