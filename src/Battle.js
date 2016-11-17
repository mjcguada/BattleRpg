'use strict';

var EventEmitter = require('events').EventEmitter;
var CharactersView = require('./CharactersView');
var OptionsStack = require('./OptionsStack');
var TurnList = require('./TurnList');
var Effect = require('./items').Effect;

var utils = require('./utils');
var listToMap = utils.listToMap;
var mapValues = utils.mapValues;

function Battle() {
  EventEmitter.call(this);
  this._grimoires = {};
  this._charactersById = {};
  this._turns = new TurnList();

  this.options = new OptionsStack();
  this.characters = new CharactersView();
}
Battle.prototype = Object.create(EventEmitter.prototype);
Battle.prototype.constructor = Battle;

Object.defineProperty(Battle.prototype, 'turnList', {
  get: function () {
    return this._turns ? this._turns.list : null;
  }
});

Battle.prototype.setup = function (parties) {
  this._grimoires = this._extractGrimoiresByParty(parties);
  this._charactersById = this._extractCharactersById(parties);
  this._states = this._resetStates(this._charactersById);
  this._turns.reset(this._charactersById);

  this.characters.set(this._charactersById);
  this.options.clear();
};

Battle.prototype.start = function () {
  this._inProgressAction = null;
  this._stopped = false;
  this.emit('start', this._getCharIdsByParty());
  this._nextTurn();
};

Battle.prototype.stop = function () {
  this._stopped = true;
};

Object.defineProperty(Battle.prototype, '_activeCharacter', {
  get: function () {
    return this._charactersById[this._turns.activeCharacterId];
  }
});

Battle.prototype._extractGrimoiresByParty = function (parties) {
  var grimoires = {};
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var partyGrimoire = parties[partyId].grimoire || [];
    grimoires[partyId] = listToMap(partyGrimoire, useName);
  });
  return grimoires;

  function useName(scroll) {
    return scroll.name;
  }
};

Battle.prototype._extractCharactersById = function (parties) {
  var idCounters = {};
  var characters = [];
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var members = parties[partyId].members;
    assignParty(members, partyId);
    characters = characters.concat(members);
  });
  return listToMap(characters, useUniqueName);

  function assignParty(characters, party) {
    // Cambia la party de todos los personajes a la pasada como parámetro.
    for (var i = 0; i < characters.length; i++){
      characters[i].party = party;
    }

  }

  function useUniqueName(character) {
    // Genera nombres únicos de acuerdo a las reglas
    /*Recorre todos los bandos. Por cada bando:
      Recorre todos los miembros. Por cada miembros:
      1.Recupera el nombre del personaje y comprueba si 
      está en el histograma de nombres.
      2.Si no está, añádelo con valor cero.
      3..Recupera el valor para nombre en el histograma 
      de nombres.
      4.Si es 0, el identificador es el nombre.
      5.Si es mayor que 0, el identificador es el nombre
      seguido de un espacio y el valor del histograma 
      más uno.
      6.Incrementa el valor del histograma en 1.
      7.Asigna al personaje ese identificador.
    */

    if(idCounters[character.name])
      return character.name;
      

  }
};

Battle.prototype._resetStates = function (charactersById) {
  return Object.keys(charactersById).reduce(function (map, charId) {
    map[charId] = {};
    return map;
  }, {});
};

Battle.prototype._getCharIdsByParty = function () {
  var charIdsByParty = {};
  var charactersById = this._charactersById;
  Object.keys(charactersById).forEach(function (charId) {
    var party = charactersById[charId].party;
    if (!charIdsByParty[party]) {
      charIdsByParty[party] = [];
    }
    charIdsByParty[party].push(charId);
  });
  return charIdsByParty;
};

Battle.prototype._nextTurn = function () {
  if (this._stopped) { return; }
  setTimeout(function () {
    var endOfBattle = this._checkEndOfBattle();
    if (endOfBattle) {
      this.emit('end', endOfBattle);
    } else {
      var turn = this._turns.next();
      this._showActions();
      this.emit('turn', turn);
    }
  }.bind(this), 0);
};

