import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Card from '../components/card'
import { Switch, System } from '../util/types'

interface FrontersAndSystem {
  fronters: Switch | null
  system: System | null
}

type FrontersAndSystemKey = string | string[] | undefined
type FrontersAndSystemKeys = FrontersAndSystemKey[]

const getFrontersAndSystem = async (
  systemID: FrontersAndSystemKey,
  includeSystem: FrontersAndSystemKey,
) => {
  let system: System | null = null
  if (
    includeSystem === 'true' ||
    (includeSystem === '1' && typeof systemID === 'string')
  ) {
    const systemData = await fetch(
      `https://api.pluralkit.me/v2/systems/${systemID}`,
    )
    if (systemData.ok) {
      system = await systemData.json()
    }
  }

  let fronters: Switch | null = null
  if (typeof systemID === 'string') {
    const frontersData = await fetch(
      `https://api.pluralkit.me/v2/systems/${systemID}/fronters`,
    )
    if (frontersData.ok) {
      fronters = await frontersData.json()
    }
  }

  return { fronters: fronters, system: system }
}

const getServerSideProps: GetServerSideProps = async context => {
  const { fronters, system } = await getFrontersAndSystem(
    context.params?.systemID,
    context.params?.s,
  )

  return {
    props: {
      fallback: { fronters, system },
    },
  }
}

const useFrontersAndSystem = (frontersAndSystemKeys: FrontersAndSystemKeys) => {
  const { data } = useSWR<FrontersAndSystem>(
    [frontersAndSystemKeys[0], frontersAndSystemKeys[1]],
    (systemID, includeSystem) => getFrontersAndSystem(systemID, includeSystem),
    { refreshInterval: 30 * 1000 },
  )

  const { fronters, system } = data ? data : { fronters: null, system: null }
  return {
    fronters,
    system,
  }
}

const Home: NextPage = () => {
  const router = useRouter()
  const { systemID, s } = router.query
  const { fronters, system } = useFrontersAndSystem([systemID, s])

  return (
    <div>
      <div className='container mx-auto p-2 flex flex-row flex-wrap justify-center gap-2'>
        <Head>
          <title>
            {fronters
              ? fronters.members.map(member => member.name).join(' | ')
              : 'currently fronting'}
          </title>
          <meta
            name='description'
            content={
              system
                ? `Current fronters for ${system.name}`
                : 'currently fronting'
            }
          />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        {fronters &&
          fronters?.members.map(member => (
            <Card key={member.uuid} member={member} />
          ))}
      </div>
      <div className='container mx-auto p-2 flex flex-row flex-wrap justify-center'>
        {system && <Card key={system.uuid} system={system} />}
      </div>

      {/* prettier-ignore */}
      <footer className='container mx-auto max-w-4xl p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-center rounded'>
      Powered by <span className="italic">a lot</span> of <a href="https://github.com/obscura-scripturae/currently-fronting/blob/main/package.json">open source software</a> and designed to interface with <a href="https://pluralkit.me/">PluralKit</a>. Developed by <a href="https://github.com/pulchra-mentis">pulchra mentis</a> and available under the <a href="https://github.com/obscura-scripturae/currently-fronting/blob/main/LICENSE">AGPL 3.0 license</a>. Find a bug? Follow the instructions on <a href="https://github.com/obscura-scripturae/currently-fronting">GitHub</a> in the README.
    </footer>
    </div>
  )
}

export { getServerSideProps }
export default Home
