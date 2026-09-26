const STORAGE_KEY = 'trip-planner-web-v1';
const FIRED_KEY = 'trip-planner-fired-v1';

const categoryDefinitions = {
  flight: {
    name: '비행', icon: '✈️', color: '#4d78c4', title: '항공편 이동',
    fields: [
      ['airline', '항공사', 'text', '예: 대한항공'], ['flightNo', '항공편명', 'text', '예: KE703'],
      ['departure', '출발 공항', 'text', '예: 인천 ICN'], ['arrival', '도착 공항', 'text', '예: 나리타 NRT'],
      ['terminal', '터미널', 'text', '예: 제2터미널'], ['bookingNo', '예약 번호', 'text', '선택 입력']
    ]
  },
  lodging: {
    name: '숙소', icon: '🛏️', color: '#9b6ab8', title: '숙소 체크인',
    fields: [
      ['placeName', '숙소 이름', 'text', '예: 시부야 호텔'], ['bookingNo', '예약 번호', 'text', '선택 입력'],
      ['address', '주소', 'text', '숙소 주소'], ['room', '객실·인원', 'text', '예: 더블룸 · 2명']
    ]
  },
  restaurant: {
    name: '음식점', icon: '🍽️', color: '#ef765f', title: '식사',
    fields: [
      ['subtype', '종류', 'select', [['restaurant','일반 음식점'],['bar','술집·바'],['cafe','카페'],['fast_food','패스트푸드']]],
      ['placeName', '음식점 이름', 'text', '지도에서 선택하거나 직접 입력'],
      ['address', '주소', 'text', '선택한 장소의 주소'], ['reservation', '예약 정보', 'text', '예: 19:00, 2명']
    ], map: true
  },
  subway: {
    name: '지하철', icon: '🚇', color: '#3b9c8a', title: '지하철 이동',
    fields: [
      ['departure', '출발역', 'text', '예: 신주쿠역'], ['arrival', '도착역', 'text', '예: 시부야역'],
      ['line', '노선', 'text', '예: JR 야마노테선'], ['exit', '출구·환승', 'text', '예: 하치코 출구']
    ]
  },
  train: {
    name: '기차', icon: '🚆', color: '#467c9b', title: '기차 이동',
    fields: [
      ['departure', '출발역', 'text', '예: 도쿄역'], ['arrival', '도착역', 'text', '예: 교토역'],
      ['trainNo', '열차·편명', 'text', '예: 노조미 215'], ['seat', '좌석', 'text', '예: 8호차 12A']
    ]
  },
  transport: {
    name: '차량', icon: '🚕', color: '#d99a2b', title: '차량 이동',
    fields: [
      ['transportType', '이동 수단', 'select', [['taxi','택시'],['bus','버스'],['rental','렌터카'],['walk','도보'],['other','기타']]],
      ['departure', '출발지', 'text', '출발 장소'], ['arrival', '도착지', 'text', '도착 장소'],
      ['bookingNo', '예약·차량 정보', 'text', '선택 입력']
    ]
  },
  attraction: {
    name: '관광', icon: '📸', color: '#df8a42', title: '관광지 방문',
    fields: [
      ['placeName', '장소 이름', 'text', '예: 센소지'], ['address', '주소', 'text', '장소 주소'],
      ['ticket', '티켓·예약 정보', 'text', '예: 모바일 티켓'], ['openingHours', '운영 시간', 'text', '예: 09:00–18:00']
    ]
  },
  shopping: {
    name: '쇼핑', icon: '🛍️', color: '#c06587', title: '쇼핑',
    fields: [
      ['placeName', '매장·지역', 'text', '예: 긴자'], ['address', '주소', 'text', '선택 입력'],
      ['shoppingList', '구매 목록', 'text', '예: 기념품, 화장품']
    ]
  },
  other: {
    name: '기타', icon: '📌', color: '#6e827b', title: '새 활동',
    fields: [['placeName', '장소', 'text', '선택 입력'], ['extraInfo', '추가 정보', 'text', '필요한 정보를 입력하세요']]
  }
};

