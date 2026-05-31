//レンジスライダー
const MIN_LABELS = ["0", "501", "1001", "2001", "3001", "4001", "5001"];
const MAX_LABELS = ["0", "500", "1000", "2000", "3000", "4000", "上限なし"];

const STEP_COUNT = MIN_LABELS.length - 1;

const minInput = document.getElementById("price-min");
const maxInput = document.getElementById("price-max");
const minLabel = document.getElementById("price-min-label");
const maxLabel = document.getElementById("price-max-label");
const fillEl = document.getElementById("price-range-fill");


//％変換
function indexToPercent(index) {
    return (index / STEP_COUNT) * 100;
}

//左右の余白更新
function updateFill(minIndex, maxIndex) {
    const left = indexToPercent(minIndex);
    const right = 100 - indexToPercent(maxIndex);
    fillEl.style.setProperty("--fill-left", `${left}%`);
    fillEl.style.setProperty("--fill-right", `${right}%`);
}

//画面上ラベルの更新
function updateLabels(minIndex, maxIndex) {
    
    minLabel.textContent = MIN_LABELS[minIndex] + "円";
    
    if (maxIndex == 6) {
        maxLabel.textContent = MAX_LABELS[maxIndex];
    } else {
        maxLabel.textContent = MAX_LABELS[maxIndex] + "円";
    }


}


//minを動かした場合の処理
function syncFromMin() {
    //数値変換
    let minIndex = Number(minInput.value);
    let maxIndex = Number(maxInput.value);

    if (minIndex >= maxIndex) {
        minIndex = maxIndex - 1;
    }
    if (minIndex < 0) {
        minIndex = 0;
    }

    minInput.value = String(minIndex);
    maxInput.value = String(maxIndex);
    updateLabels(minIndex, maxIndex);
    updateFill(minIndex, maxIndex);
}

//maxを動かした場合の処理
function syncFromMax() {
    let minIndex = Number(minInput.value);
    let maxIndex = Number(maxInput.value);

    if (maxIndex <= minIndex) {
        maxIndex = minIndex + 1;
    }
    if (maxIndex > STEP_COUNT) {
        maxIndex = STEP_COUNT;
    }

    minInput.value = String(minIndex);
    maxInput.value = String(maxIndex);
    updateLabels(minIndex, maxIndex);
    updateFill(minIndex, maxIndex);
}

function resetPriceSlider() {
    minInput.value = "0";
    maxInput.value = "6";
    updateLabels(0, STEP_COUNT);
    updateFill(0, STEP_COUNT);
}

if (minInput && maxInput) {
    minInput.addEventListener("input", syncFromMin);
    maxInput.addEventListener("input", syncFromMax);
    resetPriceSlider();
}


//住所検索
async function searchAddress() {
    const postalCode = document.getElementById("searchBox").value;
    const url = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + postalCode;
    const response = await fetch(url);
    const data = await response.json();
    if (!(data['results'])) {
        document.getElementById("check").innerHTML = '該当データがありません';
    } else {
        const result = data['results'][0];
        document.getElementById("address-prefecture").value = result['address1'];
        document.getElementById("address-city").value = result['address2'] + result['address3'];
        document.getElementById("check").innerHTML = '';
    }
}

function inputCheck() {
    const inputValue = document.getElementById("searchBox").value;
    if (!(inputValue.match(/^[0-9]+$/)) || !(inputValue.length === 7)) {
        document.getElementById("check").innerHTML = '半角数字7桁で入力してください！';
    } else {
        document.getElementById("check").innerHTML = '';
    }
}



// フォーム送信
const formView = document.getElementById("form-view");
const outputArea = document.getElementById("outputArea");
/*
const displayName = document.getElementById("displayName");
const displayAddress = document.getElementById("displayAddress");
const displayJenre = document.getElementById("displayJenre");
const displayPrice = document.getElementById("displayPrice");
const displayPhoto = document.getElementById("displayPhoto");
*/

const STORAGE_KEY = "registeredStores";

function loadStores() {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}
 
/** 店舗データを localStorage に追記保存する */
function saveStore(store) {
    const stores = loadStores();
    stores.push(store);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
}
 
