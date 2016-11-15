'use strict';

function CharactersView() {
  this._views = {};
}

CharactersView.prototype._visibleFeatures = [
  'name',
  'party',
  'initiative',
  'defense',
  'hp',
  'mp',
  'maxHp',
  'maxMp'
];

CharactersView.prototype.all = function () {
  return Object.keys(this._views).reduce(function (copy, id) {
    copy[id] = this._views[id];
    return copy;
  }.bind(this), {});
};

CharactersView.prototype.allFrom = function (party) {
  return Object.keys(this._views).reduce(function (copy, id) {
    if (this._views[id].party === party) {
      copy[id] = this._views[id];
    }
    return copy;
  }.bind(this), {});
};

CharactersView.prototype.get = function (id) {
  return this._views[id] || null;
};

CharactersView.prototype.set = function (characters) {
  this._views = Object.keys(characters).reduce(function (views, id) {
    views[id] = this._getViewFor(characters[id]);
    return views;
  }.bind(this), {});
};

CharactersView.prototype._getViewFor = function (character) {
  var view = {};
  // Usa la lista de características visibles y Object.defineProperty() para
  // devolver un objeto de JavaScript con las características visibles pero
  // no modificables.
  //Mismo esquema para cada feature.
  Object.defineProperty(view, 'name', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.name;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.name = character.name;
    },
    enumerable: true
  });

  Object.defineProperty(view, 'party', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.party;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.party = character.party;
    },
    enumerable: true
  });

  Object.defineProperty(view, 'initiative', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.initiative;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.initiative = character.initiative;
    },
    enumerable: true
  });
  Object.defineProperty(view, 'defense', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.defense;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.defense = character.defense;
    },
    enumerable: true
  });
  Object.defineProperty(view, 'hp', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.hp;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.hp = character.hp;
    },
    enumerable: true
  });
  Object.defineProperty(view, 'mp', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.mp;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.mp = character.mp;
    },
    enumerable: true
  });
  Object.defineProperty(view, 'maxHp', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.maxHp;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.maxHp = character.maxHp;
    },
    enumerable: true
  });
  Object.defineProperty(view, 'maxMp', {
    get: function () {
      // ¿Cómo sería este getter para reflejar la propiedad del personaje?
      return character.maxMp;
    },
    set: function (value) {
      // ¿Y este setter para ignorar cualquier acción?
      character.maxMp = character.maxMp;
    },
    enumerable: true
  });



  // Acuérdate de devolver el objeto.
  return view; 
};

module.exports = CharactersView;
