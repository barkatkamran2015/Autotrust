import { notFound, redirect } from 'next/navigation';
import CarSlider from '../../../src/components/CarSlider';
import styles from '../../../src/styles/CarDetails.module.css';
import Link from 'next/link';

async function fetchCar(id) {
  console.log('Fetching car with ID:', id);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-car?id=${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch failed with status:', res.status, 'Response:', errorText);
    throw new Error(`Failed to fetch car: ${res.status} - ${errorText}`);
  }
  const data = await res.json();
  console.log('Fetched car data from API:', data);
  return data;
}

export default async function CarDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log('Rendering detail page for ID from params:', id);

  if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
    console.log('Invalid ID parameter detected:', id, 'Type:', typeof id);
    redirect('/inventory');
  }

  let car;
  try {
    car = await fetchCar(id);
    if (!car || !car.id) {
      console.log('No car data or invalid car object for ID:', id, 'Car data:', car);
      redirect('/inventory');
    }
  } catch (err) {
    console.error('Error fetching car:', err.message);
    redirect('/inventory');
  }

  const images = Array.isArray(car.images) && car.images.length > 0 ? car.images : ['/uploads/cars/default.jpg'];
  console.log('Images for slider:', images);

  // Log the number of features to confirm
  console.log(`Rendering ${car.features?.length || 0} features:`, car.features);

  return (
    <div className={styles.carDetailSection}>
      <div className={styles.carDetailCard}>
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
            <p><strong>Location:</strong> {car.location || 'N/A'}</p>
            <p><strong>VIN:</strong> {car.vin || 'N/A'}</p>
            <p><strong>Exterior Color:</strong> {car.exteriorColor || 'N/A'}</p>
            <p><strong>Interior Color:</strong> {car.interiorColor || 'N/A'}</p>
            <p><strong>Engine Size:</strong> {car.engineSize || 'N/A'}</p>
            <p><strong>Horsepower:</strong> {car.horsepower ? car.horsepower.toLocaleString() : 'N/A'} HP</p>
            <p><strong>Drive Type:</strong> {car.driveType || 'N/A'}</p>
            <p><strong>Status:</strong> {car.status || 'N/A'}</p>
          </div>
          {car.features && car.features.length > 0 && (
            <div className={styles.featuresContainer}>
              <h3 className={styles.featuresTitle}>FEATURES</h3>
              <div className={styles.featuresList}>
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className={styles.featureBadge}
                    style={{ '--index': index }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className={styles.carDescription}>
            <strong>Description:</strong> {car.description || 'No description provided.'}
          </p>
          <div className={styles.sellerInfo}>
            <h2 className={styles.sellerTitle}>Seller Information</h2>
            <p><strong>Name:</strong> {car.sellerName || 'N/A'}</p>
            <p><strong>Email:</strong> {car.sellerEmail ? <a href={`mailto:${car.sellerEmail}`} className={styles.sellerEmail}>{car.sellerEmail}</a> : 'N/A'}</p>
          </div>
        </div>
        <Link href="/inventory" className={styles.backButton}>
          Back to Inventory
        </Link>
      </div>
    </div>
  );
}