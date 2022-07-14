<template>
  <div id="app">
    <nav-bar />
    <aside-menu :menu="menu" />
    <nuxt />
    <footer-bar />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import FooterBar from '@/components/FooterBar'

export default {
  name: 'Home',
  middleware: 'authenticated',
  components: {
    FooterBar,
    AsideMenu,
    NavBar,
  },
  computed: {
    menu() {
      return [
        'General',
        [
          {
            to: '/',
            icon: 'desktop-mac',
            label: 'Dashboard',
          },
        ],
        'Crypto',
        [
          {
            to: '/crypto',
            label: 'Crypto',
            icon: 'coin',
            updateMark: true,
          },
          {
            to: '/crypto/transactions',
            label: 'Transactions',
            icon: 'coins',
            updateMark: true,
          },
        ],
        'GiftCard',
        [
          {
            to: '/giftcard',
            label: 'GiftCards',
            icon: 'gift',
            updateMark: true,
          },
          {
            to: '/giftcard/transactions',
            label: 'Transactions',
            icon: 'wallet-giftcard',
            updateMark: true,
          },
        ],
        'Users',
        [
          {
            to: '/tables',
            label: 'List',
            icon: 'table',
            updateMark: true,
          },
          {
            to: '/profile',
            label: 'Profile',
            icon: 'account-circle',
          },
        ],
        'Not Used',
        [
          {
            to: '/forms',
            label: 'Forms',
            icon: 'square-edit-outline',
          },
          // {
          //   label: 'Submenus',
          //   subLabel: 'Submenus Example',
          //   icon: 'view-list',
          //   menu: [
          //     {
          //       href: '#void',
          //       label: 'Sub-item One',
          //     },
          //     {
          //       href: '#void',
          //       label: 'Sub-item Two',
          //     },
          //   ],
          // },
        ],
      ]
    },
  },
  mounted() {
    document.documentElement.classList.add('has-aside-left')
    document.documentElement.classList.add('has-aside-mobile-transition')
    document.documentElement.classList.add('has-navbar-fixed-top')
    document.documentElement.classList.add('has-aside-expanded')
  },
  methods: {
    head() {
      return {
        title: 'Client — CUBEX Admin',
      }
    },
  },
}
</script>
