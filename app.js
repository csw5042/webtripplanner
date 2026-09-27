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

const tokyoRestaurants = [
  { area:'메구로', name:'리베라 스테이크 하우스', channel:'추성훈', food:'철판 스테이크 · 라이스', pick:'추성훈 스테이크 또는 1파운드 스테이크', taste:'두툼한 고기를 레어에 가깝게 구워 뜨거운 철판에 냅니다. 녹은 버터의 고소함이 강하고, 특제소스는 짠 편이라 조금씩 찍어 먹는 편이 좋습니다.', address:'6-17-20 Shimomeguro, Meguro City, Tokyo', video:'https://www.youtube.com/watch?v=hGNTB6Vucrk' },
  { area:'신주쿠', name:'스시 하츠메', channel:'동네친구 강나미 · 대성 편', food:'스시 오마카세', pick:'도미 · 광어 다시마 절임 · 새우 · 곶감 디저트', taste:'가정집처럼 편안한 분위기입니다. 생선 맛이 깔끔하고 가격 대비 구성이 좋으며 마지막 곶감 디저트가 별미입니다.', address:'Nishimura Building B1F, 7-10-10 Nishishinjuku, Shinjuku City, Tokyo' },
  { area:'니혼바시', name:'돈카츠 하지메 하나레', channel:'동네친구 강나미', food:'두꺼운 돈카츠', pick:'아츠기리 돈카츠 · 프리미엄 돈카츠', taste:'튀김옷은 바삭하고 고기는 두껍고 촉촉합니다. 돼지기름에서 은은한 단맛이 납니다.', address:'UNO Building, 1-11-15 Nihonbashimuromachi, Chuo City, Tokyo' },
  { area:'니혼바시', name:'이시야 니혼바시', channel:'동네친구 강나미 · 이상화 편', food:'팬케이크 · 파르페', pick:'딸기 팬케이크 · 흰 파르페', taste:'팬케이크는 달걀 풍미가 진하고 표면에서 달고나 같은 캐러멜 맛이 납니다.', address:'COREDO Muromachi Terrace 1F, 3-2-1 Nihonbashimuromachi, Chuo City, Tokyo' },
  { area:'니혼바시', name:'에이타로 니혼바시 총본점', channel:'동네친구 강나미 · 이상화 편', food:'모찌 · 화과자', pick:'인절미 모찌 · 쑥 앙금 모찌', taste:'모찌가 무겁지 않고 매우 부드러우며 푸딩처럼 녹는 식감입니다.', address:'1-2-8 Nihonbashi, Chuo City, Tokyo' },
  { area:'도쿄역', name:'프레스 버터 샌드 다이마루 도쿄점', channel:'동네친구 강나미 · 이상화 편', food:'버터 크림 샌드 쿠키', pick:'피스타치오 · 바닐라', taste:'쿠키는 바삭하고 안쪽 버터크림은 진합니다. 피스타치오 향이 강하고 고급스러워 선물용으로 좋습니다.', address:'Daimaru Tokyo B1F, 1-9-1 Marunouchi, Chiyoda City, Tokyo' },
  { area:'긴자', name:'긴자 센비키야', channel:'동네친구 강나미 · 이상화 편', food:'과일 파르페 · 과일 샌드위치', pick:'멜론 파르페 · 과일 샌드위치', taste:'과일 자체의 당도와 향이 강합니다. 멜론 파르페는 과육이 부드럽고 입에서 녹는다는 평가로 영상 내 최상위 추천입니다.', address:'5-5-1 Ginza, Chuo City, Tokyo' },
  { area:'긴자', name:'히가시야 긴자', channel:'동네친구 강나미 · 이상화 편', food:'화과자 · 모찌 · 몽블랑', pick:'하얀 딸기 모찌 · 몽블랑', taste:'딸기와 앙금, 떡의 비율이 좋고 지나치게 달지 않습니다. 몽블랑은 밤 풍미가 진합니다.', address:'POLA Ginza Building 2F, 1-7-7 Ginza, Chuo City, Tokyo' },
  { area:'츠키지', name:'스시잔마이 츠키지점', channel:'동네친구 강나미 · 대성 편', food:'참치 스시', pick:'아카미 · 주도로 · 아부리 · 네기도로', taste:'참치가 신선하고 부위별 지방 맛 차이가 분명합니다. 아부리는 불향과 기름진 맛이 강합니다.', address:'4-11-9 Tsukiji, Chuo City, Tokyo' },
  { area:'아사쿠사', name:'후르츠 팔러 고토', channel:'동네친구 강나미 · 이상화 편', food:'과일 샌드위치 · 파르페', pick:'생크림 딸기 샌드위치', taste:'빵이 촉촉하고 크림이 가벼워 딸기의 새콤달콤한 맛을 가리지 않습니다.', address:'2-15-4 Asakusa, Taito City, Tokyo' },
  { area:'아사쿠사', name:'가마쿠라 스위츠 아사쿠사 가미나리몬점', channel:'동네친구 강나미 · 이상화 편', food:'와라비모찌', pick:'말차 와라비모찌 아이스크림', taste:'말차 향이 진하고 와라비모찌는 매우 부드럽습니다. 바삭한 토핑과 차가운 아이스크림의 대비가 좋습니다.', address:'1-20-2 Asakusa, Taito City, Tokyo' },
  { area:'아사쿠사', name:'아사쿠사 기비당고 아즈마', channel:'동네친구 강나미 · 이상화 편', food:'기비당고', pick:'콩가루 기비당고 · 사쿠라 당고', taste:'한국 떡보다 훨씬 부드럽고 쫀득합니다. 콩가루는 고소하고 사쿠라 당고는 은은한 꽃향과 단맛이 납니다.', address:'1-18-1 Asakusa, Taito City, Tokyo' },
  { area:'아사쿠사', name:'우시미츠 아사쿠사', channel:'동네친구 강나미', food:'소고기 히츠마부시', pick:'고기 히츠마부시', taste:'고기와 밥으로 시작해 산초를 더하거나 육수를 부어 오차즈케로 마무리합니다. 진한 고기 맛을 여러 방식으로 즐길 수 있습니다.', address:'1-2-10 Hanakawado, Taito City, Tokyo' }
];

