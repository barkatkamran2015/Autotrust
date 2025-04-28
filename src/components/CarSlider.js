// src/components/CarSlider.js
"use client";

import dynamic from 'next/dynamic';

const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
  loading: () => <div className="slider-loading">Loading images...</div>,
});

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../../src/styles/CarDetail.module.css';

export default function CarSlider({ images, make, model }) {
  const validImages = Array.isArray(images) && images.length > 0 ? images : ['/uploads/cars/default.jpg'];

  const sliderSettings = {
    dots: true,
    infinite: validImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    adaptiveHeight: false, // Prevent height flickering
    responsive: [
      {
        breakpoint: 768, // Tablet and below
        settings: {
          arrows: false, // Hide arrows on smaller screens
          dots: true,
        },
      },
      {
        breakpoint: 480, // Mobile
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className={styles.imageSlider}>
      <Slider {...sliderSettings}>
        {validImages.map((img, index) => (
          <div key={index} className={styles.sliderItem}>
            <img
              src={img}
              alt={`${make} ${model} image ${index + 1}`}
              className={styles.sliderImage}
              onError={(e) => {
                console.log('Image failed to load:', img);
                e.target.src = '/uploads/cars/default.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}