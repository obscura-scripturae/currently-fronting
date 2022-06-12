interface CardAvatarProps {
  name: string
  avatar_url: string
  color: string
}

const CardAvatar = (props: CardAvatarProps) => {
  const { name, avatar_url, color } = props

  return (
    <img
      className='max-h-48 border-4 object-cover rounded float-left mr-2'
      src={`/api/image.webp?url=${encodeURIComponent(
        avatar_url,
      )}&width=256&height=256`}
      alt={`Avatar for ${name}`}
      style={{
        borderColor: `#${color}`,
      }}
    />
  )
}

export default CardAvatar
