<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <tiles>
        <card-component
          v-if="viewMode"
          :title="giftcard.name | capitalize"
          icon="coin"
          class="tile is-child"
        >
          <user-avatar
            :avatar="giftcard.icon"
            class="image has-max-width is-aligned-center"
          />
          <hr />
          <div class="columns">
            <div class="column is-one-fifth has-text-weight-bold">
              Countries
            </div>
            <div class="column">{{ giftcard.countries | arrayToString }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth has-text-weight-bold">Types</div>
            <div class="column">{{ giftcard.types | arrayToString }}</div>
          </div>
          <div class="columns">
            <div class="column is-one-fifth has-text-weight-bold">Created</div>
            <div class="column">{{ giftcard.createdAt | displayDate }}</div>
          </div>

          <hr />
          <b-field label="Categories"></b-field>
          <b-table
            :loading="isLoading"
            :striped="true"
            :hoverable="true"
            default-sort="name"
            :data="giftcard.categories"
          >
            <template v-if="giftcard.categories.length" slot-scope="props">
              <b-table-column label="Name" field="name" sortable>
                {{ props.row.name }}
              </b-table-column>
              <b-table-column label="Rate" field="rate" sortable>
                {{ props.row.rate }}
              </b-table-column>
              <b-table-column custom-key="actions" class="is-actions-cell">
                <div class="buttons is-right">
                  <b-button
                    icon-left="account-edit"
                    type="is-primary"
                    size="is-small"
                    @click="openEdit(props.row)"
                  />
                </div>
              </b-table-column>
            </template>
          </b-table>
        </card-component>
        <card-component
          v-if="editRateMode"
          :title="`Edit ${selectedCategory.name}`"
          icon="account-edit"
          class="tile is-child"
        >
          <form @submit.prevent="submit">
            <b-field label="Rate" message="Value required" horizontal>
              <b-input
                v-model="selectedCategory.rate"
                placeholder="Input rate"
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
                :disabled="isLoading"
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
import { chunk } from 'lodash'
import TitleBar from '@/components/TitleBar'
import Tiles from '@/components/Tiles'
import CardComponent from '@/components/CardComponent'
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'SingleGiftCard',
  middleware: 'authenticated',
  components: {
    UserAvatar,
    CardComponent,
    Tiles,
    TitleBar,
  },
  async asyncData({ app, params }) {
    try {
      const res = await app.$axios.$get(`/giftcards/one/${params.id}`)
      const giftcard = res.data

      return {
        giftcard,
      }
    } catch (err) {
      console.log(err.message)
    }
  },
  data() {
    return {
      giftcard: {},
      selectedCategory: {},
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
    giftcardName() {
      return this.giftcard.name
    },
    titleStack() {
      return ['GiftCard', this.giftcardName]
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

      const categories = this.giftcard.categories.map((c) => {
        if (c._id === this.selectedCategory._id) {
          return this.selectedCategory
        }
        return c
      })

      try {
        const res = await this.$axios.$put(`/giftcards/one/${this.pageId}`, {
          categories,
        })
        const giftcard = res.data

        this.giftcard = giftcard
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
        this.selectedCategory = null
        this.mode = 'view'
      }
    },
    viewBarcode(barcodeURL) {
      this.currentBarcode = barcodeURL
      this.isImageModalActive = true
    },
    openEdit(prop) {
      this.selectedCategory = prop
      this.mode = 'edit'
    },
  },
}
</script>