const $ = selector => document.querySelector(selector);
const elements = {
  tripPicker: $('#tripPicker'), tripTitle: $('#tripTitle'), tripPeriod: $('#tripPeriod'),
  summaryDays: $('#summaryDays'), summaryPlans: $('#summaryPlans'), summaryBudget: $('#summaryBudget'),
  dateStrip: $('#dateStrip'), timeline: $('#timeline'), selectedDateCaption: $('#selectedDateCaption'),
  selectedDateTitle: $('#selectedDateTitle'), tripDialog: $('#tripDialog'), activityDialog: $('#activityDialog'),
  mapDialog: $('#mapDialog'), tripForm: $('#tripForm'), activityForm: $('#activityForm'),
  categoryGrid: $('#categoryGrid'), dynamicFields: $('#dynamicFields'), attachmentPreview: $('#attachmentPreview'),
  toast: $('#toast')
};

let state = loadState();
let editingTripId = null;
let editingActivityId = null;
let selectedCategory = 'flight';
let draftPhotos = [];
let draftLinks = [];
let map;
let mapMarker;
let mapSelection = null;

function localDateISO(date) {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

function addDays(date, count) {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function seedState() {
  const start = addDays(new Date(), 14);
  const end = addDays(start, 3);
  const tripId = uid();
  const date = localDateISO(start);
  return {
    currentTripId: tripId,
    selectedDate: date,
    trips: [{
      id: tripId, name: '도쿄 3박 4일', startDate: date, endDate: localDateISO(end),
      activities: [
        { id: uid(), date, category: 'flight', title: '나리타 공항 도착', allDay: false, startTime: '10:30', endTime: '12:45', amount: 420000, currency: 'KRW', reminder: '30', memo: '여권과 Visit Japan QR 확인', details: { airline: '대한항공', flightNo: 'KE703', departure: '인천 ICN', arrival: '나리타 NRT' }, photos: [], links: [] },
        { id: uid(), date, category: 'subway', title: '호텔로 이동', allDay: false, startTime: '13:30', endTime: '14:30', amount: 1200, currency: 'JPY', reminder: '10', memo: '', details: { departure: '나리타 공항역', arrival: '시부야역', line: '나리타 익스프레스' }, photos: [], links: [] },
        { id: uid(), date, category: 'restaurant', title: '시부야 저녁 식사', allDay: false, startTime: '18:30', endTime: '20:00', amount: 6000, currency: 'JPY', reminder: '30', memo: '창가 좌석 요청', details: { subtype: 'restaurant', placeName: '예약한 음식점', address: '시부야' }, photos: [], links: [] }
      ]
    }]
  };
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.trips?.length) return stored;
  } catch (_) {}
  const initial = seedState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast('저장 공간이 부족합니다. 첨부 사진 수를 줄여 주세요.');
    throw error;
  }
}

