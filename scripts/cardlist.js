import Card from './card.js';

export default class CardList {
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