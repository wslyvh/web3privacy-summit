import { useEffect, useState } from 'react'
import { useStage } from 'hooks/useStage'
import { useSessions } from 'hooks/useSessions'
import { Player } from 'components/Player'
import { StageContainer } from 'components/Container'
import SpeakerModalBox from 'components/Speaker/ModalBox'
import SessionList from 'components/Session/List'
import Modal from '../Modal'
import { ShareBox } from '../Share/Box'
import { Speaker } from 'types'
import Embed from 'components/Embed'
import SessionInfoBox from 'components/Session/Infobox'
import Tab from './Tab'
import ChatBar from 'components/Chat'
import SubNavigation from 'components/Navbar/SubNavigation'
export function StageComponent() {
  const currentStage = useStage()
  const { sessions, addOrUpdateFilter, currentSession } = useSessions()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<string | null>(null)
  const [speaker, setSpeaker] = useState<Speaker | undefined>(undefined)
  const [tab, setTab] = useState<number>(0)

  const activeSession = currentSession ?? sessions[0]

  useEffect(() => {
    addOrUpdateFilter({ type: 'stage', value: currentStage.id })
    //addOrUpdateFilter({ type: 'day', value: moment().startOf('day').valueOf() })
  }, [currentStage, addOrUpdateFilter])

  const openModal = (type: 'share' | 'speaker' | 'embed', speaker?: Speaker) => {
    setModalContentType(type)
    setSpeaker(speaker)
    setModalOpen(true)
  }

  const modalContent = () => {
    if (modalContentType === 'share') {
      return <ShareBox title={activeSession.name} />
    } else if (modalContentType === 'speaker') {
      return <SpeakerModalBox speaker={speaker} />
    } else if (modalContentType === 'embed') {
      return <Embed stageId={currentStage.id} />
    }
    return null
  }

  return (
    <div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent()}
      </Modal>
      <SubNavigation>
        <div className="py-2 flex justify-between items-center dark:text-gray-400">
          <div className="flex flex-col">
            <p className="font-thin text-white">WATCHING:</p>
            <p className="font-medium text-white">{`${activeSession?.name}`}</p>
          </div>
          {/* <div className="hidden md:flex flex-col">
            <p className="font-thin text-white">NEXT:</p>
            <p className="font-medium text-white">{`${sessions[1]?.name}`}</p>
          </div> */}
        </div>
      </SubNavigation>
      <StageContainer>
        <div className="flex flex-col lg:flex-row h-full relative overflow-scroll">
          <div className="flex flex-col w-full lg:px-8 lg:py-2">
            <Player streamId={currentStage.stream[0]} playerName={currentStage.name} />
            <div className="hidden md:block">
              <SessionInfoBox
                session={activeSession}
                onShareClick={() => openModal('share')}
                onSpeakerClick={(speaker) => openModal('speaker', speaker)}
                onEmbedClick={() => openModal('embed')}
              />
            </div>
          </div>
          <div className="h-1/2 lg:w-1/3 p-3 flex-grow  lg:pl-0 lg:pb-2 lg:pt-2 lg:pr-4 box-border flex flex-col overflow-auto lg:mt-0 lg:h-full">
            <div className="flex flex-row">
              <Tab index={0} currentIndex={tab} setIndex={() => setTab(0)}>
                Schedule
              </Tab>
              <Tab index={1} currentIndex={tab} setIndex={() => setTab(1)}>
                Chat
              </Tab>
            </div>
            <div className="flex flex-col w-full overflow-y-auto h-full">
              {tab === 0 && <SessionList sessions={sessions} currentSession={activeSession} isLive={false} />}
              {tab === 1 && <ChatBar conversationId={currentStage.id} />}
            </div>
          </div>
        </div>
      </StageContainer>
    </div>
  )
}
