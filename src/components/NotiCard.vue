<script setup>
import {  toRefs, computed } from 'vue'
import { useWorkspace } from '@/composables'
import dayjs from "dayjs"

// import { useWallet } from 'solana-wallets-vue'

const props = defineProps({
    noti: Object,
})
const { noti } = toRefs(props)
console.log('NOTI', noti)
console.log('noti.value.account.eventKey.toBase58()', noti.value.account.eventKey.toBase58())
const { wallet } = useWorkspace()
const isMyTweet = computed(() => wallet.value && wallet.value.publicKey.toBase58() === noti.value.account.notifier.toBase58())
const authorRoute = computed(() => {
    if (isMyTweet.value) {
        return { name: 'Profile' }
    } else {
        return { name: 'Users', params: { author: noti.value.account.notifier.toBase58() } }
    }
})
console.log('NOTI.VALUE.ACCOUNT.NOTIFIER.TOBASE58()', noti.value.account.notifier.toBase58())
const notifier = noti.value.account.notifier.toBase58()
const notifierDisplay = notifier.slice(0,4) + '..' + notifier.slice(-4)
const createdAt = dayjs.unix(noti.value.account.timestamp).format('lll')
const createdAgo = dayjs.unix(noti.value.account.timestamp).fromNow()

</script>

<template>
  <div class="px-8 py-4">
    <div class="flex justify-between">
        <div class="py-1">
            <h3 class="inline font-semibold" :title="noti.account.proof">
                <router-link :to="authorRoute" class="hover:underline">
                    {{ notifierDisplay }}
                </router-link>
            </h3>
            <span class="text-gray-500"> • </span>
            <time class="text-gray-500 text-sm" :title="createdAt">
                <router-link :to="{ name: 'Tweet', params: { tweet: noti.publicKey.toBase58() } }" class="hover:underline">
                    {{ createdAgo }}
                </router-link>
            </time>
        </div>
        <div class="flex" v-if="!isMyTweet">
            <button @click="reward" class="border-solid border-2 border-blue-500 flex px-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-gray-100" title="Reward">
                Reward
            </button>
        </div>
    </div>
  </div>
</template>