const convenienceFoods = [
  { store:'패밀리마트', note:'크림 디저트 강점', items:[['더블 크림 슈','생크림과 커스터드가 가득하지만 덜 느끼합니다. 얼리면 아이스크림 같은 식감.'],['단호박 몽블랑 푸딩','부드러운 무스 같은 식감과 자연스러운 단맛. 시즌 한정 가능.'],['더블 휘핑·커스터드 빵','폭신한 빵, 가벼운 휘핑과 진한 커스터드 조합.'],['유키미 다이후쿠','쫀득한 찹쌀떡 안 바닐라 아이스크림.'],['크림&커피 젤리','쌉싸름한 커피 젤리와 달콤한 우유 크림의 균형.']] },
  { store:'로손', note:'롤케이크와 핫스낵', items:[['모찌 식감 롤','쫀득하고 부드러운 빵과 진한 우유 크림.'],['가라아게군','따뜻하고 짭짤한 한입 닭튀김. 오리지널·레드·치즈 등.'],['와라비모찌','매우 부드러운 떡과 콩가루·흑당의 고소한 단맛.'],['자가리코','단단하고 바삭한 감자 스틱. 이동 간식이나 맥주 안주.']] },
  { store:'세븐일레븐', note:'즉석 스무디 추천', items:[['그린 스무디','냉동 컵을 매장에서 바로 갈아 마십니다. 가볍고 상쾌한 맛.'],['베리베리 요거트 스무디','베리의 새콤달콤함과 요거트 산미가 강한 디저트 타입.'],['초코바나나 크레이프','바나나·초콜릿·크림이 들어가 달고 든든합니다.']] },
  { store:'미니스톱·기타', note:'시즌 상품 확인', items:[['대만 꿀고구마 소프트','따뜻하고 녹진한 고구마와 차가운 소프트아이스크림.'],['우유 푸딩','매끄럽고 진한 우유 맛.'],['카페오레 아이스크림','달콤하고 부드러운 우유커피 맛.'],['모찌 슈크림','겉은 쫀득하고 속은 달콤한 슈크림.']] }
];

