import { notFound } from 'next/navigation';
import CarSlider from '../../../src/components/CarSlider';
import styles from '../../../src/styles/CarDetails.module.css';
import Link from 'next/link';

async function fetchCar(id) {
  console.log('Fetching car with ID:', id);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-cars?id=${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.log('Fetch failed with status:', res.status, 'Error:', errorData);
    throw new Error(errorData.error || 'Failed to fetch car');
  }
  const data = await res.json();
  console.log('Fetched car data:', data);
  return data;
}

export default async function CarDetailPage({ params }) {
  const { id } = params;
  console.log('Rendering detail page for ID:', id);
  let car;
  try {
    car = await fetchCar(id);
    if (!car || !car.id) {
      console.log('No car data returned for ID:', id);
      notFound();
    }
  } catch (err) {
    console.error('Error fetching car:', err);
    notFound();
  }

  const images = Array.isArray(car.images) && car.images.length > 0 ? car.images : ['/Uploads/cars/default.jpg'];
  console.log('Images for slider:', images);

  return (
    <div className={styles.carDetailSection}>
      <div className={styles.container}>
        <h1 className={styles.carDetailTitle}>
          {car.make || 'Unknown Make'} {car.model || 'Unknown Model'} ({car.year || 'N/A'})
        </h1>
        <CarSlider images={images} make={car.make || 'Unknown'} model={car.model || 'Unknown'} />
        <div className={styles.carDetails}>
          <div className={styles.carDetailsGrid}>
            <p><strong>Price:</strong> ${car.price ? car.price.toLocaleString() : 'N/A'}</p>
            <p><strong>Mileage:</strong> {car.mileage ? car.mileage.toLocaleString() : 'N/A'} miles</p>
            <p><strong>Fuel Type:</strong> {car.fuelType || 'N/A'}</p>
            <p><strong>Transmission:</strong> {car.transmission || 'N/A'}</p>
            <p><strong>Condition:</strong> {car.condition ? car.condition.charAt(0).toUpperCase() + car.condition.slice(1) : 'N/A'}</p>
          </div>
          <p className={styles.carDescription}><strong>Description:</strong> {car.description || 'No description provided.'}</p>
        </div>
        <Link href="/inventory" className={styles.backButton}>
          Back to Inventory
        </Link>
      </div>
    </div>
  );
}