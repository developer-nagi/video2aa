window.onload = async () => {
  const video = document.querySelector("#camera");
  const backCanvas = document.querySelector("#picture");
  const frameCountLabel = document.querySelector("#frameCount");
  const aaLabel = document.querySelector("#aaArea");

  // カメラ設定
  const constraints = {
    audio: false,
    video: {
      width: 1920,
      height: 1080,
      deviceId: {
        exact:
          "44d2e79eb15793683a1869415130029beced285e224f02e50f121cb6aaa4d16a", // OBSのカメラ、人によって違う
      },
      // facingMode: "user", // コメントを消してdeviceIdを消して、標準カメラを利用する（width, heightを変更する必要あり）
    },
  };

  // カメラ初期化
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  /** カメラ列挙してID調べたい場合はコメントはずす
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log(devices);
  */
  video.srcObject = stream;
  video.onloadedmetadata = async (e) => {
    video.play();
  };

  const colorset = "隆保和田だずやすかたか＄？｜・￥＝～：。、　"; //濃淡用テキスト
  let viewRange = 9; // Viewの初期サイズ
  let frameCount = 0; // FPSカウント

  // フォントサイズが変わった時の処理
  const validChange = () => {
    aaLabel.style.fontSize = `${viewRange - 3}px`;
    if (viewRange === 9) {
      aaLabel.style.zoom = "116%";
    } else if (viewRange === 7) {
      aaLabel.style.zoom = "135%";
    } else if (viewRange === 5) {
      aaLabel.style.zoom = "200%";
    } else {
      aaLabel.style.zoom = "100%";
    }
  };

  // フォントサイズの初期化
  validChange();

  // メインの描画処理
  const ctx = backCanvas.getContext("2d");
  const view = async () => {
    // カメラからキャンバスへ描画、この時点でリサイズ
    ctx.drawImage(
      video,
      0,
      0,
      Math.floor(backCanvas.width / viewRange),
      Math.floor(backCanvas.height / viewRange)
    );

    // canvasからバイナリデータを取得
    const myImageData = ctx.getImageData(
      0,
      0,
      Math.floor(backCanvas.width / viewRange),
      Math.floor(backCanvas.height / viewRange)
    );

    let textLine = "";
    let textLineCount = 0;
    // バイナリデータを4バイトずつ読み取り
    for (let i = 0; i < myImageData.data.length; i += 4) {
      // カラー情報からグレースケールに変換
      const gray = Math.floor(
        myImageData.data[i] * 0.299 +
          myImageData.data[i + 1] * 0.587 +
          myImageData.data[i + 2] * 0.114
      );

      // テキスト加算のカウンタ
      textLineCount++;

      // グレースケールを元にテキストを作って追記
      textLine += colorset[Math.floor(((colorset.length - 1) * gray) / 255)];

      // カウンタを元に改行処理
      if (textLineCount % Math.floor(backCanvas.width / viewRange) === 0) {
        textLine += "\n";
      }
    }

    // HTML側にテキストを反映
    aaLabel.innerText = textLine;

    // FPSカウント
    frameCount++;

    // 再帰処理
    requestAnimationFrame(view);
  };

  // FPS計算用のタイマー
  setInterval(() => {
    frameCountLabel.innerText = frameCount + "fps";
    frameCount = 0;
  }, 1000);

  // セレクトボックスの変更時の処理
  document.getElementById("viewRange").onchange = (e) => {
    viewRange = Number(e.target.value);
    validChange(); //フォントサイズが変わった時の処理を呼び出し
  };

  requestAnimationFrame(view); // メイン描画処理開始
};
