'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../src/styles/Home.module.css';

export default function HomePage() {
  const slides = [
    {
      image: '/images/1.png',
      title: "This Month's Offers & Promotions",
      buttonText: 'See Offers & Promotions',
      buttonLink: '/promotions',
      textOnRight: true,
    },
    {
      image: '/images/2.png',
      title: 'The 2025 Tundra\nThe New Definition of Grit',
      buttonText: 'Learn More',
      buttonLink: '/tundra',
      textOnRight: false,
    },
    {
      image: '/images/3.jpg',
      title: 'The 2025 Corolla Cross\nSUV that lets you do it all.',
      buttonText: 'Learn More',
      buttonLink: '/corolla-cross',
      textOnRight: false,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.homeContainer}>
      {/* Slider Section */}
      <div className={styles.slider}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div
              className={`${styles.slideContent} ${
                slide.textOnRight ? styles.textOnRight : ''
              }`}
            >
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <Link href={slide.buttonLink} className={styles.slideButton}>
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
        {/* Navigation Dots */}
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        {/* Navigation Arrows */}
        <button className={styles.arrowLeft} onClick={goToPrevSlide}>
          &lt;
        </button>
        <button className={styles.arrowRight} onClick={goToNextSlide}>
          &gt;
        </button>
      </div>

      {/* Original Hero Content (Below Slider) */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Prime Auto Exchange</h1>
          <p className={styles.heroSubtitle}>
            Discover the best deals on new and used cars. Browse our inventory or contact us to find your perfect vehicle.
          </p>
          <Link href="/inventory" className={styles.heroButton}>
            View Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}