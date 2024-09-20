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

// カラーピッカーまたはHEXコードの変更で呼び出されるパレット生成関数
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

    // ランダム生成ボタンとカラーパレットを保存ボタンの背景色を補色に設定
    document.getElementById('randomButton').style.backgroundColor = complementary.hex();
    document.getElementById('saveImageButton').style.backgroundColor = complementary.hex();

    // 結果を表示
    let schemes = document.getElementById('colorSchemes');
    schemes.innerHTML = '';  // 既存の内容をクリア

    addColorScheme(schemes, '補色配色', complementary);
    addColorScheme(schemes, '類似色配色', analogous[0], analogous[1], analogous[2]);
    addColorScheme(schemes, 'トライアド配色', triadic[0], triadic[1], triadic[2]);
    addColorScheme(schemes, '分裂補色配色', splitComplementary[0], splitComplementary[1], splitComplementary[2]);
    addColorScheme(schemes, 'テトラード配色', tetradic[0], tetradic[1], tetradic[2], tetradic[3]);
}

// // 配色スキームを追加する関数
// function addColorScheme(parent, title, ...colors) {
//     let schemeContainer = document.createElement('div');
//     schemeContainer.className = 'color-scheme';

//     let schemeTitle = document.createElement('div');
//     schemeTitle.className = 'color-scheme-title';
//     schemeTitle.innerText = title;
//     schemeContainer.appendChild(schemeTitle);

//     let colorBoxContainer = document.createElement('div');
//     colorBoxContainer.className = 'color-box-container';
//     colors.forEach(color => {
//         let box = document.createElement('div');
//         box.className = 'color-box';
//         box.style.backgroundColor = color.hex();

//         // カラーボックス内のテキスト（カラーコード + "クリックでコピー"）
//         let colorCodeText = document.createElement('div');
//         colorCodeText.className = 'color-code';
//         colorCodeText.innerText = `${color.hex()} - クリックでコピー`;
//         box.appendChild(colorCodeText);

//         // クリック時にカラーコードをクリップボードにコピー
//         box.addEventListener('click', function() {
//             copyToClipboard(color.hex());
//             alert(`${color.hex()} をコピーしました！`);
//         });

//         colorBoxContainer.appendChild(box);
//     });

//     schemeContainer.appendChild(colorBoxContainer);
//     parent.appendChild(schemeContainer);
// }

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

        // カラーボックス内のテキスト（カラーコード + "クリックでコピー"）
        let colorCodeText = document.createElement('div');
        colorCodeText.className = 'color-code';
        colorCodeText.innerText = `${color.hex()} - クリックでコピー`;
        box.appendChild(colorCodeText);

        // クリック時にカラーコードをクリップボードにコピー
        box.addEventListener('click', function() {
            copyToClipboard(color.hex());
            showCopyNotification(`${color.hex()} をコピーしました！`);
        });

        colorBoxContainer.appendChild(box);
    });

    schemeContainer.appendChild(colorBoxContainer);
    parent.appendChild(schemeContainer);
}

// クリップボードにコピーしたときに通知を表示する関数
function showCopyNotification(message) {
    let notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    // フェードイン
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    // 1秒後にフェードアウト
    setTimeout(() => {
        notification.style.opacity = '0';
        // フェードアウト後にDOMから削除
        setTimeout(() => {
            notification.remove();
        }, 1000);
    }, 1000);
}

// CSS
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: 1000;
    }

    .color-scheme {
        margin-bottom: 20px;
    }

    .color-scheme-title {
        font-weight: bold;
        margin-bottom: 10px;
    }

    .color-box-container {
        display: flex;
    }

    .color-box {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
    }

    .color-code {
        font-size: 12px;
        text-align: center;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);

// ランダムカラー生成関数
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

// Imgur APIを使って画像をアップロードする関数
async function uploadImageToImgur(imageBlob) {
    const clientId = '57734f8f4ce7189';  // ここに取得したImgurのクライアントIDを入力
    const formData = new FormData();
    formData.append('image', imageBlob);

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${clientId}`
            },
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            return data.data.link;  // アップロードされた画像のURLを返す
        } else {
            throw new Error('Imgurへのアップロードに失敗しました');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Twitter共有ボタンのクリックイベント
document.getElementById('twitterButton').addEventListener('click', async function() {
    // カラーパレットの画像を生成
    createPaletteCanvas(async function(blob) {
        if (!blob) {
            alert('キャンバスから画像を生成できませんでした。');
            return;
        }

        console.log("Blobが正常に生成されました。", blob);  // デバッグ用

        // BlobをImgurにアップロード
        const imageUrl = await uploadImageToImgur(blob);
        const baseColor = document.getElementById('hexColor').value;  // 現在のベースカラー

        if (imageUrl) {
            // Twitter投稿用のテキストとリンクを生成
            const tweetText = `【カラーパレットジェネレーター】\nベースカラー「${baseColor}」を元にカラーパレットを生成しました。\n\n生成したカラーパレットの画像はここから確認できるよ👀\n${imageUrl}\n\n⬇️新たにカラーパレットを生成する⬇️\nhttps://akagamisora.github.io/ColorPaletteGenerator/?baseColor=${encodeURIComponent(baseColor)}\n\n#カラーパレットジェネレーター`;

            // Twitterの共有URLを生成
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

            // 新しいタブでTwitterの共有ページを開く
            window.open(twitterUrl, '_blank');
        } else {
            alert('画像のアップロードに失敗しました。');
        }
    });
});