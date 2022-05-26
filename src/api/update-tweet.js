import { useWorkspace } from '@/composables'

export const updateTweet = async (tweet, topic, content) => {
    const { wallet, program } = useWorkspace()
    await program.value.rpc.updateEvent(topic, content, {
        accounts: {
            author: wallet.value.publicKey,
            event: tweet.publicKey,
        },
    })

    tweet.topic = topic
    tweet.content = content
}
