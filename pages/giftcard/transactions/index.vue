<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <card-component
        class="has-table has-mobile-sort-spaced"
        title="Transactions"
        icon="coin"
      >
        <GiftCardTransactionTable :data="data" :is-loading="isLoading" />
      </card-component>
    </section>
  </div>
</template>

<script>
import GiftCardTransactionTable from '@/components/giftcard/GiftCardTransactionTable'
import CardComponent from '@/components/CardComponent'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'Tables',
  components: {
    TitleBar,
    CardComponent,
    GiftCardTransactionTable,
  },
  data() {
    return {
      data: [],
      isLoading: false,
      paginated: false,
    }
  },
  computed: {
    titleStack() {
      return ['GiftCard Transactions']
    },
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true
        const res = await this.$axios.$get('/giftcards/transaction')
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
  },
  head() {
    return {
      title: 'Tables — CUBEX Admin',
    }
  },
}
</script>
