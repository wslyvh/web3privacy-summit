import { GetStaticProps } from 'next'
import { Stage, Session, page } from 'types'
import ScheduleComponent from 'components/Schedule/ScheduleComponent'
import { SEO } from 'components/seo'
import { GetStages, GenerateNavigation } from 'services/stage'
import { GetSessions } from 'services/sessions'
import { PageContextProvider } from 'context/page-context'
import DefaultLayout from 'layouts/default'
import { StageComponent } from 'components/Stage/StageComponent'

interface Props {
  stages: Stage[]
  stage: Stage
  sessions: Session[]
  pages: page[]
}

export default function StagePage({ stage, sessions, pages }: Props) {
  return (
    <PageContextProvider sessions={sessions} stage={stage}>
      <DefaultLayout pages={pages}>
        <SEO title='Schedule' />
        <ScheduleComponent />
      </DefaultLayout>
    </PageContextProvider>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const sessions = await GetSessions()
  const pages = await GenerateNavigation()
  const stages = await GetStages()

  const stage = stages[0]
  if (!stage) return { props: null, notFound: true }

  return {
    props: {
      stages,
      stage,
      sessions,
      pages,
    },
  }
}
