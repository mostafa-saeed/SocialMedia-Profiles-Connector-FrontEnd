<template>
  <div>
    <h2>Scanner</h2>
    <p>Upload a file</p>
    <input type="file" @change="selectFile">

    <p>Take a photo</p>
    <p>Found: {{ devices.length }} devices</p>
    <button v-if="!stream" @click="startStream">Open Camera</button>
    <button v-if="stream" @click="captureImage">Capture</button>

    <select v-model="currentDevice">
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
const image = new Image();
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const readFile = (file) => new Promise((resolve) => {
  fileReader.onload = (e) => {
    resolve(e.target.result);
  };
  fileReader.readAsDataURL(file);
});

const getImageData = (urlData) => new Promise((resolve) => {
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
  };

  image.src = urlData;
});

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

      this.photo = await readFile(file);
      const { data, width, height } = await getImageData(this.photo);
      const result = jsQR(data, width, height);
      console.log('testing', result);
    },

    async startStream(e) {
      e.preventDefault();
      // Stop current stream
      if (this.stream) {
        const track = this.stream.getVideoTracks()[0];
        track.stop();
        this.stream = false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: this.currentDevice },
      });
      this.stream = stream;
    },

    async captureImage(e) {
      e.preventDefault();

      // console.log('testing', this.stream.getVideoTracks()[0].getSettings());
      const track = this.stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const frame = await imageCapture.grabFrame();

      canvas.width = frame.width;
      canvas.height = frame.height;
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(data, width, height);
      track.stop();
      this.stream = false;

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
