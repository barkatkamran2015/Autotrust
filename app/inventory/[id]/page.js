// app/inventory/page.js
import styles from '../../../src/styles/Inventory.module.css';
import Link from 'next/link';

async function fetchCars() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-cars`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch cars');
  }
  return res.json();
}

export default async function InventoryPage() {
  let cars;
  try {
    cars = await fetchCars();
    console.log('Fetched cars:', cars);
  } catch (err) {
    console.error('Error fetching cars:', err);
    return <div className="error-section">Failed to load inventory: {err.message}</div>;
  }

  return (
    <div className={styles.inventorySection}>
      <div className="container">
        <h1 className={styles.inventoryTitle}>Car Inventory</h1>
        {cars.length === 0 ? (
          <p className={styles.noCars}>No cars available in the inventory.</p>
        ) : (
          <div className={styles.inventoryGrid}>
            {cars.map(car => {
              const imageSrc = car.primary_image || '/uploads/cars/default.jpg';
              console.log(`Rendering car ID ${car.id} with href /cars/${car.id}`);

              return (
                <div key={car.id} className={styles.inventoryCard}>
                  <Link href={`/cars/${car.id}`} className={styles.inventoryImageLink}>
                    <img
                      src={imageSrc}
                      alt={`${car.make} ${car.model}`}
                      className={styles.inventoryImage}
                      onError={(e) => { e.target.src = '/uploads/cars/default.jpg'; }}
                    />
                  </Link>
                  <Link href={`/cars/${car.id}`} className={styles.inventoryCardTitleLink}>
                    <h2 className={styles.inventoryCardTitle}>
                      {car.make} {car.model} ({car.year})
                    </h2>
                  </Link>
                  <div className={styles.inventoryCardContent}>
                    <p className={styles.inventoryCardPrice}>
                      Price: ${car.price ? car.price.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className={styles.inventoryCardActions}>
                    <Link href={`/cars/${car.id}`} className={styles.carDetailsButton}>
                      Car Details
                    </Link>
                    <Link href={`/cars/${car.id}`} className={styles.detailLink}>
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}