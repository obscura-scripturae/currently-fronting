import { Member, System } from '../util/types'
import {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  Text,
} from 'html-react-parser'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import CardAvatar from './card-avatar'
import CardBanner from './card-banner'
import CardPronouns from './card-pronouns'
import CardDescription from './card-description'

interface CardProps {
  member?: Member
  system?: System
}

const timestampRegex = /<t:(\d{10})(:[tTdDfFR])?>/g

const htmlReactParserOptions = {
  replace: (node: DOMNode) => {
    if (
      node instanceof Element &&
      node.name === 'img' &&
      node.attribs.class.split(' ').includes('d-emoji')
    ) {
      return (
        <img
          className={`${node.attribs.class} max-h-4 inline`}
          src={node.attribs.src}
          alt={node.attribs.alt}
        />
      )
    }
    if (node.type === 'text' && timestampRegex.test((node as Text).data)) {
      const textNodeData = (node as Text).data
      const formattedDateTime = textNodeData.replaceAll(
        timestampRegex,
        (match, p1, p2) => {
          const timestamp = DateTime.fromSeconds(parseInt(p1))
          const format: string = p2 ? p2[1] : 'f'
          if (format !== 'R') {
            let dateTimeFormatOptions = {
              t: { timeStyle: 'short' },
              T: { timeStyle: 'medium' },
              d: { dateStyle: 'short' },
              D: { dateStyle: 'medium' },
              f: { dateStyle: 'medium', timeStyle: 'short' },
              F: { dateStyle: 'full', timeStyle: 'short' },
            }[format]
            return timestamp.toLocaleString(
              dateTimeFormatOptions as DateTimeFormatOptions,
            )
          }
          return timestamp.toRelative() as string
        },
      )
      return <span>{formattedDateTime}</span>
    }
  },
} as HTMLReactParserOptions

const Card = (props: CardProps) => {
  const { member, system } = props

  const cardClasses = system
    ? 'container max-w-md p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-center rounded'
    : 'container max-w-md p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-center rounded flex flex-col items-center gap-2'
  return (
    <div className={cardClasses}>
      {member?.banner && (
        <CardBanner name={member.name} id={member.id} type='members' />
      )}
      {system?.banner && (
        <CardBanner name={system.name} id={system.id} type='systems' />
      )}
      <div>
        {member?.avatar_url && (
          <CardAvatar
            name={member.name}
            id={member.id}
            type='members'
            color={member.color}
          />
        )}
        {system?.avatar_url && (
          <CardAvatar
            name={system.name}
            id={system.id}
            type='systems'
            color={system.color}
          />
        )}
        <div>
          <h1 className='text-xl font-bold'>{member?.name ?? system?.name}</h1>
          {member && member.display_name && (
            <h2 className='text-lg italic'>{member.display_name}</h2>
          )}
          {system && <h2 className='text-lg italic'>System</h2>}
          {member?.pronouns && (
            <CardPronouns
              pronouns={member.pronouns}
              htmlReactParserOptions={htmlReactParserOptions}
            />
          )}
          {system?.pronouns && (
            <CardPronouns
              pronouns={system.pronouns}
              htmlReactParserOptions={htmlReactParserOptions}
            />
          )}
          {member?.birthday && <div className='italic'>{member.birthday}</div>}
          {member?.description && (
            <CardDescription
              description={member.description}
              htmlReactParserOptions={htmlReactParserOptions}
            />
          )}
          {system?.description && (
            <CardDescription
              description={system.description}
              htmlReactParserOptions={htmlReactParserOptions}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
