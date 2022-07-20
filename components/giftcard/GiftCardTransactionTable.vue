<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObjectName"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <b-table
      :checked-rows.sync="checkedRows"
      :loading="isLoading"
      :paginated="paginated"
      :per-page="perPage"
      :striped="true"
      :hoverable="true"
      default-sort="name"
      :data="data"
    >
      <template v-if="!isEmptyData" slot-scope="props">
        <b-table-column label="Name" field="name" sortable>
          {{ props.row.createdBy.name }}
        </b-table-column>
        <b-table-column label="GiftCard" field="name" sortable>
          {{ props.row.giftCard.type }}
        </b-table-column>
        <b-table-column label="Unit" field="amount" sortable>
          {{ props.row.amount }}
        </b-table-column>
        <b-table-column label="Rate" field="rate" sortable>
          {{ props.row.rate }}
        </b-table-column>
        <b-table-column label="Status" field="status" sortable>
          {{ props.row.status }}
        </b-table-column>
        <b-table-column label="Created" field="createdAt" sortable>
          <small
            class="has-text-grey is-abbr-like"
            :title="props.row.createdAt"
            >{{ props.row.createdAt | displayDate }}</small
          >
        </b-table-column>
        <b-table-column custom-key="actions" class="is-actions-cell">
          <div class="buttons is-right">
            <nuxt-link
              :to="`/giftCard/transactions/${props.row.id}`"
              class="button is-small is-primary"
            >
              <b-icon icon="eye" size="is-small" />
            </nuxt-link>
          </div>
        </b-table-column>
      </template>

      <section v-else slot="empty" class="section">
        <div class="content has-text-grey has-text-centered">
          <template v-if="isLoading">
            <p>
              <b-icon icon="dots-horizontal" size="is-large" />
            </p>
            <p>Fetching data...</p>
          </template>
          <template v-else>
            <p>
              <b-icon icon="emoticon-sad" size="is-large" />
            </p>
            <p>Nothing's here&hellip;</p>
          </template>
        </div>
      </section>
    </b-table>
  </div>
</template>

<script>
import ModalBox from '@/components/ModalBox'
import { isEmpty } from 'lodash'

export default {
  name: 'GiftCardTransactionTable',
  components: { ModalBox },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isModalActive: false,
      trashObject: null,
      paginated: false,
      perPage: 10,
      checkedRows: [],
    }
  },
  computed: {
    trashObjectName() {
      if (this.trashObject) {
        return this.trashObject.name
      }

      return null
    },
    isEmptyData() {
      return isEmpty(this.data)
    },
  },
  methods: {
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
}
</script>