const marketGroups = [
  { name:'도시락·즉석요리', note:'저녁 또는 야식', items:[['치킨난반','달콤한 간장소스 닭튀김과 타르타르 조합. 최우선 추천.'],['구운 연어 도시락','기름진 연어와 짭짤한 껍질 맛.'],['명란 파스타','명란 맛이 진하고 시소 향이 뒷맛을 정리.'],['가츠산도','부드러운 식빵, 두꺼운 돈가스와 달콤짭짤한 소스.'],['게살 크림 고로케·굴튀김','바삭한 튀김옷과 크리미하거나 촉촉한 속.'],['군고구마+바닐라','따뜻함과 차가움이 대비되는 강나미 최애 디저트.']] },
  { name:'우동·면류', note:'숙소 간편식', items:[['히모카와 우동','아주 넓고 미끄러우며 쫀득한 면.'],['매실 키시멘','납작한 면과 매실의 새콤한 맛.'],['낫토+김치 냉우동','고소한 낫토와 김치의 매콤한 산미.'],['혼쯔유 자루우동','차갑고 탱글한 면과 진한 쯔유.'],['닛신 돈베이 유부우동','달콤한 유부와 진한 가쓰오 다시.'],['바몬드 카레 우동','사과와 꿀 계열의 부드러운 카레 맛.']] },
  { name:'빵·푸딩·아이스크림', note:'아침과 디저트', items:[['나메라카 푸딩','아주 매끄럽고 크리미한 커스터드.'],['런치팩 햄&마요','부드러운 식빵 속 짭짤한 햄과 마요.'],['나이스 스틱','길고 부드러운 빵과 달콤한 밀크크림.'],['더블 소프트 식빵','두껍고 폭신하며 구우면 겉바속촉.'],['가리가리군','얼음 알갱이가 씹히는 소다 아이스바.'],['아이스만주','팥앙금과 밀크 아이스크림의 묵직한 단맛.']] },
  { name:'과자·안주', note:'기념품 후보', items:[['훈와리메이진 콩가루모찌','입에서 녹는 가벼운 식감과 진한 콩가루 맛.'],['해피턴','달고 짠 조미 분말이 듬뿍 묻은 쌀과자.'],['큐슈 간장맛 감자칩','달콤하고 감칠맛 강한 간장 감자칩.'],['우마이봉','속이 빈 옥수수 스낵, 맛별 양념이 선명.'],['컨트리맘','겉은 살짝 바삭하고 속은 촉촉한 쿠키.'],['치타라','어육포 사이 치즈가 든 짭짤한 술안주.']] },
  { name:'돈키호테 식품', note:'마지막 날 쇼핑', items:[['복숭아 모둠 곤약젤리','탱글한 식감과 진한 복숭아 향.'],['간장계란밥 소스','밥과 날달걀에 조금 넣는 달콤짭짤한 다시 간장.'],['대용량 라유','마늘·양파의 고소함이 있는 매콤한 고추기름.'],['튀김 스낵','바삭하고 짭짤한 일본식 안주 과자.'],['논알코올 맥주','맥주의 쌉싸름한 향을 살린 무알코올 음료.']] }
];

const guideSources = [
  ['동네친구 강나미','도쿄 현지인 맛집','https://menuham.site/course/33'], ['동네친구 강나미','대성과 도쿄 스시 투어','https://menuham.site/course/20'],
  ['동네친구 강나미','이상화와 도쿄 디저트 투어','https://menuham.site/course/19'], ['동네친구 강나미','일본 마트 도시락 17종','https://www.youtube.com/watch?v=0mPjZA4Jvzw'],
  ['동네친구 강나미','일본 마트 우동','https://www.youtube.com/watch?v=Ul_npvOuKpA'], ['동네친구 강나미','일본 마트 과자','https://www.youtube.com/watch?v=UfLDYel8EhY'],
  ['동네친구 강나미','마트 빵·푸딩·아이스크림','https://www.youtube.com/watch?v=Av4r1TFd6FY'], ['동네친구 강나미','돈키호테 쇼핑','https://www.youtube.com/watch?v=1c7_NYeUF1g'],
  ['추성훈','리베라 스테이크','https://www.youtube.com/watch?v=hGNTB6Vucrk'], ['추성훈','가족 편의점 투어','https://www.youtube.com/watch?v=5NNwuVKqXGk'],
  ['추성훈','제이홉 편의점 디저트','https://www.youtube.com/watch?v=uSdMsyfPIOQ'], ['추성훈','박진영 미야코지마 편의점','https://www.youtube.com/watch?v=f8nPmW76EjE']
];

let restaurantFilter = '전체';

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

function renderGuide() {
  const areas = ['전체', ...new Set(tokyoRestaurants.map(item => item.area))];
  $('#restaurantFilters').innerHTML = areas.map(area => `<button class="filter-chip ${area === restaurantFilter ? 'active' : ''}" data-area="${area}">${area}</button>`).join('');
  renderRestaurantCards();
  $('#convenienceGrid').innerHTML = convenienceFoods.map(group => foodGroupHTML(group)).join('');
  const priorities = ['치킨난반','구운 연어 도시락','명란 파스타','가츠산도','훈와리메이진','나메라카 푸딩','군고구마+바닐라','혼쯔유 자루우동','런치팩 햄&마요','해피턴·간장 감자칩'];
  $('#marketPriority').innerHTML = priorities.map((item, index) => `<span class="market-pick"><b>${index + 1}</b>${item}</span>`).join('');
  $('#marketGrid').innerHTML = marketGroups.map(group => foodGroupHTML(group)).join('');
  $('#sourceGrid').innerHTML = guideSources.map(([channel, title, url]) => `<a class="source-card" href="${url}" target="_blank" rel="noopener"><div><strong>${escapeHTML(title)}</strong><small>${escapeHTML(channel)}</small></div><span>↗</span></a>`).join('');
}