function currentTrip() {
  return state.trips.find(trip => trip.id === state.currentTripId) || state.trips[0];
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function parseDate(iso) {
  return new Date(`${iso}T12:00:00`);
}

function dateRange(startISO, endISO) {
  const dates = [];
  let cursor = parseDate(startISO);
  const end = parseDate(endISO);
  while (cursor <= end && dates.length < 366) {
    dates.push(localDateISO(cursor));
    cursor = addDays(cursor, 1);
  }
  return dates;
}

function formatCurrency(amount, currency) {
  if (!amount) return '';
  try { return new Intl.NumberFormat('ko-KR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount); }
  catch (_) { return `${currency} ${Number(amount).toLocaleString()}`; }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => elements.toast.classList.remove('show'), 2800);
}

function render() {
  const trip = currentTrip();
  if (!trip) return;
  state.currentTripId = trip.id;
  const dates = dateRange(trip.startDate, trip.endDate);
  if (!dates.includes(state.selectedDate)) state.selectedDate = dates[0];

  elements.tripPicker.innerHTML = state.trips.map(item => `<option value="${item.id}" ${item.id === trip.id ? 'selected' : ''}>${escapeHTML(item.name)}</option>`).join('');
  elements.tripTitle.textContent = trip.name;
  const start = parseDate(trip.startDate);
  const end = parseDate(trip.endDate);
  elements.tripPeriod.textContent = `${start.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' })} – ${end.toLocaleDateString('ko-KR', { month:'long', day:'numeric' })}`;
  elements.summaryDays.textContent = dates.length;
  elements.summaryPlans.textContent = trip.activities.length;

  const currencies = [...new Set(trip.activities.filter(a => Number(a.amount) > 0).map(a => a.currency))];
  if (currencies.length === 1) {
    const total = trip.activities.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    elements.summaryBudget.textContent = formatCurrency(total, currencies[0]);
  } else if (currencies.length > 1) {
    elements.summaryBudget.textContent = '복수 통화';
  } else {
    elements.summaryBudget.textContent = '₩0';
  }

  elements.dateStrip.innerHTML = dates.map((iso, index) => {
    const date = parseDate(iso);
    const hasPlan = trip.activities.some(item => item.date === iso);
    return `<button class="date-card ${iso === state.selectedDate ? 'active' : ''} ${hasPlan ? 'has-plan' : ''}" data-date="${iso}">
      <span>DAY ${index + 1}</span><strong>${date.getDate()}</strong><span>${date.toLocaleDateString('ko-KR', { weekday:'short' })}</span><i class="plan-dot"></i>
    </button>`;
  }).join('');

  const selected = parseDate(state.selectedDate);
  const dayIndex = dates.indexOf(state.selectedDate) + 1;
  elements.selectedDateCaption.textContent = `DAY ${dayIndex} · ${selected.toLocaleDateString('ko-KR', { weekday:'long' }).toUpperCase()}`;
  elements.selectedDateTitle.textContent = selected.toLocaleDateString('ko-KR', { month:'long', day:'numeric' });
  renderTimeline();
  saveState();
}

function activitySubtitle(activity) {
  const d = activity.details || {};
  switch (activity.category) {
    case 'flight': return [d.airline, d.flightNo, d.departure && d.arrival ? `${d.departure} → ${d.arrival}` : ''].filter(Boolean).join(' · ');
    case 'subway': case 'train': case 'transport': return [d.line || d.trainNo || d.transportType, d.departure && d.arrival ? `${d.departure} → ${d.arrival}` : ''].filter(Boolean).join(' · ');
    case 'restaurant': case 'lodging': case 'attraction': case 'shopping': return [d.placeName, d.address].filter(Boolean).join(' · ');
    default: return d.placeName || activity.memo || '상세 정보를 확인하세요';
  }
}

function renderTimeline() {
  const trip = currentTrip();
  const activities = trip.activities.filter(item => item.date === state.selectedDate).sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });
  if (!activities.length) {
    elements.timeline.innerHTML = `<div class="empty-state"><span>🗺️</span><strong>아직 계획이 없어요</strong><p>첫 활동을 추가해 여행의 하루를 채워 보세요.</p></div>`;
    return;
  }
  elements.timeline.innerHTML = activities.map(activity => {
    const category = categoryDefinitions[activity.category] || categoryDefinitions.other;
    const time = activity.allDay ? '종일' : activity.startTime;
    const end = activity.allDay ? '' : activity.endTime;
    const amount = formatCurrency(activity.amount, activity.currency);
    return `<button class="activity-card" data-id="${activity.id}" style="--category-color:${category.color}">
      <span class="activity-time">${escapeHTML(time)}${end ? `<small>– ${escapeHTML(end)}</small>` : ''}</span>
      <i class="activity-dot"></i>
      <span class="activity-body">
        <span class="category-icon">${category.icon}</span>
        <span class="activity-info"><strong>${escapeHTML(activity.title)}</strong><p>${escapeHTML(activitySubtitle(activity))}</p></span>
        <span class="activity-meta"><strong>${escapeHTML(amount)}</strong><span>${category.name}${activity.reminder !== 'none' ? ' · 알림' : ''}</span></span>
      </span>
    </button>`;
  }).join('');
}

function renderCategoryGrid() {
  elements.categoryGrid.innerHTML = Object.entries(categoryDefinitions).map(([key, category]) =>
    `<button type="button" class="category-choice ${key === selectedCategory ? 'active' : ''}" data-category="${key}"><span>${category.icon}</span><strong>${category.name}</strong></button>`
  ).join('');
}

