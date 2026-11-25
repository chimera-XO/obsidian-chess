class PCMCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.chunkSize = 1600;
    this.buffer = new Int16Array(this.chunkSize);
    this.offset = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    const ratio = sampleRate / this.targetSampleRate;
    const outputLength = Math.floor(channelData.length / ratio);

    for (let i = 0; i < outputLength; i++) {
      const sample = channelData[Math.floor(i * ratio)];
      const clamped = Math.max(-1, Math.min(1, sample));
      this.buffer[this.offset++] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;

      if (this.offset >= this.chunkSize) {
        const chunk = this.buffer.slice(0);
        this.port.postMessage(chunk.buffer, [chunk.buffer]);
        this.offset = 0;
      }
    }

    return true;
  }
}

registerProcessor('pcm-capture-processor', PCMCaptureProcessor);
