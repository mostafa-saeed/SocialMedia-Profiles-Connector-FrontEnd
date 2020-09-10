<template>
  <div>
    <h2>Scanner</h2>
    <p>Upload a file</p>
    <input type="file" @change="selectFile">

    <p>Take a photo</p>
    <button @click="startStream">Open Camera</button>
    <button @click="captureImage">Capture</button>
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

      // const devices = await navigator.mediaDevices.enumerateDevices();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
};
</script>
