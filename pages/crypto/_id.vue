<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <tiles>
        <card-component
          v-if="viewMode"
          :title="crypto.name | capitalize"
          icon="coin"
          class="tile is-child"
        >
          <user-avatar
            :avatar="crypto.icon"
            class="image has-max-width is-aligned-center"
          />
          <hr />
          <b-field label="Networks"></b-field>
          <div
            v-for="(network, index) in crypto.networks"
            :key="index"
            class="columns"
          >
            <div class="column is-one-fifth">{{ network.name }}</div>
            <div class="column">{{ network.address }}n</div>
            <div class="column">
              <b-button
                icon-left="barcode"
                type="is-primary"
                size="is-small"
                @click="viewBarcode(network.barcode)"
              />
            </div>
          </div>

          <div>
            <strong>Rates</strong>&nbsp;&nbsp;&nbsp;
            <span
              ><b-button
                horizontal
                icon-left="lead-pencil"
                type="is-primary"
                size="is-small"
                @click="mode = 'edit'" /></span
            ><br /><br />
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Below {{ rate.mark }} units</div>
            <div class="column">${{ rate.below }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Above {{ rate.mark }} units</div>
            <div class="column">${{ rate.above }}</div>
          </div>

          <hr />
          <div class="columns">
            <div class="column is-one-fifth">
              <strong>Created</strong>
            </div>
            <div class="column">{{ crypto.createdAt | displayDate }}</div>
          </div>
        </card-component>
        <card-component
          v-if="editRateMode"
          :title="`Edit ${crypto.name} rate`"
          icon="account-edit"
          class="tile is-child"
        >
          <form @submit.prevent="submit">
            <b-field label="Mark" message="Value required" horizontal>
              <b-input
                v-model="rate.mark"
                placeholder="Rate above or below"
                required
              />
            </b-field>
            <b-field label="Below" message="Value required" horizontal>
              <b-input
                v-model="rate.below"
                placeholder="Amount when below rate mark"
                required
              />
            </b-field>
            <b-field label="Above" message="Value required" horizontal>
              <b-input
                v-model.number="rate.above"
                type="number"
                placeholder="Amount when above rate mark"
                required
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
                :loading="isLoading"
                @click="mode = 'view'"
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

export default {
  name: 'SingleCrypto',
  middleware: 'authenticated',
  components: {
    UserAvatar,
    CardComponent,
    Tiles,
    TitleBar,
  },
  async asyncData({ app, params }) {
    try {
      const res = await app.$axios.$get(`/cryptos/one/${params.id}`)
      const crypto = res.data

      return {
        crypto,
        rate: crypto.rate,
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
      mode: 'view',
      currentBarcode: '',
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
    editRateMode() {
      return this.mode === 'edit'
    },
    viewMode() {
      return this.mode === 'view'
    },
  },
  methods: {
    async submit() {
      this.isLoading = true

      try {
        const res = await this.$axios.$put(`/cryptos/one/${this.pageId}`, {
          rate: this.rate,
        })
        const crypto = res.data

        this.crypto = crypto
        this.rate = crypto.rate
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
        this.mode = 'view'
      }
    },
    viewBarcode(barcodeURL) {
      this.currentBarcode = barcodeURL
      this.isImageModalActive = true
    },
  },
}
</script>
