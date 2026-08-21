(() => {
  const rows = [...document.querySelectorAll('.price-catalogue tbody tr')];
  let priceFilter = 'all';
  let useFilter = 'all';
  const status = document.getElementById('filter-status');
  const matchesPrice = (price) => priceFilter === 'all' ||
    (priceFilter === 'under10000' && price < 10000) ||
    (priceFilter === '10000-30000' && price >= 10000 && price <= 30000) ||
    (priceFilter === '30000-70000' && price > 30000 && price <= 70000) ||
    (priceFilter === 'above70000' && price > 70000);
  const updateRows = () => {
    let visible = 0;
    rows.forEach((row) => {
      const show = matchesPrice(Number(row.dataset.price)) && (useFilter === 'all' || row.dataset.uses.split(' ').includes(useFilter));
      row.hidden = !show;
      if (show) visible += 1;
    });
    if (status) status.textContent = visible ? `Showing ${visible} tank${visible === 1 ? '' : 's'}` : 'No tanks match both filters. Try a wider budget or another application.';
  };
  document.querySelectorAll('[data-price-filter]').forEach((button) => button.addEventListener('click', () => {
    priceFilter = button.dataset.priceFilter;
    document.querySelectorAll('[data-price-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    updateRows();
  }));
  document.querySelectorAll('[data-use-filter]').forEach((button) => button.addEventListener('click', () => {
    useFilter = button.dataset.useFilter;
    document.querySelectorAll('[data-use-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    updateRows();
  }));

  const tanks = [{"capacity":1000,"price":6500,"diameter":117,"url":"roto-water-tank-1000-litres.html"},{"capacity":2000,"price":10500,"diameter":134,"url":"roto-water-tank-2000-litres.html"},{"capacity":3000,"price":14500,"diameter":158,"url":"roto-water-tank-3000-litres.html"},{"capacity":4000,"price":18500,"diameter":180,"url":"roto-water-tank-4000-litres.html"},{"capacity":5000,"price":24500,"diameter":193,"url":"roto-water-tank-5000-litres.html"},{"capacity":6000,"price":27500,"diameter":200,"url":"roto-water-tank-6000-litres.html"},{"capacity":8000,"price":32500,"diameter":200,"url":"roto-water-tank-8000-litres.html"},{"capacity":10000,"price":49500,"diameter":262,"url":"roto-water-tank-10000-litres.html"},{"capacity":16000,"price":67500,"diameter":314,"url":"roto-water-tank-16000-litres.html"},{"capacity":20000,"price":98500,"diameter":338,"url":"roto-water-tank-20000-litres.html"},{"capacity":24000,"price":135000,"diameter":356,"url":"roto-water-tank-24000-litres.html"}];
  const form = document.getElementById('tank-wizard-form');
  const result = document.getElementById('wizard-result');
  if (!form || !result) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const property = document.getElementById('property-type').value;
    const people = Number(document.getElementById('people-count').value);
    const daily = Number(document.getElementById('daily-usage').value);
    const days = Number(document.getElementById('backup-days').value);
    const space = document.getElementById('space-limit').value;
    const propertyMinimums = { apartment: 1000, home: 2000, rental: 5000, farm: 5000, school: 10000, business: 5000 };
    const calculated = Math.max(daily * days, people * 50 * days, propertyMinimums[property] || 1000);
    const maxDiameter = { compact: 160, standard: 220, open: Infinity }[space];
    const fitting = tanks.filter((tank) => tank.diameter <= maxDiameter);
    let recommended = fitting.find((tank) => tank.capacity >= calculated);
    let spaceWarning = '';
    if (!recommended) {
      recommended = fitting[fitting.length - 1] || tanks[0];
      spaceWarning = ' The calculated storage does not fit the selected width as one listed tank; compare multiple tanks, a different location or a professionally specified alternative.';
    }
    const recommendedIndex = tanks.findIndex((tank) => tank.capacity === recommended.capacity);
    const alternative = tanks[Math.min(recommendedIndex + 1, tanks.length - 1)];
    const message = `Hello, the tank wizard estimated ${Math.round(calculated).toLocaleString()} litres for a ${property} serving ${people} people for ${days} backup days. Please quote a ${recommended.capacity.toLocaleString()}L tank and the ${alternative.capacity.toLocaleString()}L alternative, including delivery.`;
    result.hidden = false;
    result.innerHTML = `<span class="pill">Planning result</span><h3>Recommended capacity: ${recommended.capacity.toLocaleString()}L</h3><p>Your answers indicate about <strong>${Math.round(calculated).toLocaleString()} litres</strong> of planned storage. The listed indicative tank price is <strong>KSh ${recommended.price.toLocaleString()}</strong>.${spaceWarning}</p><p>Alternative capacity: <a href="${alternative.url}"><strong>${alternative.capacity.toLocaleString()}L</strong></a> at an indicative KSh ${alternative.price.toLocaleString()}.</p><div class="button-row"><a class="btn btn-outline" href="${recommended.url}">View recommended tank</a><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/254755032745?text=${encodeURIComponent(message)}">Request quotation</a></div>`;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
