import Image from "next/image";

const images = [
  "/img/gallery1.jpg",
  "/img/gallery2.jpg",
  "/img/gallery3.jpg",
  "/img/gallery4.jpg",
  "/img/gallery5.jpg",
  "/img/gallery6.jpg",
  "/img/gallery7.jpg",
  "/img/gallery8.jpg",
  "/img/gallery9.jpg",
  "/img/gallery10.jpg",
  "/img/gallery11.jpg",
  "/img/gallery12.jpg",
  "/img/gallery13.jpg",
  "/img/gallery14.jpg",
  "/img/gallery15.jpg",
  "/img/gallery16.jpg",
];
export default function GallerySection() {
  return (
    <section className="gallery">
      <div className="landing-section-title">
        <b>Gallery</b> <span className="from">from</span> the past events
      </div>
      <div className="content-container xlarge">
        {images.map((img, i) => (
          <div key={`gallery-0${i}`} className="img-container relative">
            <Image
              className="object-cover object-center w-full h-full"
              fill
              src={img}
              alt={`gallery-0${i}`}
              quality={50}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
