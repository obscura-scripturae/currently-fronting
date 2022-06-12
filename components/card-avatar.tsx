interface CardAvatarProps {
  name: string
  id: string
  type: string
  color: string
}

const CardAvatar = (props: CardAvatarProps) => {
  const { name, id, type, color } = props

  return (
    <img
      className='max-h-48 border-4 object-cover rounded float-left mr-2'
      src={`/api/image.webp?id=${id}&type=${type}&image=avatar_url&width=256&height=256`}
      alt={`Avatar for ${name}`}
      style={{
        borderColor: `#${color}`,
      }}
    />
  )
}

export default CardAvatar
