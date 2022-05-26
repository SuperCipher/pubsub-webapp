import { useWorkspace } from '@/composables'
import { web3 } from '@project-serum/anchor'

export const notify = async (proof, eventKey) => {
  const { wallet, program } = useWorkspace()
  const notifierAccount = web3.Keypair.generate()

  await program.value.rpc.notify( proof, {
      accounts: {
          notification: notifierAccount.publicKey,
          notifier: wallet.value.publicKey,
          event: eventKey,
          systemProgram: web3.SystemProgram.programId,
      },
      signers: [notifierAccount],
  });

  const fetchedNotificationAccount = await program.value.account.notification.fetch(notifierAccount.publicKey);
  return new Notification(notifierAccount.publicKey, fetchedNotificationAccount)
}
