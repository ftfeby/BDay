class VolumeProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
   
    let sum = 0;
    for (let i = 0; i < input[0].length; ++i) {

      sum += input[0][i] * input[0][i]*100;
    }
    const rms = Math.sqrt(sum / input[0].length);
    let volume = Math.round((rms / 2) * 100); 
    this.port.postMessage({ volume }); 
    return true; 
  }
}

registerProcessor('volume-processor', VolumeProcessor);

