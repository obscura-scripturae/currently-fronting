interface CardBannerProps {
  name: string
  banner: string
}

const CardBanner = (props: CardBannerProps) => {
  const { name, banner } = props

  return (
    <img
      className='max-h-48 object-cover mx-auto rounded'
      src={`/api/image.webp?url=${encodeURIComponent(
        banner,
      )}&width=1100&height=440`}
      alt={`Banner for ${name}`}
    />
  )
}

export default CardBanner
