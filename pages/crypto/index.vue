<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <card-component
        v-if="viewMode"
        class="has-table has-mobile-sort-spaced"
        title="Cryptos"
        icon="coin"
      >
        <CryptoTable :data="data" :is-loading="isLoading" />
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
    </section>
  </div>
</template>

<script>
import CryptoTable from '@/components/crypto/CryptoTable'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'Tables',
  components: {
    TitleBar,
    CardComponent,
    CryptoTable,
  },
  data() {
    return {
      data: [],
      mode: 'view',
      isLoading: false,
      paginated: false,
    }
  },
  computed: {
    titleStack() {
      return ['Cryptos']
    },
    editRateMode() {
      return this.mode === 'edit'
    },
    viewMode() {
      return this.mode === 'view'
    },
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true
        const res = await this.$axios.$get('/cryptos')
        this.data = res.data
      } catch (err) {
        console.log(err.message)
      } finally {
        this.isLoading = false
      }
    },
    trashModal(trashObject) {
      this.trashObject = trashObject
      this.isModalActive = true
    },
    trashConfirm() {
      this.isModalActive = false
      this.$buefy.snackbar.open({
        message: 'Confirmed',
        queue: false,
      })
    },
    trashCancel() {
      this.isModalActive = false
    },
    async submit() {
      this.isLoading = true

      try {
        const res = await this.$axios.$put(`/cryptos/rates/NGN`, {
          ...this.rate,
        })
        const crypto = res.data

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
  },
  head() {
    return {
      title: 'Tables — CUBEX Admin',
    }
  },
}
</script>
