// Tavern maker: an example Steading plugin. It asks for one permission,
// "pages:create", to keep a tavern as a place page.

var FIRST = ['The Crooked', 'The Drowned', 'The Laughing', 'The Gilded', 'The Sleeping', 'The Three', 'The Lame', 'The Hungry', 'The Last', 'The Painted'];
var SECOND = ['Stag', 'Lantern', 'Goose', 'Kettle', 'Crow', 'Barrel', 'Wheel', 'Maiden', 'Hound', 'Anchor', 'Pilgrim'];
var KEEPERS = [
  'Old Brannock, who never forgets a face or a debt',
  'Mira Salt, a retired sailor with a wooden hand',
  'the Tamsin twins, who finish each other’s threats',
  'Gaffer Holt, deaf in one ear and nosy in both',
  'Widow Ashby, who keeps a crossbow under the bar',
  'a halfling named Pell, who runs the place on credit',
];
var FOOD = ['mutton stew with too much pepper', 'eel pie', 'black bread and hard cheese', 'a whole roast goose, if you can pay', 'turnip soup', 'river trout on a plank'];
var DRINK = ['a sour brown ale', 'mead that tastes of smoke', 'cheap red wine', 'a cloudy cider', 'something green the locals swear by'];
var RUMOURS = [
  'the miller’s boy saw lights in the old barrow',
  'the new reeve is paying in coins nobody recognises',
  'something has been taking sheep, and leaving the wool',
  'a stranger asked about the party by name last night',
  'the well went dry the day the bells stopped',
  'the abbey is hiring guards and not saying why',
];

function make() {
  return {
    name: steading.pick(FIRST) + ' ' + steading.pick(SECOND),
    keeper: steading.pick(KEEPERS),
    food: steading.pick(FOOD),
    drink: steading.pick(DRINK),
    rumour: steading.pick(RUMOURS),
  };
}

function text(t) {
  return 'Kept by ' + t.keeper + '.\n\nOn the fire: ' + t.food + ', with ' + t.drink + '.\n\nThe talk at the bar: ' + t.rumour + '.';
}

function keep(t) {
  return steading.pages.create({ title: t.name, kind: 'place', text: text(t) });
}

function el(tag, attrs, kids) {
  var e = document.createElement(tag);
  for (var k in attrs || {}) {
    if (k === 'text') e.textContent = attrs[k];
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  (kids || []).forEach(function (kid) { if (kid) e.appendChild(kid); });
  return e;
}

steading.tableTool('tavern', {
  render: function (ctx) {
    var t = null;
    var box = el('div', { class: 'st-stack', 'aria-live': 'polite' });
    function draw() {
      box.textContent = '';
      if (!t) return;
      box.appendChild(el('div', { class: 'st-card' }, [
        el('h2', { text: t.name }),
        el('p', { class: 'st-text', text: 'Kept by ' + t.keeper + '.' }),
        el('p', { class: 'st-text', text: 'On the fire: ' + t.food + ', with ' + t.drink + '.' }),
        el('p', { class: 'st-text', text: 'The talk at the bar: ' + t.rumour + '.' }),
      ]));
      box.appendChild(el('div', { class: 'st-row' }, [
        el('button', {
          class: 'st-primary',
          text: 'Keep it as a page',
          onclick: function () {
            var name = t.name;
            keep(t).then(function () {
              steading.jot('Visited ' + name);
              steading.toast('Kept ' + name + ' as a place');
            }, function (e) { steading.toast(e.message); });
          },
        }),
      ]));
    }
    ctx.root.appendChild(el('div', { class: 'st-stack' }, [
      el('div', { class: 'st-row' }, [el('button', { text: 'Make a tavern', onclick: function () { t = make(); draw(); } })]),
      box,
    ]));
  },
});

steading.command('make-tavern', function () {
  var t = make();
  return keep(t).then(function (made) {
    if (made) return steading.open(made.id);
  });
});
