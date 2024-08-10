window.onload = async () => {
  const video = document.querySelector("#camera");
  const backCanvas = document.querySelector("#picture");
  const frontCanvas = document.querySelector("#picture2");
  const frameCountLabel = document.querySelector("#frameCount");
  const aaLabel = document.querySelector("#aaArea");

  /** カメラ設定 */
  const constraints = {
    audio: false,
    video: {
      width: 1920,
      height: 1080,
      deviceId: {
        exact:
          "44d2e79eb15793683a1869415130029beced285e224f02e50f121cb6aaa4d16a",
      },
      // facingMode: "user", // フロントカメラを利用する
    },
  };

  /** カメラを<video>と同期 */
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log(devices);
  video.srcObject = stream;
  video.onloadedmetadata = async (e) => {
    video.play();
  };

  const ctx = backCanvas.getContext("2d");
  const ctx2 = frontCanvas.getContext("2d");

  let frameCount = 0;

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

  const colorset = "隆保和田だずやすかたか＄？｜・￥＝～：。、　";
  let viewRange = 9;

  validChange();

  const view = async () => {
    ctx.drawImage(video, 0, 0, backCanvas.width, backCanvas.height);

    const myImageData = ctx.getImageData(
      0,
      0,
      backCanvas.width,
      backCanvas.height
    );

    let textLine = [];
    let textBody = "";
    let textLineCount = 0;
    for (let i = 0; i < myImageData.data.length; i += 4) {
      const gray =
        myImageData.data[i] * 0.299 +
        myImageData.data[i + 1] * 0.587 +
        myImageData.data[i + 2] * 0.114;

      if (i % viewRange === 0) {
        textLine[textLineCount] +=
          colorset[Math.floor(((colorset.length - 1) * gray) / 255)];
      }

      if (!textLine[textLineCount]) {
        textLine[textLineCount] = "";
      }

      if (i % (backCanvas.width * 4) === 0) {
        textLineCount++;
      }
    }

    textBody = textLine
      .filter((txt, index) => index % viewRange === 0)
      .join("\n");
    textBody = textBody.replace("undefined保\n", "");

    // ctx.putImageData(myImageData, 0, 0);
    aaLabel.innerText = textBody;
    frameCount++;

    requestAnimationFrame(view);
  };

  setInterval(() => {
    frameCountLabel.innerText = frameCount + "fps";
    frameCount = 0;
  }, 1000);

  document.getElementById("viewRange").onchange = (e) => {
    viewRange = Number(e.target.value);
    validChange();
  };

  requestAnimationFrame(view);
};

