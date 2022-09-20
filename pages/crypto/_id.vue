<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <tiles>
        <card-component
          v-if="!isEditMode"
          :title="crypto.name | capitalize"
          icon="coin"
          class="tile is-child"
        >
          <user-avatar
            :avatar="crypto.icon"
            class="image has-max-width is-aligned-center"
          />
          <hr />

          <b-field label="Rates"></b-field>
          <div class="columns">
            <div class="column is-one-fifth">Below {{ rate.mark }} units</div>
            <div class="column">${{ rate.below }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Above {{ rate.mark }} units</div>
            <div class="column">${{ rate.above }}</div>
          </div>

          <div class="columns">
            <div class="column is-one-fifth">
              <strong>Created</strong>
            </div>
            <div class="column">{{ crypto.createdAt | displayDate }}</div>
          </div>

          <b-field label="Networks"></b-field>
          <b-table
            :loading="isLoading"
            :striped="true"
            :hoverable="true"
            default-sort="name"
            :data="crypto.networks"
          >
            <template v-if="crypto.networks.length" slot-scope="props">
              <b-table-column label="Name" field="name" sortable>
                {{ props.row.name }}
              </b-table-column>
              <b-table-column label="Address" field="address" sortable>
                {{ props.row.address }}
              </b-table-column>
              <b-table-column custom-key="actions" class="is-actions-cell">
                <div class="buttons is-right">
                  <b-button
                    icon-left="barcode"
                    type="is-primary"
                    size="is-small"
                    @click="viewBarcode(props.row.barcode)"
                  />
                  <b-button
                    icon-left="lead-pencil"
                    type="is-primary"
                    size="is-small"
                    @click="editNetwork(props.row)"
                  />
                </div>
              </b-table-column>
            </template>
          </b-table>
        </card-component>

        <card-component
          v-if="isEditMode"
          :title="`Edit Crypto address`"
          icon="account-edit"
          class="tile is-child"
        >
          <form @submit.prevent="submit">
            <b-field label="Address" message="Value required" horizontal>
              <b-input
                v-model="selectedNetwork.address"
                placeholder="address of crypto"
                required
              />
            </b-field>
            <b-field label="Below" message="Value required" horizontal>
              <file-picker
                accept="image/*"
                size="is-small"
                :uploadAfterPick="false"
                @pending-upload="setFileToUpload"
                @uploaded-file="updateSelectedNetwork"
              />
            </b-field>
            <hr />
            <b-field horizontal>
              <b-button
                horizontal
                type="is-primary"
                :loading="isLoading"
                native-type="submit"
                >Submit</b-button
              >
              <b-button
                horizontal
                type="is-danger"
                :disabled="isLoading"
                @click="mode = ''"
                >Cancel</b-button
              >
            </b-field>
          </form>
        </card-component>
      </tiles>

      <b-modal :active.sync="isImageModalActive" :width="400">
        <p class="image is-4by3">
          <img :src="currentBarcode" />
        </p>
      </b-modal>
    </section>
  </div>
</template>

<script>
import TitleBar from '@/components/TitleBar'
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
import UserAvatar from '@/components/UserAvatar'
import FilePicker from '@/components/FilePicker'

export default {
  name: 'SingleCrypto',
  middleware: 'authenticated',
  components: {
    UserAvatar,
    CardComponent,
    Tiles,
    TitleBar,
    FilePicker,
  },
  async asyncData({ app, params }) {
    try {
      const res = await app.$axios.$get(`/cryptos/one/${params.id}`)
      const ratesRes = await app.$axios.$get(`/cryptos/rates`)

      return {
        crypto: res.data,
        rate: ratesRes.data,
      }
    } catch (err) {
      console.log(err.message)
    }
  },
  data() {
    return {
      crypto: {},
      rate: {},
      form: {},
      isLoading: false,
      isImageModalActive: false,
      currentBarcode: '',
      mode: '',
      selectedNetwork: null,
      fileToUpload: null,
    }
  },
  computed: {
    pageId() {
      return this.$route.params?.id
    },
    cryptoName() {
      return this.crypto.name
    },
    titleStack() {
      return ['Crypto', this.cryptoName]
    },
    isEditMode() {
      return this.mode === 'edit'
    },
  },
  methods: {
    viewBarcode(barcodeURL) {
      this.currentBarcode = barcodeURL
      this.isImageModalActive = true
    },
    editNetwork(network) {
      this.selectedNetwork = network
      this.mode = 'edit'
    },
    setFileToUpload(file) {
      this.fileToUpload = file
    },
    updateSelectedNetwork({ url }) {
      this.selectedNetwork.barcode = url || this.selectedNetwork.barcode
    },
    async submit() {
      this.isLoading = true

      try {
        if (this.fileToUpload) {
          let formData = new FormData()
          formData.append('upload', this.fileToUpload)

          const config = {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          }
          const res = await this.$axios.$post(`/file/upload`, formData, config)
          this.updateSelectedNetwork(res.data)
        }

        const networks = this.crypto.networks.map((n) => {
          if (n.name === this.selectedNetwork.name) {
            return this.selectedNetwork
          }
          return n
        })
        const res = await this.$axios.$put(`/cryptos/one/${this.pageId}`, {
          networks,
        })

        this.crypto = res.data

        this.$buefy.snackbar.open({
          message: 'Update successful',
          queue: false,
        })
      } catch (err) {
        console.log(err.message)
        this.$buefy.snackbar.open({
          message: 'Update error',
          queue: false,
        })
      } finally {
        this.isLoading = false
        this.fileToUpload = null
        this.selectedNetwork = null
        this.mode = 'view'
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
