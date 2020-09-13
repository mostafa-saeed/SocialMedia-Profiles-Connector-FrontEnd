<template>
  <div>
    <h2>Scanner</h2>
    <p>Upload a file</p>
    <input type="file" @change="selectFile">

    <p>Take a photo</p>
    <p v-if="devices">Found: {{ devices.length }} devices</p>
    <button v-if="!stream" @click="startStream">Open Camera</button>
    <button v-if="stream" @click="stopStream">Stop Camera</button>

    <select v-if="devices" v-model="currentDevice" @change="changeDevice">
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

const loadFileError = () => {
  alert('Could not load this file');
};

fileReader.onerror = loadFileError;
img.onerror = loadFileError;

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
      if (result) {
        alert(result.data);
      } else {
        alert('No QR was found');
      }
    },

    async startStream(e) {
      e.preventDefault();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: this.currentDevice },
        });
        this.stream = stream;
        // Load devices
        if (!this.devices) {
          await this.loadDevices();
        }
        this.startTimer(e);
      } catch (error) {
        console.error(error);
        alert('Could not start stream');
      }
    },

    startTimer(e) {
      // Auto detect QR code
      this.interval = setInterval(async () => {
        const result = await this.captureFrame();
        if (result) {
          this.stopStream(e);
          alert(result.data);
        }
      }, 500);

      // Auto stop stream after 5 seconds
      this.timeout = setTimeout(async () => {
        this.stopStream(e);
        alert('No QR was found');
      }, 5000);
    },

    async stopStream(e) {
      e.preventDefault();
      const [track] = this.stream.getVideoTracks();
      track.stop();
      this.stream = false;
      // Clear interval
      clearInterval(this.interval);
      clearTimeout(this.timeout);
      this.interval = 0;
      this.timeout = 0;
    },

    async changeDevice(e) {
      e.preventDefault();
      if (this.stream) {
        await this.stopStream(e);
        await this.startStream(e);
      }
    },

    async captureFrame() {
      const [track] = this.stream.getVideoTracks();
      const imageCapture = new ImageCapture(track);
      const frame = await imageCapture.grabFrame();

      const { data, width, height } = getImageData(frame);
      return jsQR(data, width, height);
    },

    async loadDevices() {
      // Get all available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      // Only keep video devices
      this.devices = devices.filter((device) => device.kind === 'videoinput');
      if (this.devices.length > 0) {
        const [device] = this.devices;
        this.currentDevice = device.deviceId;
      }
    },

  },

  async beforeCreate() {
    const { state } = await navigator.permissions.query({ name: 'camera' });
    if (state === 'granted') {
      await this.loadDevices();
    }
  },
};
</script>
