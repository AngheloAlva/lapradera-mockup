import Image from 'next/image'

import { ScrollReveal } from '@/lib/motion'

interface PageHeroImage {
  url: string
  alt: string
}

interface PageHeroProps {
  badge: string
  title: string
  description: string
  images: PageHeroImage[]
}

function SingleImage({ image }: { image: PageHeroImage }) {
  return (
    <ScrollReveal delay={0.15} className="relative">
      <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-pradera-200" />
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-lg">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </ScrollReveal>
  )
}

function TwoImages({ images }: { images: PageHeroImage[] }) {
  return (
    <ScrollReveal delay={0.15} className="relative">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 relative aspect-3/4 overflow-hidden rounded-3xl shadow-lg">
          <Image
            src={images[0].url}
            alt={images[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1424px) 60vw, 35vw"
          />
        </div>
        <div className="col-span-5 relative mt-12 aspect-3/4 overflow-hidden rounded-3xl shadow-lg">
          <Image
            src={images[1].url}
            alt={images[1].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 40vw, 25vw"
          />
        </div>
      </div>
    </ScrollReveal>
  )
}

function ThreeImages({ images }: { images: PageHeroImage[] }) {
  return (
    <ScrollReveal delay={0.15} className="relative">
      <div className="grid grid-cols-12 gap-3" style={{ gridTemplateRows: '1fr 1fr' }}>
        <div className="col-span-7 row-span-2 relative aspect-3/4 overflow-hidden rounded-3xl shadow-lg">
          <Image
            src={images[0].url}
            alt={images[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 60vw, 35vw"
          />
        </div>
        <div className="col-span-5 relative aspect-square overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={images[1].url}
            alt={images[1].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 40vw, 20vw"
          />
        </div>
        <div className="col-span-5 relative aspect-square overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={images[2].url}
            alt={images[2].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 40vw, 20vw"
          />
        </div>
      </div>
    </ScrollReveal>
  )
}

export function PageHero({ badge, title, description, images }: PageHeroProps) {
  const hasImages = images.length > 0

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className={hasImages ? 'grid grid-cols-1 items-center gap-12 lg:grid-cols-2' : ''}>
          {/* Text */}
          <ScrollReveal>
            <span className="inline-block rounded-full border border-pradera-400 bg-pradera-50 px-5 py-2 text-xs font-medium text-pradera-600 uppercase tracking-widest mb-6">
              {badge}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-400">{description}</p>
          </ScrollReveal>

          {/* Images */}
          {images.length === 1 && <SingleImage image={images[0]} />}
          {images.length === 2 && <TwoImages images={images} />}
          {images.length >= 3 && <ThreeImages images={images.slice(0, 3)} />}
        </div>
      </div>
    </section>
  )
}
