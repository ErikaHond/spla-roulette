//ローディング画面を取得
const loading = document.querySelector(".loading");

//ページの読み込み完了時に処理を実行
window.addEventListener("load", async () => {
    // 武器データの読み込み完了を待つ
    await loadWeapons();
    // ローディング画面を非表示にする
    loading.classList.add("loaded");
});

// ====================
// 武器ロード
// ====================
async function loadWeapons(){
  const response = await fetch("https://stat.ink/api/v3/weapon");
  const data = await response.json();

  weapons = data.map(w => ({
    name:w.name?.ja_JP ?? "不明",
    type:w.type?.name?.ja_JP ?? "不明",
    sub:w.sub?.name?.ja_JP ?? "不明",
    special:w.special?.name?.ja_JP ?? "不明"
  }));

  initFilters();
}

// ====================
// フィルター設定
// ====================
const filters = [
  {
    key:"type",
    label:"ブキ",
    tabLabel:"ブキ種",
    selectId:"typeSelect"
  },
  {
    key:"sub",
    label:"サブ",
    tabLabel:"サブ",
    selectId:"subSelect"
  },
  {
    key:"special",
    label:"スペシャル",
    tabLabel:"スペシャル",
    selectId:"specialSelect"
  }
];

// ====================
// ギア設定
// ====================
const gears = {
  "common":[
    "メインインク効率アップ",
    "スペシャル減少量ダウン",
    "サブ性能アップ",
    "スーパージャンプ時間短縮",
    "インク回復量アップ",
    "相手インク影響軽減",
    "サブインク効率アップ",
    "ヒト移動速度アップ",
    "スペシャル性能アップ",
    "イカ移動速度アップ",
    "スペシャル増加量アップ",
    "復活時間短縮",
    "アクション強化",
    "サブ影響軽減"
  ],
  "head":[
    "ラストスパート",
    "スタートダッシュ",
    "カムバック",
    "逆境強化"
  ],
  "clothing":[
    "イカニンジャ",
    "復活ペナルティアップ",
    "リベンジ",
    "サーマルインク"
  ],
  "shoes":[
    "対物攻撃力アップ",
    "ステルスジャンプ",
    "受け身術"
  ]
};

// ====================
// 武器データ
// ====================
let weapons = [];


// ====================
// 現在タブ
// ====================
let currentFilter = filters[0];


// ====================
// ギア絞り込みON/OFF
// ====================
const gearToggle = document.getElementById("gearToggle");


// ====================
// 絞り込みON/OFF
// ====================
const filterToggle = document.getElementById("filterToggle");

// 絞り込み変更時
filterToggle.addEventListener("change", () => {
  const isEnabled = filterToggle.checked;
  // 絞り込み条件表示切替
  document.getElementById("filterArea").style.display = isEnabled ? "block" : "none";
});


// ====================
// タブ生成
// ====================
const tabs = document.getElementById("tabs");
tabs.classList.add("tabs");
filters.forEach((filter, index) => {
  tabs.innerHTML += `<button class="${index === 0 ? "active" : ""}" onclick="showTab('${filter.key}Tab', '${filter.key}', event)">${filter.label}</button>`;
});


// ====================
// タブ中身生成
// ====================
const tabContents = document.getElementById("tabContents");
filters.forEach((filter, index) => {
  tabContents.innerHTML += `<div id="${filter.key}Tab" class="tab ${index === 0 ? "active" : ""}">
      <div class="label">${filter.tabLabel}絞り込み</div>
      <select id="${filter.selectId}"></select>
    </div>`;
});

// ====================
// select初期化
// ====================
function initFilters(){
  filters.forEach(filter => {
    createOptions(filter.selectId,[...new Set(weapons.map(w => w[filter.key]))]);
  });
}


// ====================
// option生成
// ====================
function createOptions(selectId, items){
  const select = document.getElementById(selectId);

  items.forEach(item => {
    select.innerHTML += `<option value="${item}">${item}</option>`;
  });
}


// ====================
// タブ切り替え
// ====================
function showTab(tabId, key, event){

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tabs button").forEach(button => {
    button.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
  currentFilter = filters.find(f => f.key === key);
}


// ====================
// 抽選スタート
// ====================
function rollCurrent(){
  const isGearEnabled = gearToggle.checked;     // ギアランダムON/OFF取得
  const isFilterEnabled = filterToggle.checked; // 絞り込みON/OFF取得

  // ギアランダムONの場合
  if(isGearEnabled){
    document.getElementById("gearHead").textContent = getGear("head");
    document.getElementById("gearClothing").textContent = getGear("clothing");
    document.getElementById("gearShoes").textContent = getGear("shoes");
    document.getElementById("gearArea").style.display = "block";
  }else{
    // ギアランダムOFFの場合、非表示
    document.getElementById("gearArea").style.display = "none";
  }

  let filtered = weapons; // ブキ一覧設定

  // 絞り込みONの場合
  if(isFilterEnabled){
    const value = document.getElementById(currentFilter.selectId).value;  // ID取得
    if(value){
      filtered = weapons.filter(w => w[currentFilter.key] === value);
    }
  }
  const weapon = filtered[Math.floor(Math.random() * filtered.length)];

  document.getElementById("weaponName").textContent = weapon.name;  // ブキ名設定
  document.getElementById("subName").textContent = "サブ : " + weapon.sub;  // サブ名設定
  document.getElementById("specialName").textContent = "スペシャル : " + weapon.special;  // スペシャル名設定

  // 結果表示
  document.getElementById("result").style.display = "block";
}


// ====================
// ギア抽選
// ====================
function getGear(category){
    const gearList = [...gears.common,...gears[category]];
    return gearList[Math.floor(Math.random() * gearList.length)];
}
