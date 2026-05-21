//表示用
const MIN_LABELS = ["下限なし", "501", "1001", "2001", "3001", "4001", "5001"];
const MAX_LABELS = ["0","500", "1000", "2000", "3000", "4000", "上限なし"];

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
    minLabel.textContent = MIN_LABELS[minIndex];
    maxLabel.textContent = MAX_LABELS[maxIndex];
}


//minを動かした場合の処理
function syncFromMin() {
    //数値変換
    let minIndex = Number(minInput.value);
    let maxIndex = Number(maxInput.value);

    if (minIndex >= maxIndex) {
        minIndex = maxIndex - 1;
    }
    if(minIndex < 0){
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
    if(maxIndex > STEP_COUNT){
        maxIndex = STEP_COUNT;
    }

    minInput.value = String(minIndex);
    maxInput.value = String(maxIndex);
    updateLabels(minIndex, maxIndex);
    updateFill(minIndex, maxIndex);
}

if (minInput && maxInput) {
    minInput.addEventListener("input", syncFromMin);
    maxInput.addEventListener("input", syncFromMax);
    syncFromMin();
}
