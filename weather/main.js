// Weather: an example Steading plugin. Everything it needs is here; it asks
// for no permissions at all, so it can only keep data in its own block.

var CLIMATES = {
  temperate: {
    name: 'Temperate',
    temp: ['Cold', 'Cool', 'Mild', 'Mild', 'Warm'],
    sky: ['clear and bright', 'high thin cloud', 'grey and overcast', 'a fine drizzle', 'steady rain', 'fog until noon', 'a thunderstorm by evening'],
    wind: ['no wind', 'a light breeze', 'a gusty wind', 'a hard wind from the west'],
  },
  north: {
    name: 'Cold north',
    temp: ['Bitter', 'Freezing', 'Cold', 'Cold', 'Cool'],
    sky: ['clear and hard', 'low cloud', 'light snow', 'heavy snow', 'sleet', 'freezing fog', 'a blizzard coming in'],
    wind: ['still air', 'a biting breeze', 'a howling wind', 'a gale off the ice'],
  },
  south: {
    name: 'Hot south',
    temp: ['Warm', 'Hot', 'Hot', 'Scorching', 'Sweltering'],
    sky: ['cloudless', 'hazy', 'heavy and humid', 'a sudden downpour', 'dust on the horizon', 'a sandstorm'],
    wind: ['no wind at all', 'a dry breeze', 'hot gusts', 'a wind full of grit'],
  },
  coast: {
    name: 'Coast',
    temp: ['Cold', 'Cool', 'Mild', 'Mild', 'Warm'],
    sky: ['bright with fast cloud', 'sea mist', 'squalls', 'rain off the sea', 'a clear night coming', 'a storm building'],
    wind: ['a calm sea', 'a fresh breeze', 'a strong onshore wind', 'a gale'],
  },
};

function roll(climate) {
  var c = CLIMATES[climate] || CLIMATES.temperate;
  return steading.pick(c.temp) + ', ' + steading.pick(c.sky) + ', ' + steading.pick(c.wind) + '.';
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

function climatePicker(value, onChange, disabled) {
  var s = el('select', { 'aria-label': 'Climate', onchange: function () { onChange(s.value); } });
  Object.keys(CLIMATES).forEach(function (k) {
    var o = el('option', { value: k, text: CLIMATES[k].name });
    if (k === value) o.selected = true;
    s.appendChild(o);
  });
  if (disabled) s.disabled = true;
  return s;
}

steading.block('examples.weather.days', {
  render: function (ctx) {
    function draw() {
      var d = ctx.data || { climate: 'temperate', days: [] };
      var save = function (next) { ctx.setData(next); draw(); };
      ctx.root.textContent = '';
      var today = d.days[d.days.length - 1];
      ctx.root.appendChild(
        el('div', { class: 'st-stack' }, [
          today
            ? el('p', { class: 'st-text', 'data-weather': 'today' }, [el('strong', { text: 'Day ' + d.days.length + ': ' }), document.createTextNode(today)])
            : el('p', { class: 'st-quiet', text: ctx.editable ? 'No weather rolled yet.' : 'No weather yet.' }),
          d.days.length > 1
            ? el('ul', { class: 'st-quiet' }, d.days.slice(-4, -1).reverse().map(function (w, i) { return el('li', { text: 'Day ' + (d.days.length - 1 - i) + ': ' + w }); }))
            : null,
          ctx.editable
            ? el('div', { class: 'st-row' }, [
                climatePicker(d.climate, function (c) { save({ climate: c, days: d.days }); }),
                el('button', { class: 'st-primary', text: today ? 'Roll the next day' : 'Roll today', onclick: function () { save({ climate: d.climate, days: d.days.concat([roll(d.climate)]).slice(-30) }); } }),
                d.days.length ? el('button', { text: 'Clear', onclick: function () { save({ climate: d.climate, days: [] }); } }) : null,
              ])
            : null,
        ]),
      );
    }
    ctx.onChange(draw);
    draw();
  },
});

steading.tableTool('weather', {
  render: function (ctx) {
    var climate = 'temperate';
    var out = el('p', { class: 'st-text', 'aria-live': 'polite' });
    var jot = el('button', { text: 'Jot it into the session', disabled: 'true', onclick: function () { steading.jot('Weather: ' + out.textContent); steading.toast('Jotted the weather'); } });
    ctx.root.appendChild(
      el('div', { class: 'st-stack' }, [
        el('p', { class: 'st-kicker', text: 'Weather' }),
        el('div', { class: 'st-row' }, [
          climatePicker(climate, function (c) { climate = c; }),
          el('button', { class: 'st-primary', text: 'Roll the weather', onclick: function () { out.textContent = roll(climate); jot.disabled = false; } }),
          jot,
        ]),
        out,
      ]),
    );
  },
});