/** 一覧画面に店舗カードを描画する */
function renderStoreList() {
    const stores = loadStores();
    const storeList = document.getElementById("storeList");
    storeList.innerHTML = "";
 
    if (stores.length === 0) {
        storeList.innerHTML = "<p style='text-align:center;'>登録された店舗はありません。</p>";
        return;
    }
 
    stores.forEach(function (store, index) {
        const card = document.createElement("div");
        card.className = "store-card";
        card.innerHTML = `
            <div id="card-container">
                <img src="./img/${store.photo}" id="card-img">
                <div id="card-second-container">
                    <h3>${store.name}</h3>
                    <p>📍${store.address}</p>
                    <p>🪙${store.priceMin} 〜 ${store.priceMax}</p>
                    <p>🍴${store.genre}</p>
                </div>
                <button type="button" class="delete-btn" data-index="${index}">×</button>

            <div>
        `;
        storeList.appendChild(card);
    });
 
    // 削除ボタンのイベント登録
    document.querySelectorAll(".delete-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const i = Number(this.dataset.index);
            const stores = loadStores();
            stores.splice(i, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
            renderStoreList();
        });
    });
}

document.getElementById("store").addEventListener("submit", function (e) {
    e.preventDefault();

    const nameError = document.getElementById('nameError');
    const addressError = document.getElementById('addressError');
    const checkboxError = document.getElementById('checkboxError');
    addressError.textContent = '';
    nameError.textContent = '';
    checkboxError.textContent = '';

    // エラーがあるかどうかを記録するフラグ
    let hasError = false;

    // テキストのバリデーション 
    const userNameInput = document.getElementById('store-name');
    const nameValue = userNameInput.value.trim(); // 前後の余計な空白を削除
    const prefectureInput = document.getElementById('address-prefecture');
    const cityInput = document.getElementById('address-city');
    const addressStreetInput = document.getElementById('address-street');
    const prefectureValue = prefectureInput.value.trim();
    const cityValue = cityInput.value.trim();
    const addressStreetValue = addressStreetInput.value.trim();

    if (nameValue === '') {
        nameError.textContent = '※店舗名を入力してください。';
        hasError = true;
    } else if (nameValue.length > 20) {
        nameError.textContent = `※20文字以下で入力してください。`;
        hasError = true;
    }


    if (prefectureValue === '' || cityValue === '' || addressStreetValue === '') {
        addressError.textContent = '※都道府県、市区町村、番地を入力してください。';
        hasError = true;
    } else if (prefectureValue.length > 20 || cityValue.length > 20 || addressStreetValue.length > 20) {
        addressError.textContent = `※20文字以下で入力してください。`;
        hasError = true;
    }


   

    const checkedBoxes = document.querySelectorAll('input[name="jenre-item"]:checked');

    if (checkedBoxes.length === 0) {
        checkboxError.textContent = '※最低でも1つ以上チェックを入れてください。';
        hasError = true;
    }

    // 判定 
    if (hasError) {
        return;
    }


    const inputName = document.getElementById("store-name").value;
    const inputPrefecture = document.getElementById("address-prefecture").value;
    const inputCity = document.getElementById("address-city").value;
    const inputStreet = document.getElementById("address-street").value;
    const inputJenre = document.querySelectorAll('input[name="jenre-item"]:checked');
    const inputPriceMin = document.getElementById("price-min-label").textContent;
    const inputPriceMax = document.getElementById("price-max-label").textContent;

    const genreText = [...inputJenre]
        .map((el) => el.value)
        .join("、");

    const inputPhoto = document.querySelector('input[name="image"]:checked');
    

    const storeData = {
        name: inputName,
        address: `${inputPrefecture}${inputCity} ${inputStreet}`,
        genre: genreText || "（未選択）",
        priceMin: inputPriceMin,
        priceMax: inputPriceMax,
        photo: inputPhoto.value,
    };
    saveStore(storeData);

    /*

    displayPhoto.src = './img/' + inputPhoto.value;
    displayPhoto.style.display = `${inputPhoto}`;
    displayName.textContent = `店舗名: ${inputName}`;
    displayAddress.textContent = `住所: ${inputPrefecture}${inputCity} ${inputStreet}`;
    displayJenre.textContent = `ジャンル: ${genreText || "（未選択）"}`;
    displayPrice.textContent = `価格帯: ${inputPriceMin} 〜 ${inputPriceMax}`;
*/
    renderStoreList();
    formView.hidden = true;
    outputArea.hidden = false;
});

document.getElementById("back-btn").addEventListener("click", function () {
    outputArea.hidden = true;
    formView.hidden = false;
    document.getElementById("store").reset();
    resetPriceSlider();
});