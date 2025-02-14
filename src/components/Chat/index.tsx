import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const ChatBar = ({ conversationId }: { conversationId: string }) => {
  const { isDisconnected, address: userAddress, isConnecting } = useAccount()

  if (isConnecting) {
    return <div>Loading</div>
  }

  return (
    <>
      {isDisconnected ? (
        <>
          <iframe className="flex h-[calc(100%-3.6rem)]" src={`https://stingray-app-u9f8x.ondigitalocean.app/${conversationId}?isCastr=${true}`} />
          <div className="flex flex-col justify-center items-center">
            <p>Connect your account to chat</p>
            <ConnectButton
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              chainStatus="none"
            />
          </div>
        </>
      ) : (
        <iframe className="h-full" src={`https://stingray-app-u9f8x.ondigitalocean.app/${conversationId}?isCastr=${false}&address=${userAddress}`} />
      )}
    </>
  )
}

export default ChatBar
