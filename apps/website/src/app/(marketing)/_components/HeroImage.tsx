import Image from 'next/image';
import image from '@/assets/img/hero.jpg';

export default function HeroImage() {
  return (
    <>
      <Image
        className="object-cover w-full h-full"
        src={image}
        alt="Hero image"
        fill
        placeholder="blur"
        quality={60}
        style={{ objectFit: 'cover' }}
      />
    </>
  );
}
