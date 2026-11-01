// Who's who: an example Steading plugin that reads the campaign. It asks for
// campaign:read, so it sees the pages the person using it can see, and nothing
// else: a player's copy never lists a page hidden from them.

function el(tag, props, kids) {
  const e = document.createElement(tag);
  Object.assign(e, props || {});
  (kids || []).forEach(function (kid) { e.append(kid); });
  return e;
}

steading.tableTool('whos-who', {
  async render(ctx) {
    const list = el('ul', { className: 'whos-who' });
    const search = el('input', { type: 'search', placeholder: 'Who was that?', ariaLabel: 'Find a person' });
    const style = el('style', { textContent: '.whos-who{list-style:none;margin:0;padding:0}.whos-who li{padding:2px 0}.whos-who button{all:unset;cursor:pointer;color:var(--ink);border-bottom:1px solid var(--mark)}.whos-who button:hover{color:var(--rubric)}.whos-who button:focus-visible{outline:2px solid var(--focus);outline-offset:2px}input{width:100%}' });
    ctx.root.append(style, el('div', { className: 'st-stack' }, [search, list]));

    let people = [];
    function draw() {
      const q = search.value.trim().toLowerCase();
      const shown = people.filter(function (p) { return !q || p.title.toLowerCase().includes(q); });
      list.textContent = '';
      if (!shown.length) {
        list.append(el('li', { className: 'st-quiet', textContent: people.length ? 'Nobody by that name.' : 'No people in this campaign yet.' }));
        return;
      }
      shown.forEach(function (p) {
        list.append(el('li', {}, [el('button', { type: 'button', textContent: p.title || 'Untitled', onclick: function () { steading.open(p.id); } })]));
      });
    }
    search.addEventListener('input', draw);

    people = (await steading.pages.list({ kind: 'person' })).sort(function (a, b) { return a.title.localeCompare(b.title); });
    draw();
  },
});