function foodGroupHTML(group) {
  return `<article class="food-group"><header><strong>${escapeHTML(group.store || group.name)}</strong><small>${escapeHTML(group.note)}</small></header><ol>${group.items.map((item, index) => `<li><strong><span class="rank">${index + 1}</span>${escapeHTML(item[0])}</strong><p>${escapeHTML(item[1])}</p></li>`).join('')}</ol></article>`;
}

function renderRestaurantCards() {
  const query = ($('#restaurantSearch')?.value || '').trim().toLowerCase();
  const filtered = tokyoRestaurants.filter(item => {
    const areaMatch = restaurantFilter === '전체' || item.area === restaurantFilter;
    const queryMatch = !query || [item.name, item.area, item.food, item.pick, item.channel].join(' ').toLowerCase().includes(query);
    return areaMatch && queryMatch;
  });
  $('#restaurantGrid').innerHTML = filtered.length ? filtered.map(item => {
    const index = tokyoRestaurants.indexOf(item) + 1;
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.address}`)}`;
    return `<article class="restaurant-card"><span class="place-index">${String(index).padStart(2,'0')}</span><div><span class="place-meta">${escapeHTML(item.area)} · ${escapeHTML(item.channel)}</span><h3>${escapeHTML(item.name)}</h3><p><span class="recommend">대표 음식</span>${escapeHTML(item.food)}<br><span class="recommend">추천</span>${escapeHTML(item.pick)}</p><p>${escapeHTML(item.taste)}</p><footer><address title="${escapeHTML(item.address)}">${escapeHTML(item.address)}</address><a class="map-link" href="${maps}" target="_blank" rel="noopener">지도 ↗</a></footer></div></article>`;
  }).join('') : '<div class="empty-state"><strong>조건에 맞는 맛집이 없습니다.</strong><p>지역 필터나 검색어를 바꿔 보세요.</p></div>';
}

