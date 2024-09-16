// カラーピッカーで選んだ色に応じてHEXコードを表示
const colorInput = document.getElementById('baseColor');
const hexInput = document.getElementById('hexColor');
const randomButton = document.getElementById('randomButton');  // ランダム生成ボタン

// h1 タグ内のテキストを参照
const colorText = document.getElementById('colorText');
const paletteText = document.getElementById('paletteText');
const generatorText = document.getElementById('generatorText');

// ページが読み込まれた時点で初期値でパレットを生成
document.addEventListener('DOMContentLoaded', function() {
    generateColors();  // 初期パレット生成
});

// カラーピッカーの変更をリアルタイムで反映
colorInput.addEventListener('input', function() {
    hexInput.value = colorInput.value;
    generateColors();  // パレットを自動生成
});

// HEXコードを手動で変更した時、カラーピッカーも変更
hexInput.addEventListener('input', function() {
    colorInput.value = hexInput.value;
    generateColors();  // パレットを自動生成
});

// ランダム生成ボタンの処理
randomButton.addEventListener('click', function() {
    const randomColor = getRandomColor();
    hexInput.value = randomColor;
    colorInput.value = randomColor;
    generateColors();  // ランダムカラーでパレット生成
});

// パレット生成関数
function generateColors() {
    let baseColor = document.getElementById('hexColor').value;
    let color = chroma(baseColor);

    // 補色配色
    let complementary = color.set('hsl.h', '+180');

    // 類似色配色
    let analogous = [
        color.set('hsl.h', '-30'),
        color,
        color.set('hsl.h', '+30')
    ];

    // トライアド配色
    let triadic = [
        color.set('hsl.h', '+120'),
        color,
        color.set('hsl.h', '-120')
    ];

    // 分裂補色配色
    let splitComplementary = [
        color.set('hsl.h', '+150'),
        color,
        color.set('hsl.h', '-150')
    ];

    // テトラード配色
    let tetradic = [
        color.set('hsl.h', '+90'),
        color.set('hsl.h', '+180'),
        color.set('hsl.h', '+270'),
        color
    ];

    // トライアドの色をh1の各部分に適用
    colorText.style.color = triadic[0].hex();
    paletteText.style.color = triadic[1].hex();
    generatorText.style.color = triadic[2].hex();

    // 結果を表示
    let schemes = document.getElementById('colorSchemes');
    schemes.innerHTML = '';  // 既存の内容をクリア

    addColorScheme(schemes, '補色配色', complementary);
    addColorScheme(schemes, '類似色配色', analogous[0], analogous[1], analogous[2]);
    addColorScheme(schemes, 'トライアド配色', triadic[0], triadic[1], triadic[2]);
    addColorScheme(schemes, '分裂補色配色', splitComplementary[0], splitComplementary[1], splitComplementary[2]);
    addColorScheme(schemes, 'テトラード配色', tetradic[0], tetradic[1], tetradic[2], tetradic[3]);

    // ランダム生成ボタンの背景色を補色に設定
    document.getElementById('randomButton').style.backgroundColor = complementary.hex();
}

// 配色スキームを追加する関数
function addColorScheme(parent, title, ...colors) {
    let schemeContainer = document.createElement('div');
    schemeContainer.className = 'color-scheme';

    let schemeTitle = document.createElement('div');
    schemeTitle.className = 'color-scheme-title';
    schemeTitle.innerText = title;
    schemeContainer.appendChild(schemeTitle);

    let colorBoxContainer = document.createElement('div');
    colorBoxContainer.className = 'color-box-container';
    colors.forEach(color => {
        let box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color.hex();

        // カラーボックス内のテキスト
        let colorCodeText = document.createElement('div');
        colorCodeText.className = 'color-code';
        colorCodeText.innerText = `${color.hex()} - クリックでコピー`;
        box.appendChild(colorCodeText);

        // クリック時にカラーコードをクリップボードにコピー
        box.addEventListener('click', function() {
            copyToClipboard(color.hex());
            alert(`${color.hex()} をコピーしました！`);
        });

        colorBoxContainer.appendChild(box);
    });

    schemeContainer.appendChild(colorBoxContainer);
    parent.appendChild(schemeContainer);
}

// ランダムにカラーを生成
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// クリップボードにカラーコードをコピー
function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}