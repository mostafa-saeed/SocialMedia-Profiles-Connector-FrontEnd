<template>
  <div>
    <h2>Scanner</h2>
    <p>Upload a file</p>
    <input type="file" @change="selectFile">

    <p>Take a photo</p>
    <p>Found: {{ devices.length }} devices</p>
    <button v-if="!stream" @click="startStream">Open Camera</button>
    <button v-if="stream" @click="stopStream">Stop Camera</button>
    <button v-if="stream" @click="captureImage">Capture</button>

    <select v-model="currentDevice" @change="changeDevice">
      <option v-for="(device, index) in devices" :key="index" :value="device.deviceId">
        {{ device.label }}
      </option>
    </select>
    <hr>
    <video autoplay v-if="stream" :srcObject.prop="stream"></video>
  </div>
</template>

<script>
import jsQR from 'jsqr';

const fileReader = new FileReader();
const img = new Image();
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const readImage = (file) => new Promise((resolve) => {
  fileReader.onload = (e) => {
    const { result: urlData } = e.target;
    img.onload = () => {
      resolve(img);
    };
    img.src = urlData;
  };
  fileReader.readAsDataURL(file);
});

const getImageData = (image) => {
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

export default {
  name: 'Scanner',
  data: () => ({
    photo: {},
    stream: false,
    devices: 0,
    currentDevice: 0,
  }),

  methods: {
    async selectFile(e) {
      e.preventDefault();
      const [file] = e.target.files;
      const image = await readImage(file);
      const { data, width, height } = getImageData(image);
      const result = jsQR(data, width, height);
      console.log('testing', result);
    },

    async startStream(e) {
      e.preventDefault();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: this.currentDevice },
      });
      this.stream = stream;
    },

    async stopStream(e) {
      e.preventDefault();
      const [track] = this.stream.getVideoTracks();
      track.stop();
      this.stream = false;
    },

    changeDevice(e) {
      e.preventDefault();
      if (this.stream) {
        this.stopStream(e);
        this.startStream(e);
      }
    },

    async captureImage(e) {
      e.preventDefault();
      const [track] = this.stream.getVideoTracks();
      const imageCapture = new ImageCapture(track);
      const frame = await imageCapture.grabFrame();

      const { data, width, height } = getImageData(frame);
      const result = jsQR(data, width, height);
      this.stopStream(e);

      console.log('testing', result);
    },
  },

  async beforeCreate() {
    // Get all available devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    // Only keep video devices
    this.devices = devices.filter((device) => device.kind === 'videoinput');
    const [device] = this.devices;
    this.currentDevice = device.deviceId;
  },
};
</script>
