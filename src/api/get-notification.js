import { useWorkspace } from '@/composables'
// import { Notification } from '@/models'

export const getNotification = async (publicKey) => {
    const { program } = useWorkspace()
    const allNotificationAccount = await program.value.account.notification.all([
        {
            memcmp: {
                offset: 8+ // Discriminator.
                  32, // notification public key.
                bytes: publicKey,
            }
        }
    ]);

    return allNotificationAccount
}
