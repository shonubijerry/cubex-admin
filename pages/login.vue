<template>
  <div>
    <section class="section hero is-fullheight is-error-section">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-two-fifths">
              <card-component title="Login" icon="lock" class="tile is-child">
                <form ref="loginForm" @submit.prevent="submit">
                  <b-field label="E-mail" message="Email required">
                    <b-input
                      v-model="userEmail"
                      class="control is-clearfix"
                      name="email"
                      type="email"
                      required
                      autocomplete="true"
                      :rules="rules.email"
                    />
                  </b-field>
                  <b-field label="Password" message="Password required">
                    <b-input
                      v-model="password"
                      type="password"
                      :rules="rules.password"
                      password-reveal
                    >
                    </b-input>
                  </b-field>

                  <b-field>
                    <div class="control">
                      <button
                        type="submit"
                        class="button is-primary"
                        :class="{
                          'is-loading': isLoading,
                        }"
                      >
                        Submit
                      </button>
                    </div>
                  </b-field>
                </form>
              </card-component>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CardComponent from '@/components/CardComponent'
import { EMAIL_OR_PHONE_REGEX } from '@/services/constants'

export default {
  name: 'Login',
  layout: 'auth',
  middleware: 'anonymous',
  components: {
    CardComponent,
  },
  data() {
    return {
      userEmail: '',
      password: '',
      signingIn: false,
      errorText: '',
      isLoading: false,
      rules: {
        required: [(v) => !!v || 'This field is required'],
        emailOrPhone: [
          (v) => !!v || 'This field is required',
          (v) =>
            EMAIL_OR_PHONE_REGEX.test(v) ||
            'Please enter a valid email or phone number',
        ],
      },
    }
  },
  computed: {
    titleStack() {
      return ['Admin', 'Profile']
    },
  },
  methods: {
    ...mapActions(['login']),
    async submit() {
      this.isLoading = true
      const credentials = {
        username: this.userEmail,
        password: this.password,
      }
      try {
        const response = await this.login(credentials)
        if (response) {
          this.$router.push('/')
        }
      } catch (error) {
        const errorMessage = error.message
        this.$buefy.snackbar.open({
          message: errorMessage,
          queue: false,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
  head() {
    return {
      title: 'Profile — CUBEX Admin',
    }
  },
}
</script>
