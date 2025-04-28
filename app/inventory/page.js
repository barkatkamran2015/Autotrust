'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/components/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../../src/styles/Inventory.module.css';
import Link from 'next/link';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';

export default function InventoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Generate years from 1900 to 2025 for the dropdown
  const years = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-cars`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to load inventory');
        }
        const carData = await response.json();
        console.log('Fetched cars:', carData);
        const fetchedCars = carData.cars || carData;
        setCars(fetchedCars);
        setFilteredCars(fetchedCars);
      } catch (err) {
        setError('Failed to load inventory. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...cars];

      // Log filter criteria
      console.log('Applying filters:', { searchModel, filterYear, minPrice, maxPrice });

      // Search by model (case-insensitive partial match)
      if (searchModel) {
        filtered = filtered.filter(car =>
          car.model.toLowerCase().includes(searchModel.toLowerCase())
        );
      }

      // Filter by year (exact match)
      if (filterYear) {
        const year = parseInt(filterYear);
        if (year >= 1900 && year <= 2025) {
          filtered = filtered.filter(car => car.year === year);
        }
      }

      // Filter by price range
      if (minPrice) {
        filtered = filtered.filter(car => car.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(car => car.price <= parseFloat(maxPrice));
      }

      console.log('Filtered cars:', filtered);
      setFilteredCars(filtered);
    };

    applyFilters();
  }, [searchModel, filterYear, minPrice, maxPrice, cars]);

  const resetFilters = () => {
    setFilterYear('');
    setMinPrice('');
    setMaxPrice('');
  };

  if (authLoading || loading) return <div className="loading-section">Loading...</div>;
  if (error) return <div className="error-section">{error}</div>;

  return (
    <div className={styles.inventorySection}>
      <div className={styles.layoutWrapper}>
        {/* Sidebar for Filters */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h2 className={styles.sidebarTitle}>Filters</h2>

            <div className={styles.filterGroup}>
              <label htmlFor="filterYear" className={styles.filterLabel}>Year</label>
              <select
                id="filterYear"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range ($)</label>
              <div className={styles.priceRange}>
                <Input
                  type="range"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  max="100000"
                  step="1000"
                  className={styles.rangeInput}
                />
                <span className={styles.rangeValue}>Min: ${minPrice || 0}</span>
              </div>
              <div className={styles.priceRange}>
                <Input
                  type="range"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                  max="100000"
                  step="1000"
                  className={styles.rangeInput}
                />
                <span className={styles.rangeValue}>Max: ${maxPrice || 100000}</span>
              </div>
            </div>

            <Button onClick={resetFilters} className={styles.resetButton}>
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h1 className={styles.inventoryTitle}>Explore Our Premium Car Inventory</h1>
          <p className={styles.inventorySubtitle}>
            Carefully selected vehicles offering the perfect blend of quality, performance, and value — your next journey begins here.
          </p>

          {/* Search Bar */}
          <div className={styles.searchBar}>
            <Input
              type="text"
              value={searchModel}
              onChange={(e) => setSearchModel(e.target.value)}
              placeholder="Search Your Ride here"
              className={styles.searchInput}
            />
          </div>

          {user && (
            <div className={styles.adminActions}>
              <Link href="/admin/add">
                <Button className={styles.addButton}>Add New Car</Button>
              </Link>
            </div>
          )}

          <div className={styles.inventoryGrid}>
            {filteredCars.length === 0 ? (
              <p className={styles.noCars}>No cars match your filters.</p>
            ) : (
              filteredCars.map((car) => {
                console.log('Rendering car:', car);
                const imageSrc = car.images?.[0] || '/uploads/cars/default.jpg';
                return (
                  <div key={car.id} className={styles.inventoryCard}>
                    <Link href={`/cars/${car.id}`} className={styles.inventoryImageLink}>
                    <img
                    src={car.primary_image || '/uploads/cars/default.jpg'}
                    alt={`${car.make} ${car.model}`}
                    className={styles.inventoryImage}
                    onError={(e) => { e.target.src = '/uploads/cars/default.jpg'; }}
                  />
                    </Link>
                    <div className={styles.inventoryCardContent}>
                      <Link href={`/cars/${car.id}`} className={styles.inventoryCardTitleLink}>
                        <h2 className={styles.inventoryCardTitle}>
                          {car.make} {car.model}
                        </h2>
                      </Link>
                      <p className={styles.inventoryCardText}>
                        Year: {car.year} | {car.condition ? car.condition.charAt(0).toUpperCase() + car.condition.slice(1) : 'N/A'}
                      </p>
                      <p className={styles.inventoryCardPrice}>${car.price.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}