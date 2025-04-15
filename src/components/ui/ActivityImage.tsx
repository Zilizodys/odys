import Image from 'next/image'

interface ActivityImageProps {
  src: string
  alt: string
  className?: string
}

export default function ActivityImage({ src, alt, className = '' }: ActivityImageProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src || '/images/placeholder.jpg'}
        alt={alt}
        fill
        className="object-cover"
        onError={(e: any) => {
          e.target.src = '/images/placeholder.jpg'
        }}
      />
    </div>
  )
} 