'use strict';

function TurnList() {}
TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber = 0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative();
};

TurnList.prototype.next = function () {
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
  var status = {number: 0, party: null, activeCharacterId: null};
  this.turnNumber++;
  var aux;
  aux = status.number = this.turnNumber;
  //Si se pasa de vuelta
  if (aux > this.list.length){
    this.activeCharacterId = this.list[(aux - 1) % this.list.length];
    while(this._charactersById[this.activeCharacterId].isDead()) {
        aux++;
        this.activeCharacterId = this.list[(aux - 1) % this.list.length];
    }

  } else if (aux <= this.list.length){
      this.activeCharacterId = this.list[aux - 1];
      while(this._charactersById[this.activeCharacterId].isDead()){
      aux++;
        if (aux > this.list.length){
      this.activeCharacterId = this.list[(aux - 1) % this.list.length];
        } else this.activeCharacterId = this.list[aux - 1];
      }
    }

  status.activeCharacterId = this.activeCharacterId;
  status.party = this._charactersById[status.activeCharacterId].party;
  //console.log(status.party);
  //console.log(status.number);
  return status;

};

TurnList.prototype._sortByInitiative = function () {
  // Utiliza la función Array.sort(). ¡No te implementes tu propia
  // función de ordenación!
  ///////////////
var characters = [];
var lista = [];

for(var name in this._charactersById){
  characters.push({party: name, initiative: this._charactersById[name].initiative});
}
  characters.sort(function (a, b){
    if ( a !== null && b !== null){
return (b.initiative - a.initiative)
    }
  });

  for(var nombre in characters){
    lista.push(characters[nombre].party);
  }
return lista;
//////////////
};

module.exports = TurnList;
