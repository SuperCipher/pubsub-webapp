import { web3 } from '@project-serum/anchor'
import { useWorkspace } from '@/composables'
import { Tweet } from '@/models'

export const sendTweet = async (topic, content) => {
    const { wallet, program } = useWorkspace()
    const event = web3.Keypair.generate()

    await program.value.rpc.createEvent(topic, content, {
        accounts: {
            author: wallet.value.publicKey,
            event: event.publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [event]
    })

    const eventAccount = await program.value.account.event.fetch(event.publicKey)
    return new Tweet(event.publicKey, eventAccount)
}
