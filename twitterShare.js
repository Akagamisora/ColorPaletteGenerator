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

// Twitter共有用のキャンバス生成関数
function createPaletteCanvas(callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1024;
    const height = 768;
    canvas.width = width;
    canvas.height = height;

    const xSpace10 = 10;
    const xSpace40 = 40;
    const ySpace20 = 20;
    const ySpace40 = 40;

    // 背景の設定
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    // 見出しの描画
    ctx.font = '48px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('カラーパレットジェネレーター', xSpace40, ySpace40 + 48);

    // カラーパレットの初期値
    let xPosition = xSpace40;
    let yPosition = ySpace40 * 2 + 55;

    // カラーボックスのサイズ
    const boxSize = 60;

    // 色の情報を表すテキストボックスの横幅
    const textBox = 142;

    // 1色分のサイズ
    const xColorInfo = boxSize + xSpace10 + textBox;
    const yColorInfo = boxSize + ySpace20 + 24;

    // 配色名
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('ベースカラー', xPosition, yPosition + 24);
    ctx.fillText('補色配色', xPosition + xColorInfo, yPosition + 24);
    ctx.fillText('類似色配色', xPosition, yPosition + 24 + yColorInfo);
    ctx.fillText('トライアド配色', xPosition, yPosition + 24 + yColorInfo * 2);
    ctx.fillText('分裂色配色', xPosition, yPosition + 24 + yColorInfo * 3);
    ctx.fillText('テトラード配色', xPosition, yPosition + 24 + yColorInfo * 4);

    function drawColorInfo(color, x, y) {
        ctx.fillStyle = color.hex();
        ctx.fillRect(x, y, boxSize, boxSize);
        x += (boxSize + xSpace10);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#FFFFFF';
        y += 28;
        ctx.fillText(`${color.hex()}`, x, y);
        y += 18;
        ctx.fillText(`RGB: ${color.rgb()}`, x, y);
    }

    const baseColor = chroma(document.getElementById('hexColor').value);
    drawColorInfo(baseColor, xPosition, yPosition + 28);

    const complementary = baseColor.set('hsl.h', '+180');
    drawColorInfo(complementary, xPosition + xColorInfo, yPosition + 28);

    const analogous = [
        baseColor,
        baseColor.set('hsl.h', '-30'),
        baseColor.set('hsl.h', '+30')
    ];
    for (let i = 0; i < analogous.length; i++) {
        drawColorInfo(analogous[i], xPosition + xColorInfo * i, yPosition + 28 + yColorInfo);
    }

    const triadic = [
        baseColor,
        baseColor.set('hsl.h', '+120'),
        baseColor.set('hsl.h', '-120')
    ];
    yPosition += yColorInfo;
    for (let i = 0; i < triadic.length; i++) {
        drawColorInfo(triadic[i], xPosition + xColorInfo * i, yPosition + 28 + yColorInfo);
    }

    const splitComplementary = [
        baseColor,
        baseColor.set('hsl.h', '+150'),
        baseColor.set('hsl.h', '-150')
    ];
    yPosition += yColorInfo;
    for (let i = 0; i < splitComplementary.length; i++) {
        drawColorInfo(splitComplementary[i], xPosition + xColorInfo * i, yPosition + 28 + yColorInfo);
    }

    const tetradic = [
        baseColor,
        baseColor.set('hsl.h', '+90'),
        baseColor.set('hsl.h', '+180'),
        baseColor.set('hsl.h', '+270')
    ];
    yPosition += yColorInfo;
    for (let i = 0; i < tetradic.length; i++) {
        drawColorInfo(tetradic[i], xPosition + xColorInfo * i, yPosition + 28 + yColorInfo);
    }

    // 最後に署名
    ctx.textAlign = "center";
    ctx.fillText('Made by Sora Akagami', width / 2, height - 50);

    // コールバック関数でBlobに変換
    canvas.toBlob(callback);

    // ページに追加されたキャンバスを削除
    setTimeout(() => {
        canvas.remove();
    }, 1000);
}