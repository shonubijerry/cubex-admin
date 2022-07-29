<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <tiles>
        <card-component
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
      const ratesRes = await app.$axios.$get(`/cryptos/rates`)
      const crypto = res.data
      const rate = ratesRes.data

      return {
        crypto,
        rate: rate.value['NGN'],
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
  },
  methods: {
    viewBarcode(barcodeURL) {
      this.currentBarcode = barcodeURL
      this.isImageModalActive = true
    },
  },
}
</script>
