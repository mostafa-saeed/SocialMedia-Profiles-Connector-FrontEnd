<template>
  <v-row align="center" justify="center" >
    <v-col cols="6" sm="6" md="6">

    <h2>Scanner</h2>

    <v-file-input
      placeholder="Upload an image"
      prepend-icon="mdi-camera"
      @change="selectFile"
      :chips="true"
      :show-size="true" />

    <p>Camera Scan</p>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{}">
        <v-btn
          color="primary"
          dark
          @click="startStream">
          Open Camera
        </v-btn>
      </template>

      <v-card>

        <v-toolbar dark color="primary">

          <v-btn icon dark @click="stopStream">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Select Your Camera</v-toolbar-title>

        </v-toolbar>

        <v-list three-line subheader>
          <v-list-item>
            <v-list-item-content>
              <v-select
                label="Select Your Camera"
                v-model="currentDevice"
                :items=devices
                @change="changeDevice"
              />
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <video autoplay v-if="stream" :srcObject.prop="stream" />
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-card>
    </v-dialog>

    </v-col>
  </v-row>
</template>

<style scoped>

video {
  width: 100%;
  max-height: 400px;
}
</style>

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
    stream: false,
    devices: null,
    currentDevice: null,

    dialog: false,
  }),

  methods: {
    async selectFile(file) {
      if (!file) return;

      const image = await readImage(file);
      const { data, width, height } = getImageData(image);
      const result = jsQR(data, width, height);
      if (result) {
        alert(result.data);
      } else {
        alert('No QR was found');
      }
    },

    async startStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: this.currentDevice },
        });
        this.stream = stream;
        this.dialog = true;
        // Load devices
        if (!this.devices) {
          await this.loadDevices();
        }
        this.startTimer();
      } catch (error) {
        console.error(error);
        alert('Could not start stream');
      }
    },

    startTimer() {
      // Auto detect QR code
      this.interval = setInterval(async () => {
        const result = await this.captureFrame();
        if (result) {
          this.stopStream();
          alert(result.data);
        }
      }, 500);
    },

    async stopStream() {
      const [track] = this.stream.getVideoTracks();
      track.stop();
      this.stream = false;
      this.dialog = false;
      // Clear interval
      clearInterval(this.interval);
      this.interval = 0;
    },

    async changeDevice() {
      if (this.stream) {
        await this.stopStream();
        await this.startStream();
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
      this.devices = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          text: device.label,
          value: device.deviceId,
        }));

      if (this.devices.length > 0) {
        const [device] = this.devices;
        this.currentDevice = device.value;
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
