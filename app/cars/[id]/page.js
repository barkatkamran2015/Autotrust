import { redirect } from 'next/navigation';
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

  // Prepare specifications to render with badge design (excluding make, model, sellerName, sellerEmail, Images, Description)
  const specifications = [
    { label: 'Year', value: car.year ? String(car.year) : null },
    { label: 'Price', value: car.price ? `$${car.price.toLocaleString()}` : null },
    { label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} miles` : null },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Transmission', value: car.transmission },
    { label: 'Condition', value: car.condition ? car.condition.charAt(0).toUpperCase() + car.condition.slice(1) : null },
    { label: 'Location', value: car.location },
    { label: 'VIN', value: car.vin },
    { label: 'Exterior Color', value: car.exteriorColor },
    { label: 'Interior Color', value: car.interiorColor },
    { label: 'Engine Size', value: car.engineSize },
    { label: 'Horsepower', value: car.horsepower ? `${car.horsepower.toLocaleString()} HP` : null },
    { label: 'Drive Type', value: car.driveType },
    { label: 'Features', value: car.features }, // Already an array
    { label: 'Status', value: car.status },
  ].filter(spec => spec.value); // Exclude null or empty values

  return (
    <div className={styles.carDetailSection}>
      <div className={styles.container}>
        <h1 className={styles.carDetailTitle}>
          {car.make || 'Unknown Make'} {car.model || 'Unknown Model'} ({car.year || 'N/A'})
        </h1>
        <CarSlider images={images} make={car.make || 'Unknown'} model={car.model || 'Unknown'} />
        <div className={styles.carDetails}>
          {/* Wrap specifications in a grid container */}
          <div className={styles.specificationsGrid}>
            {specifications.map((spec, specIndex) => (
              <div key={specIndex} className={styles.specContainer}>
                <h3 className={styles.specTitle}>{spec.label.toUpperCase()}</h3>
                <div className={styles.specList}>
                  {Array.isArray(spec.value) ? (
                    // For array fields like features
                    spec.value.map((item, index) => {
                      console.log(`Rendering ${spec.label} item ${index}: ${item}`);
                      return (
                        <span
                          key={`${spec.label}-${index}`}
                          className={styles.featureBadge}
                          style={{ '--index': index }}
                        >
                          {item.trim()}
                        </span>
                      );
                    })
                  ) : (
                    // For single-value fields like year, price, etc.
                    <span
                      key={`${spec.label}-0`}
                      className={styles.featureBadge}
                      style={{ '--index': 0 }}
                    >
                      {spec.value.trim()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Keep Description as a paragraph */}
          <p className={styles.carDescription}>
            <strong>Description:</strong> {car.description || 'No description provided.'}
          </p>
          {/* Seller Information remains unchanged */}
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