function renderDynamicFields(values = {}) {
  const definition = categoryDefinitions[selectedCategory];
  elements.dynamicFields.innerHTML = definition.fields.map(([key, label, type, option]) => {
    const value = values[key] || '';
    if (type === 'select') {
      return `<div class="field"><label>${label}</label><select data-key="${key}">${option.map(([v, text]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${text}</option>`).join('')}</select></div>`;
    }
    return `<div class="field"><label>${label}</label><input data-key="${key}" value="${escapeHTML(value)}" placeholder="${escapeHTML(option)}"></div>`;
  }).join('') + (definition.map ? `<div class="field"><label>지도 선택</label><button type="button" class="map-pick-button" id="openMapButton">⌖ 지도에서 음식점 찾기</button></div>` : '');
  $('#openMapButton')?.addEventListener('click', openMapDialog);
}

function collectDynamicFields() {
  return [...elements.dynamicFields.querySelectorAll('[data-key]')].reduce((object, input) => {
    object[input.dataset.key] = input.value.trim();
    return object;
  }, {});
}

function openTripDialog(edit = false) {
  const trip = currentTrip();
  editingTripId = edit ? trip.id : null;
  $('#tripDialogTitle').textContent = edit ? '여행 정보 수정' : '새 여행 만들기';
  $('#tripName').value = edit ? trip.name : '';
  $('#tripStart').value = edit ? trip.startDate : localDateISO(new Date());
  $('#tripEnd').value = edit ? trip.endDate : localDateISO(addDays(new Date(), 2));
  $('#deleteTripButton').style.visibility = edit && state.trips.length > 1 ? 'visible' : 'hidden';
  elements.tripDialog.showModal();
}

function openActivityDialog(activity = null) {
  editingActivityId = activity?.id || null;
  selectedCategory = activity?.category || 'flight';
  draftPhotos = structuredClone(activity?.photos || []);
  draftLinks = structuredClone(activity?.links || []);
  $('#activityDialogTitle').textContent = activity ? '계획 수정' : '계획 추가';
  $('#activityTitle').value = activity?.title || categoryDefinitions[selectedCategory].title;
  $('#activityDate').value = activity?.date || state.selectedDate;
  $('#allDay').checked = activity?.allDay || false;
  $('#startTime').value = activity?.startTime || nextSuggestedTime();
  $('#endTime').value = activity?.endTime || addHour($('#startTime').value);
  $('#amount').value = activity?.amount || '';
  $('#currency').value = activity?.currency || 'KRW';
  $('#reminder').value = activity?.reminder ?? 'none';
  $('#memo').value = activity?.memo || '';
  $('#linkInput').value = '';
  $('#deleteActivityButton').style.visibility = activity ? 'visible' : 'hidden';
  renderCategoryGrid();
  renderDynamicFields(activity?.details || {});
  renderAttachments();
  updateTimeInputs();
  elements.activityDialog.showModal();
}

function nextSuggestedTime() {
  const activities = currentTrip().activities.filter(item => item.date === state.selectedDate && !item.allDay && item.endTime).sort((a,b) => b.endTime.localeCompare(a.endTime));
  return activities[0]?.endTime || '09:00';
}

function addHour(time) {
  const [hour, minute] = time.split(':').map(Number);
  return `${String(Math.min(hour + 1, 23)).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
}

function updateTimeInputs() {
  const disabled = $('#allDay').checked;
  $('#startTime').disabled = disabled;
  $('#endTime').disabled = disabled;
}

function renderAttachments() {
  const photos = draftPhotos.map((photo, index) => `<div class="photo-chip"><img src="${photo.data}" alt="첨부 사진"><button type="button" class="chip-remove" data-remove-photo="${index}">×</button></div>`).join('');
  const links = draftLinks.map((link, index) => `<div class="link-chip">🔗 <span>${escapeHTML(link)}</span><button type="button" class="chip-remove" data-remove-link="${index}">×</button></div>`).join('');
  elements.attachmentPreview.innerHTML = photos + links;
}

async function compressImage(file) {
  const dataURL = await new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = dataURL;
  });
  const max = 1200;
  const scale = Math.min(1, max / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return { name: file.name, data: canvas.toDataURL('image/jpeg', .76) };
}

function validWebURL(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; }
  catch (_) { return null; }
}

