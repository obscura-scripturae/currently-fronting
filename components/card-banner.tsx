interface CardBannerProps {
  name: string
  id: string
  type: string
}

const CardBanner = (props: CardBannerProps) => {
  const { name, id, type } = props

  return (
    <img
      className='max-h-48 object-cover mx-auto rounded'
      src={`/api/image.webp?id=${id}&type=${type}&image=banner&width=1100&height=440`}
      alt={`Banner for ${name}`}
      width={1100}
      height={440}
    />
  )
}

export default CardBanner
