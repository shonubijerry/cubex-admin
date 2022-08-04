<template>
  <b-field class="file">
    <b-upload v-model="file" :accept="accept" @input="upload">
      <a :class="`button is-primary ${size}`">
        <b-icon icon="upload" :custom-size="size"></b-icon>
        <span>{{ buttonLabel }}</span>
      </a>
    </b-upload>
    <span v-if="file" class="file-name">{{ file.name }}</span>
  </b-field>
</template>

<script>
export default {
  name: 'FilePicker',
  props: {
    accept: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {
      file: null,
      uploadPercent: 0,
    }
  },
  computed: {
    buttonLabel() {
      return !this.file ? 'Pick a file' : 'Pick another file'
    },
  },
  methods: {
    async upload(file) {
      try {
        let formData = new FormData()
        formData.append('upload', file)

        const config = {
          header: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: this.progressEvent,
        }
        const res = await this.$axios.$post(`/file/upload`, formData, config)

        this.$emit('uploaded-file', res.data)
      } catch (err) {
        console.log(err.message)
      }
    },
    progressEvent(progressEvent) {
      this.uploadPercent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
    },
  },
}
</script>