Battle.prototype._checkEndOfBattle = function () {
  var allCharacters = mapValues(this._charactersById);
  var aliveCharacters = allCharacters.filter(isAlive);
  var commonParty = getCommonParty(aliveCharacters);
  return commonParty ? { winner: commonParty } : null;

  function isAlive(character) {
    // Devuelve true si el personaje está vivo.
    return character._hp > 0;    
  }

  function getCommonParty(characters) {
    if (characters !== null){
      var bando = characters[0].party;
      var comparten = true;
      for (var i = 1; i < characters.length; i++){
        if (characters[i].party !== bando){
              comparten = false;
        }
      }
      if (comparten){ return bando;}
      else return null;
    // Devuelve la party que todos los personajes tienen en común o null en caso
    // de que no haya común.
    }
  }
};

Battle.prototype._showActions = function () {
  this.options.current = {
    'attack': true,
    'defend': true,
    'cast': true
  };
  this.options.current.on('chose', this._onAction.bind(this));
};

Battle.prototype._onAction = function (action) {
  this._action = {
    action: action,
    activeCharacterId: this._turns.activeCharacterId
  };
  
  if(action === 'attack'){
    this._attack();
  }else if(action  === 'defend'){
    this._defend();
  } else if(action === 'cast'){
    this._cast();
  }
};

Battle.prototype._defend = function () {
  var activeCharacterId = this._action.activeCharacterId;
  var newDefense = this._improveDefense(activeCharacterId);
  this._action.targetId = this._action.activeCharacterId;
  this._action.newDefense = newDefense;
  this._executeAction();
};

Battle.prototype._improveDefense = function (targetId) {
  if (states === null || states === {}){
    var states = this._states[targetId];
    states.defense = targetId.defense;
    var defensa = Math.ceil(states.defense * 1.1);
  }
  //Implementa la mejora de la defensa del personaje.
  console.log('hahahahahahahah' + states);
  //states.currentDefense = Math.ceil(states.defense * 1.1);
  
  console.log('--------' + defensa);
  return defensa;
};

Battle.prototype._restoreDefense = function (targetId) {
  // Restaura la defensa del personaje a cómo estaba antes de mejorarla.
  // Puedes utilizar el atributo this._states[targetId] para llevar tracking
  // de las defensas originales.
  //targetId.defense = states.defense;
  //var defense = this._states[targetId];
  //targetId.defense = this._resetStates.defense(this._charactersById);

};

Battle.prototype._attack = function () {
  var self = this;
  self._showTargets(function onTarget(targetId) {
    // Implementa lo que pasa cuando se ha seleccionado el objetivo.
    self._executeAction();
    self._restoreDefense(targetId);
  });
};

Battle.prototype._cast = function () {
  var self = this;

  //console.log('apkshpkfspkhsophespohsfojsf------' + this.activeCharacter);
  self._showScrolls(function onScroll(scrollId, scroll) {
    //self._executeAction();
    this.activeCharacter.mp -= scrollId.cost;
    // Implementa lo que pasa cuando se ha seleccionado el hechizo.
  });
};

Battle.prototype._executeAction = function () {
  var action = this._action;
  var effect = this._action.effect || new Effect({});
  var activeCharacter = this._charactersById[action.activeCharacterId];
  var targetCharacter = this._charactersById[action.targetId];
  var areAllies = activeCharacter.party === targetCharacter.party;

  var wasSuccessful = targetCharacter.applyEffect(effect, areAllies);
  this._action.success = wasSuccessful;

  this._informAction();
  this._nextTurn();
};

Battle.prototype._informAction = function () {
  this.emit('info', this._action);
};

Battle.prototype._showTargets = function (onSelection) {
  // Toma ejemplo de la función ._showActions() para mostrar los identificadores
  // de los objetivos.  
  /*var allCharacters = mapValues(this._charactersById);
  var vivos = allCharacters.filter(isAlive);
  this.options.current = {
    for(var i = 0; i < vivos.length; i++){
      vivos[i].toString(): true;
    }
  }
  this.options.current.on('chose', onSelection);*/
  
};

Battle.prototype._showScrolls = function (onSelection) {
  // Toma ejemplo de la función anterior para mostrar los hechizos. Estudia
  // bien qué parámetros se envían a los listener del evento chose.
  console.log('---------------' + this._grimoires);
  var testing = 1;
  for(var nombre in this._grimoires){
    testing: true;
    testing++;
  }
  this.options.current.on('chose', onSelection);
};

module.exports = Battle;