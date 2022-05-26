<script setup>
import { ref, toRefs, computed } from 'vue'
import { useWorkspace,useCountCharacterLimit } from '@/composables'
import { useWallet } from 'solana-wallets-vue'
import { notify } from '@/api'

const props = defineProps({
    tweet: Object,
})

const { tweet } = toRefs(props)
const proof = ref('')
const { wallet } = useWorkspace()
const isMyTweet = computed(() => wallet.value && wallet.value.publicKey.toBase58() === tweet.value.author.toBase58())
const authorRoute = computed(() => {
    if (isMyTweet.value) {
        return { name: 'Profile' }
    } else {
        return { name: 'Users', params: { author: tweet.value.author.toBase58() } }
    }
})
const characterLimit = useCountCharacterLimit(proof, 280)

const canNotify = computed(() => proof.value && characterLimit.value >= 0)


// Actions.
const emit = defineEmits(['notified'])
const notifySequence = async () => {
    if (! canNotify.value) return
    console.log("proof.value",proof.value)
    console.log("tweet",tweet)
    console.log("tweet.key",tweet.value.key)

    const notification = await notify( proof.value, tweet.value.key)
    emit('notified', notification)
    proof.value = ''
}

const isEditing = ref(false)
const { connected } = useWallet()


</script>

<template>
    <tweet-form-update v-if="isEditing" :tweet="tweet" @close="isEditing = false"></tweet-form-update>
    <div class="px-8 py-4" v-else>
        <div class="flex justify-between">
            <div class="py-1">
                <h3 class="inline font-semibold" :title="tweet.author">
                    <router-link :to="authorRoute" class="hover:underline">
                        {{ tweet.author_display }}
                    </router-link>
                </h3>
                <span class="text-gray-500"> • </span>
                <time class="text-gray-500 text-sm" :title="tweet.created_at">
                    <router-link :to="{ name: 'Tweet', params: { tweet: tweet.publicKey.toBase58() } }" class="hover:underline">
                        {{ tweet.created_ago }}
                    </router-link>
                </time>
            </div>
            <div class="flex" v-if="isMyTweet">
                <button @click="isEditing = true" class="flex px-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-gray-100" title="Update tweet">
                  Subscript
                </button>
            </div>
        </div>
        <p class="whitespace-pre-wrap break-all mb-3" v-text="tweet.content"></p>
        <router-link v-if="tweet.topic" :to="{ name: 'Topics', params: { topic: tweet.topic } }" class="inline-block mt-2 text-pink-500 hover:underline break-all">
            #{{ tweet.topic }}
        </router-link>

        <!-- Notification -->
        <div v-if="!isMyTweet" class="px-8 py-4 border-b">

            <div class="flex flex-wrap items-center justify-between -m-2">

                <!-- Proof field. -->
                <div class="relative m-2 mr-4">
                    <input
                        type="text"
                        placeholder="proof"
                        class="text-pink-500 rounded-full pl-10 pr-4 py-2 bg-gray-100"
                        :value="effectiveTopic"
                        :disabled="forcedTopic"
                        @input="proof = $event.target.value"
                    >
                </div>
                <div class="flex items-center space-x-6 m-2 ml-auto">

                    <!-- Tweet button. -->
                    <button
                        class="text-white px-4 py-2 rounded-full font-semibold" :disabled="! connected"
                        :class="connected ? 'bg-red-500' : 'bg-pink-300 cursor-not-allowed'"
                        @click="notifySequence"
                    >
                        Notify
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>
