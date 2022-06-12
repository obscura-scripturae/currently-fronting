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
      src={`/api/image.webp?id=${id}&type=${type}&image=avatar_url&width=172&height=172`}
      alt={`Avatar for ${name}`}
      style={{
        borderColor: `#${color}`,
      }}
      width={172}
      height={172}
    />
  )
}

export default CardAvatar