function switchView(view) {
  const guide = view === 'guide';
  $('#plannerView').hidden = guide;
  $('#guideView').hidden = !guide;
  $('#showPlannerView').classList.toggle('active', !guide);
  $('#showGuideView').classList.toggle('active', guide);
  if (guide) renderGuide();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function makeTokyoActivity(date, startTime, title, category = 'attraction', details = {}) {
  return { id:uid(), date, category, title, allDay:false, startTime, endTime:addHour(startTime), amount:0, currency:'JPY', reminder:'none', memo:'', details, photos:[], links:[] };
}

function createTokyoPreset() {
  const existing = state.trips.find(trip => trip.template === 'tokyo-2026-5n6d');
  if (existing) {
    state.currentTripId = existing.id; state.selectedDate = existing.startDate; saveState(); render(); switchView('planner');
    return showToast('이미 담아 둔 도쿄 일정을 열었습니다.');
  }
  const a = [];
  const add = (date, time, title, category, details) => a.push(makeTokyoActivity(date, time, title, category, details));
  add('2026-10-11','10:00','나리타공항 도착','flight',{ departure:'인천 ICN', arrival:'나리타 NRT' });
  add('2026-10-11','12:10','스카이라이너 → 게이세이 우에노','train',{ departure:'나리타공항역', arrival:'게이세이 우에노역', trainNo:'Keisei Skyliner', seat:'전 좌석 지정' });
  add('2026-10-11','13:00','호텔 이동 · 짐 보관','lodging',{ placeName:'토세이 호텔 코코네 우에노', address:'우에노' });
  add('2026-10-11','14:00','아메요코 상점가','shopping',{ placeName:'아메요코', address:'우에노' });
  add('2026-10-11','16:00','우에노공원 산책','attraction',{ placeName:'우에노공원' });
  add('2026-10-11','20:00','아나야 긴자','restaurant',{ placeName:'아나야 긴자', address:'긴자' });
  add('2026-10-12','09:00','메이지신궁','attraction',{ placeName:'메이지신궁' });
  add('2026-10-12','10:30','오모테산도 · 캣스트리트','shopping',{ placeName:'오모테산도' });
  add('2026-10-12','13:30','국립신미술관','attraction',{ placeName:'국립신미술관', ticket:'필수 방문' });
  add('2026-10-12','16:30','시부야 스크램블 교차로','attraction',{ placeName:'시부야 스크램블 교차로' });
  add('2026-10-12','17:30','시부야 스카이','attraction',{ placeName:'시부야 스카이', ticket:'일몰 시간 예약 권장' });
  add('2026-10-13','08:00','츠키지 장외시장','attraction',{ placeName:'츠키지 장외시장' });
  add('2026-10-13','10:30','긴자 거리 · GINZA SIX','shopping',{ placeName:'긴자' });
  add('2026-10-13','12:30','스시잔마이 츠키지점','restaurant',{ placeName:'스시잔마이 츠키지점', address:'4-11-9 Tsukiji, Tokyo' });
  add('2026-10-13','14:00','teamLab Borderless','attraction',{ placeName:'teamLab Borderless', ticket:'사전 예약' });
  add('2026-10-13','17:30','도쿄역 · 마루노우치 야경','attraction',{ placeName:'도쿄역 마루노우치' });
  add('2026-10-14','08:30','호텔 조식','restaurant',{ placeName:'호텔' });
  add('2026-10-14','09:30','신주쿠 이동 · 짐 보관','subway',{ departure:'우에노', arrival:'신주쿠' });
  add('2026-10-14','10:30','산토리 맥주공장 투어','attraction',{ placeName:'산토리 맥주공장', ticket:'예약 확인' });
  add('2026-10-14','15:00','신주쿠교엔','attraction',{ placeName:'신주쿠교엔' });
  add('2026-10-14','17:00','도쿄도청 전망대','attraction',{ placeName:'도쿄도청 전망대', ticket:'무료' });
  add('2026-10-14','18:30','가부키초 · 오모이데요코초','attraction',{ placeName:'가부키초' });
  add('2026-10-15','08:30','센소지','attraction',{ placeName:'센소지' });
  add('2026-10-15','10:30','나카미세 거리','shopping',{ placeName:'나카미세 거리' });
  add('2026-10-15','12:00','우시미츠 아사쿠사','restaurant',{ placeName:'우시미츠 아사쿠사', address:'1-2-10 Hanakawado, Tokyo' });
  add('2026-10-15','13:00','도쿄 스카이트리','attraction',{ placeName:'도쿄 스카이트리', ticket:'전망대 선택' });
  add('2026-10-15','16:00','아키하바라 전자상가','shopping',{ placeName:'아키하바라' });
  add('2026-10-16','10:00','체크아웃 · 짐 보관','lodging',{ placeName:'토세이 호텔 코코네 우에노' });
  add('2026-10-16','10:30','우에노공원 또는 야나카 산책','attraction',{ placeName:'우에노공원' });
  add('2026-10-16','13:00','아메요코 마지막 쇼핑','shopping',{ placeName:'아메요코' });
  add('2026-10-16','16:00','스카이라이너 → 나리타공항','train',{ departure:'게이세이 우에노역', arrival:'나리타공항역', trainNo:'Keisei Skyliner' });
  add('2026-10-16','19:55','나리타공항 출발','flight',{ departure:'나리타 NRT', arrival:'인천 ICN' });
  const trip = { id:uid(), template:'tokyo-2026-5n6d', name:'도쿄 5박 6일 · 2026 가을', startDate:'2026-10-11', endDate:'2026-10-16', activities:a };
  state.trips.push(trip); state.currentTripId = trip.id; state.selectedDate = trip.startDate;
  saveState(); render(); switchView('planner'); showToast('도쿄 5박 6일 일정을 새 여행으로 담았습니다.');
}

function bindEvents() {
  $('#showPlannerView').addEventListener('click', () => switchView('planner'));
  $('#showGuideView').addEventListener('click', () => switchView('guide'));
  $('#importTokyoTrip').addEventListener('click', createTokyoPreset);
  $('#restaurantFilters').addEventListener('click', event => {
    const button = event.target.closest('[data-area]'); if (!button) return;
    restaurantFilter = button.dataset.area; renderGuide();
  });
  $('#restaurantSearch').addEventListener('input', renderRestaurantCards);
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    $('#lightboxImage').src = button.dataset.lightbox; $('#imageDialog').showModal();
  }));
  $('#closeImageDialog').addEventListener('click', () => $('#imageDialog').close());
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