function initMap() {
  if (map || !window.L) return;
  map = L.map('map').setView([37.5665, 126.9780], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  map.on('click', async event => {
    setMapSelection(event.latlng.lat, event.latlng.lng, '지도에서 선택한 위치', `${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}`);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${event.latlng.lat}&lon=${event.latlng.lng}&accept-language=ko`);
      const result = await response.json();
      setMapSelection(event.latlng.lat, event.latlng.lng, result.name || result.display_name.split(',')[0], result.display_name);
    } catch (_) {}
  });
}

function openMapDialog() {
  mapSelection = null;
  $('#selectedPlaceText').textContent = '아직 선택하지 않았습니다';
  $('#confirmPlaceButton').disabled = true;
  elements.mapDialog.showModal();
  setTimeout(() => { initMap(); map?.invalidateSize(); }, 100);
}

function setMapSelection(lat, lon, name, address) {
  mapSelection = { lat, lon, name, address };
  if (mapMarker) mapMarker.remove();
  mapMarker = L.marker([lat, lon]).addTo(map);
  map.setView([lat, lon], 16);
  $('#selectedPlaceText').textContent = `${name} · ${address}`;
  $('#confirmPlaceButton').disabled = false;
}

async function searchMap() {
  const query = $('#mapSearchInput').value.trim();
  const typeText = $('#placeType').selectedOptions[0].textContent;
  if (!query) return showToast('검색할 지역이나 장소를 입력해 주세요.');
  $('#mapResults').innerHTML = '<p>지도를 검색하고 있습니다…</p>';
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&accept-language=ko&q=${encodeURIComponent(`${query} ${typeText}`)}`;
    const response = await fetch(url, { headers: { 'Accept-Language':'ko' } });
    const results = await response.json();
    if (!results.length) { $('#mapResults').innerHTML = '<p>검색 결과가 없습니다. 지역명을 함께 입력해 보세요.</p>'; return; }
    $('#mapResults').innerHTML = results.map((result, index) => `<button class="map-result" data-result="${index}"><strong>${escapeHTML(result.name || result.display_name.split(',')[0])}</strong><small>${escapeHTML(result.display_name)}</small></button>`).join('');
    [...$('#mapResults').querySelectorAll('[data-result]')].forEach(button => button.addEventListener('click', () => {
      const result = results[Number(button.dataset.result)];
      setMapSelection(Number(result.lat), Number(result.lon), result.name || result.display_name.split(',')[0], result.display_name);
    }));
  } catch (_) {
    $('#mapResults').innerHTML = '<p>지도 검색에 연결할 수 없습니다. 인터넷 연결을 확인하거나 장소를 직접 입력하세요.</p>';
  }
}

function handleTripSubmit(event) {
  event.preventDefault();
  const name = $('#tripName').value.trim();
  const startDate = $('#tripStart').value;
  const endDate = $('#tripEnd').value;
  if (endDate < startDate) return showToast('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
  if (editingTripId) {
    const trip = state.trips.find(item => item.id === editingTripId);
    Object.assign(trip, { name, startDate, endDate });
  } else {
    const trip = { id: uid(), name, startDate, endDate, activities: [] };
    state.trips.push(trip); state.currentTripId = trip.id;
  }
  state.selectedDate = startDate;
  saveState(); render(); elements.tripDialog.close(); showToast('여행 정보를 저장했습니다.');
}

function handleActivitySubmit(event) {
  event.preventDefault();
  const trip = currentTrip();
  const item = {
    id: editingActivityId || uid(), date: $('#activityDate').value, category: selectedCategory,
    title: $('#activityTitle').value.trim(), allDay: $('#allDay').checked,
    startTime: $('#allDay').checked ? '' : $('#startTime').value,
    endTime: $('#allDay').checked ? '' : $('#endTime').value,
    amount: Number($('#amount').value || 0), currency: $('#currency').value,
    reminder: $('#allDay').checked ? 'none' : $('#reminder').value,
    memo: $('#memo').value.trim(), details: collectDynamicFields(), photos: draftPhotos, links: draftLinks
  };
  const index = trip.activities.findIndex(activity => activity.id === item.id);
  if (index >= 0) trip.activities[index] = item; else trip.activities.push(item);
  state.selectedDate = item.date;
  saveState(); render(); elements.activityDialog.close(); showToast(editingActivityId ? '계획을 수정했습니다.' : '다음 활동을 이어서 추가할 수 있어요.');
}

function requestNotifications() {
  if (!('Notification' in window)) return showToast('이 브라우저는 알림을 지원하지 않습니다.');
  Notification.requestPermission().then(permission => {
    $('#notificationButton').textContent = permission === 'granted' ? '✓ 알림 허용됨' : '♧ 알림 허용';
    showToast(permission === 'granted' ? '브라우저를 열어 둔 동안 일정 알림을 받을 수 있습니다.' : '알림 권한이 허용되지 않았습니다.');
  });
}

function checkReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const fired = JSON.parse(localStorage.getItem(FIRED_KEY) || '{}');
  const now = Date.now();
  state.trips.forEach(trip => trip.activities.forEach(activity => {
    if (activity.allDay || activity.reminder === 'none' || fired[activity.id]) return;
    const start = new Date(`${activity.date}T${activity.startTime}:00`).getTime();
    const due = start - Number(activity.reminder) * 60000;
    if (now >= due && now - due < 60000) {
      new Notification(activity.title, { body: `${trip.name} · ${activity.startTime} 시작`, icon: 'assets/icon.svg', tag: activity.id });
      fired[activity.id] = new Date().toISOString();
    }
  }));
  localStorage.setItem(FIRED_KEY, JSON.stringify(fired));
}

function bindEvents() {
  $('#newTripButton').addEventListener('click', () => openTripDialog(false));
  $('#openTripManager').addEventListener('click', () => openTripDialog(true));
  $('#headerAddButton').addEventListener('click', () => openActivityDialog());
  $('#dayAddButton').addEventListener('click', () => openActivityDialog());
  $('#addNextButton').addEventListener('click', () => openActivityDialog());
  $('#notificationButton').addEventListener('click', requestNotifications);
  $('#datePrev').addEventListener('click', () => elements.dateStrip.scrollBy({ left:-300, behavior:'smooth' }));
  $('#dateNext').addEventListener('click', () => elements.dateStrip.scrollBy({ left:300, behavior:'smooth' }));
  elements.tripPicker.addEventListener('change', event => { state.currentTripId = event.target.value; state.selectedDate = currentTrip().startDate; render(); });
  elements.dateStrip.addEventListener('click', event => { const button = event.target.closest('[data-date]'); if (button) { state.selectedDate = button.dataset.date; render(); } });
  elements.timeline.addEventListener('click', event => { const card = event.target.closest('[data-id]'); if (card) openActivityDialog(currentTrip().activities.find(item => item.id === card.dataset.id)); });
  elements.tripForm.addEventListener('submit', handleTripSubmit);
  elements.activityForm.addEventListener('submit', handleActivitySubmit);
  $('#allDay').addEventListener('change', updateTimeInputs);
  elements.categoryGrid.addEventListener('click', event => {
    const button = event.target.closest('[data-category]'); if (!button) return;
    selectedCategory = button.dataset.category;
    $('#activityTitle').value = categoryDefinitions[selectedCategory].title;
    renderCategoryGrid(); renderDynamicFields();
  });
  $('#photoInput').addEventListener('change', async event => {
    const files = [...event.target.files].slice(0, Math.max(0, 6 - draftPhotos.length));
    showToast('사진을 저장하기 좋은 크기로 처리하고 있어요.');
    for (const file of files) { try { draftPhotos.push(await compressImage(file)); } catch (_) {} }
    renderAttachments(); event.target.value = '';
  });
  $('#addLinkButton').addEventListener('click', () => {
    const link = validWebURL($('#linkInput').value.trim());
    if (!link) return showToast('http 또는 https로 시작하는 링크를 입력해 주세요.');
    draftLinks.push(link); $('#linkInput').value = ''; renderAttachments();
  });
  elements.attachmentPreview.addEventListener('click', event => {
    const photo = event.target.closest('[data-remove-photo]');
    const link = event.target.closest('[data-remove-link]');
    if (photo) draftPhotos.splice(Number(photo.dataset.removePhoto), 1);
    if (link) draftLinks.splice(Number(link.dataset.removeLink), 1);
    renderAttachments();
  });
  $('#deleteActivityButton').addEventListener('click', () => {
    if (!editingActivityId || !confirm('이 활동을 삭제할까요?')) return;
    const trip = currentTrip(); trip.activities = trip.activities.filter(item => item.id !== editingActivityId);
    saveState(); render(); elements.activityDialog.close(); showToast('활동을 삭제했습니다.');
  });
  $('#deleteTripButton').addEventListener('click', () => {
    if (state.trips.length <= 1 || !confirm('이 여행과 모든 활동을 삭제할까요?')) return;
    state.trips = state.trips.filter(item => item.id !== editingTripId);
    state.currentTripId = state.trips[0].id; state.selectedDate = state.trips[0].startDate;
    saveState(); render(); elements.tripDialog.close(); showToast('여행을 삭제했습니다.');
  });
  $('#mapSearchButton').addEventListener('click', searchMap);
  $('#mapSearchInput').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); searchMap(); } });
  $('#confirmPlaceButton').addEventListener('click', () => {
    if (!mapSelection) return;
    const name = elements.dynamicFields.querySelector('[data-key="placeName"]');
    const address = elements.dynamicFields.querySelector('[data-key="address"]');
    if (name) name.value = mapSelection.name;
    if (address) address.value = mapSelection.address;
    elements.mapDialog.close(); showToast('지도에서 선택한 장소를 입력했습니다.');
  });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));
}

function init() {
  bindEvents(); render();
  if ('Notification' in window && Notification.permission === 'granted') $('#notificationButton').textContent = '✓ 알림 허용됨';
  setInterval(checkReminders, 20000); checkReminders();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
}

init();
