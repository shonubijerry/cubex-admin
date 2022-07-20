<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <tiles>
        <card-component
          v-if="viewMode"
          :title="giftCard.name | capitalize"
          icon="coin"
          class="tile is-child"
        >
          <user-avatar
            :avatar="transaction.image?.[0]"
            class="image has-max-width is-aligned-center"
            @click="viewImages()"
          />
          <b-button
            label="View Images"
            icon-left="eye"
            type="is-primary"
            size="is-small"
            @click="viewImages()"
          />
          <hr />
          <div class="columns">
            <div class="column is-one-fifth">User</div>
            <div class="column">{{ transaction.createdBy.name }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Unit</div>
            <div class="column">{{ transaction.amount }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Rate</div>
            <div class="column">{{ transaction.rate }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Expected Amount</div>
            <div class="column">{{ giftCard.address }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">GiftCard Type</div>
            <div class="column">{{ giftCard.type }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Reference</div>
            <div class="column">{{ transaction.reference }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Status</div>
            <div class="column">{{ transaction.status }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Created</div>
            <div class="column">{{ transaction.createdAt | displayDate }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth">Comment</div>
            <div class="column">{{ transaction.comment }}</div>
          </div>
          <b-button
            label="Edit"
            icon-left="lead-pencil"
            :disabled="transaction.status === 'successful'"
            type="is-primary"
            size="is-small"
            @click="openEdit()"
          />
        </card-component>
        <card-component
          v-if="editRateMode"
          :title="`Edit Transaction`"
          icon="account-edit"
          class="tile is-child"
        >
          <form @submit.prevent="submit">
            <b-field label="Rate" horizontal>
              <b-input
                v-model.number="update.rate"
                placeholder="transaction rate"
                required
              />
            </b-field>
            <b-field label="Status" horizontal>
              <b-select v-model="update.status" placeholder="< Select status >">
                <option
                  v-for="status in statuses"
                  :key="status"
                  :value="status"
                  active
                >
                  {{ status }}
                </option>
              </b-select>
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

      <b-modal :active.sync="isImageModalActive" full-width="true">
        <template>
          <b-carousel :indicator-inside="false">
            <b-carousel-item v-for="(item, i) in transaction.image" :key="i">
              <img
                class="image is-centered"
                :src="item"
                alt="giftCard image"
                width="full"
              />
            </b-carousel-item>
          </b-carousel>
        </template>
      </b-modal>
    </section>
  </div>
</template>

<script>
import TitleBar from '@/components/TitleBar'
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
import UserAvatar from '@/components/UserAvatar'
import { TRANSACTION_STATUS_ARRAY } from '@/services/constants'

export default {
  name: 'SingleGiftCardTransaction',
  middleware: 'authenticated',
  components: {
    UserAvatar,
    CardComponent,
    Tiles,
    TitleBar,
  },
  async asyncData({ app, params }) {
    try {
      const res = await app.$axios.$get(`/giftCards/transaction/${params.id}`)
      const transaction = res.data

      return {
        transaction,
        giftCard: transaction.giftCard,
      }
    } catch (err) {
      console.log(err.message)
    }
  },
  data() {
    return {
      transaction: {},
      giftCard: {},
      update: {},
      isLoading: false,
      isImageModalActive: false,
      mode: 'view',
      currentBarcode: '',
      statuses: TRANSACTION_STATUS_ARRAY,
    }
  },
  computed: {
    pageId() {
      return this.$route.params?.id
    },
    giftCardName() {
      return this.giftCard.name
    },
    titleStack() {
      return ['GiftCard Transactions', this.giftCardName]
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
        const res = await this.$axios.$put(`/giftCards/update/${this.pageId}`, {
          ...this.update,
        })
        const trans = res.data

        this.transaction = trans
        this.giftCard = trans.giftCard
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
    openEdit() {
      this.update = {
        rate: this.transaction.rate,
        status: this.transaction.status,
      }
      this.mode = 'edit'
    },
    viewImages() {
      this.isImageModalActive = true
    },
  },
}
</script>

<style>
.is-active .al img {
  filter: grayscale(0%);
}
.al img {
  filter: grayscale(100%);
}
</style>
