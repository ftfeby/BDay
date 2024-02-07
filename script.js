let isBlownOut = false;
let isBlowItShown = false;

// function startListening() {
//   navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(function(stream) {
//       const audioContext = new AudioContext();
//       const analyser = audioContext.createAnalyser();
//       const microphone = audioContext.createMediaStreamSource(stream);
//       const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);

//       analyser.smoothingTimeConstant = 0.8;
//       analyser.fftSize = 1024;

//       microphone.connect(analyser);
//       analyser.connect(scriptProcessor);
//       scriptProcessor.connect(audioContext.destination);

//       const messageContainer = document.getElementById("msg");

//       scriptProcessor.onaudioprocess = function() {
//         if (!isBlownOut) {
//           const buffer = new Uint8Array(analyser.frequencyBinCount);
//           analyser.getByteFrequencyData(buffer);
//           const volume = buffer.reduce((acc, val) => acc + val) / buffer.length;

//           const message = !isBlowItShown && volume < 70 ? "Make a wish and Blow it!" :
//           isBlowItShown && volume > 100 ? "May your wish come true!" :
//           "Blow harder!";


//           if (!isBlowItShown && volume > 70) {
//             isBlowItShown = true;
//           }

//           if (messageContainer) {
//             messageContainer.textContent = message;
//           }

//           if (volume > 100) {
//             blowCandle();
//           }

//           if (volume > 100 ) {
//             isBlownOut = true;
//             scriptProcessor.disconnect();
//           }
//         }
//       };
//     })
//     .catch(function(err) {
//       console.error("Error accessing microphone", err);
//     });
// }

// async function startListening() {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const audioContext = new AudioContext();
//       await audioContext.audioWorklet.addModule('processor.js');
  
//       const microphone = audioContext.createMediaStreamSource(stream);
//       const workletNode = new AudioWorkletNode(audioContext, 'volume-processor');
  
//       const messageContainer = document.getElementById("msg");
  
//       workletNode.port.onmessage = function(event) {
//         const volume = event.data.volume;
        
// let message =!isBlownOut?"Make a wish and blow it": "May your wish come true!"


// if (!isBlowItShown && volume >= 50) {
//     console.log(volume, "volume>=50");
//     isBlowItShown = true;
//     message = "Blow Harder";
// }

// if (volume > 300 && !isBlownOut) {
//     console.log(volume, "volume>=300");
//     blowCandle();
//     isBlownOut = true;
//     message = "May your wish come true!";
//     workletNode.disconnect();
// }

// if (messageContainer) {
//     messageContainer.textContent = message;
// }




//       }
//       microphone.connect(workletNode).connect(audioContext.destination);
//     } catch (err) {
//       console.error("Error accessing microphone", err);
//     }
//   }
  
  
// async function startListening() {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const audioContext = new AudioContext();
//         await audioContext.audioWorklet.addModule('processor.js');

//         const microphone = audioContext.createMediaStreamSource(stream);
//         const workletNode = new AudioWorkletNode(audioContext, 'volume-processor');

//         const messageContainer = document.getElementById("msg");

//         workletNode.port.onmessage = function (event) {
//             const volume = event.data.volume;
//             let message =!isBlowItShown &&volume <= 200?"Make a wish and blow it" :"Blow Harder"

//             if (!isBlowItShown && volume >= 200) {
//                 isBlowItShown = true;
//                 message = "Blow Harder";
//             }

//             if (volume > 300 && !isBlownOut) {
//                 blowCandle();
//                 isBlownOut = true;
//                 message = "May your wish come true!";
//                 workletNode.disconnect();
//                 workletNode.port.onmessage = null;
//             }

//             if (messageContainer) {
//                 messageContainer.textContent = message;
//             }
//         };

//         microphone.connect(workletNode).connect(audioContext.destination);
//     } catch (err) {
//         console.error("Error accessing microphone", err);
//     }
// }

async function startListening() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();

        const analyser = audioContext.createAnalyser({
            fftSize: 4048,
            smoothingTimeConstant: 0.3
        });

        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const messageContainer = document.getElementById("msg");

        if (!isBlowItShown) {
            messageContainer.textContent = "Make a wish and blow it";
        }

        const updateVolume = () => {
            const buffer = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(buffer);
            const volume = buffer.reduce((acc, val) => acc + val) / buffer.length;

            if (volume > 70) {
                if (!isBlowItShown) {
                    isBlowItShown = true;
                    messageContainer.textContent = "Blow Harder";
                } else if (volume > 100 && !isBlownOut) {
                    blowCandle();
                    isBlownOut = true;
                    messageContainer.textContent = "May your wish come true!";
                    microphone.disconnect();
                    analyser.disconnect();
                    return; 
                }
            }

            requestAnimationFrame(updateVolume);
        };

        updateVolume();
    } catch (err) {
        console.error("Error accessing microphone", err);
    }
}
  function createCandles(age) {
    const candlesContainer = document.getElementById("candles");

    for (let i = 0; i < age; i++) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = `${(i + 1) * 20}px`;
      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);
      candlesContainer.appendChild(candle);
    }
  }
  
  function blowCandle() {
    const candle = document.querySelector(".candle");

    const flame = candle.querySelector(".fire-container");
    flame.style.display = "none";
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    candle.appendChild(smoke);
    setTimeout(() => {
      candle.removeChild(smoke);
    }, 3000);
}

  
  window.onload = function() {

    startListening();
  };