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
  const [filterLocation, setFilterLocation] = useState('');
  const [filterFuelType, setFilterFuelType] = useState('');
  const [filterTransmission, setFilterTransmission] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const years = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i);
  const uniqueLocations = [...new Set(cars.map(car => car.location).filter(Boolean))];
  const uniqueFuelTypes = [...new Set(cars.map(car => car.fuelType).filter(Boolean))];
  const uniqueTransmissions = [...new Set(cars.map(car => car.transmission).filter(Boolean))];
  const uniqueStatuses = ['Available', 'Sold', 'Pending'];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('Fetching cars from /api/get-cars');
        const response = await fetch('/api/get-cars', {
          cache: 'no-store',
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('Fetch response (not OK):', text);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const carData = await response.json();
        console.log('Fetched cars:', carData);
        if (carData.error) {
          throw new Error(carData.error);
        }
        setCars(carData);
        setFilteredCars(carData);
      } catch (err) {
        console.error('Error fetching cars:', err);
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
      console.log('Applying filters:', { searchModel, filterYear, minPrice, maxPrice, filterLocation, filterFuelType, filterTransmission, filterStatus });
  
      if (searchModel) {
        filtered = filtered.filter(car =>
          (car.model.toLowerCase().includes(searchModel.toLowerCase()) ||
           car.make.toLowerCase().includes(searchModel.toLowerCase()))
        );
      }
      if (filterYear) {
        const year = parseInt(filterYear);
        if (year >= 1900 && year <= 2025) {
          filtered = filtered.filter(car => car.year === year);
        }
      }
      if (minPrice) {
        filtered = filtered.filter(car => car.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(car => car.price <= parseFloat(maxPrice));
      }
      if (filterLocation) {
        filtered = filtered.filter(car => car.location === filterLocation);
      }
      if (filterFuelType) {
        filtered = filtered.filter(car => car.fuelType === filterFuelType);
      }
      if (filterTransmission) {
        filtered = filtered.filter(car => car.transmission === filterTransmission);
      }
      if (filterStatus) {
        filtered = filtered.filter(car => car.status === filterStatus);
      }
  
      console.log('Filtered cars:', filtered);
      setFilteredCars(filtered);
    };
  
    applyFilters();
  }, [searchModel, filterYear, minPrice, maxPrice, filterLocation, filterFuelType, filterTransmission, filterStatus, cars]);

  const resetFilters = () => {
    setSearchModel('');
    setFilterYear('');
    setMinPrice('');
    setMaxPrice('');
    setFilterLocation('');
    setFilterFuelType('');
    setFilterTransmission('');
    setFilterStatus('');
  };

  if (authLoading || loading) return <div className={styles.loadingSection}>Loading inventory...</div>;
  if (error) return <div className={styles.errorSection}>{error} <Button onClick={() => window.location.reload()} className={styles.retryButton}>Retry</Button></div>;

  return (
    <div className={styles.inventorySection}>
      <div className={styles.layoutWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            <div className={styles.filterGroup}>
              <label htmlFor="searchModel" className={styles.filterLabel}>Search by Model</label>
              <Input
                type="text"
                id="searchModel"
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
                placeholder="Enter model"
                className={styles.filterInput}
              />
            </div>
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
            <div className={styles.filterGroup}>
              <label htmlFor="filterLocation" className={styles.filterLabel}>Location</label>
              <select
                id="filterLocation"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Select Location</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="filterFuelType" className={styles.filterLabel}>Fuel Type</label>
              <select
                id="filterFuelType"
                value={filterFuelType}
                onChange={(e) => setFilterFuelType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Select Fuel Type</option>
                {uniqueFuelTypes.map(fuelType => (
                  <option key={fuelType} value={fuelType}>{fuelType}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="filterTransmission" className={styles.filterLabel}>Transmission</label>
              <select
                id="filterTransmission"
                value={filterTransmission}
                onChange={(e) => setFilterTransmission(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Select Transmission</option>
                {uniqueTransmissions.map(transmission => (
                  <option key={transmission} value={transmission}>{transmission}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="filterStatus" className={styles.filterLabel}>Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Select Status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <Button onClick={resetFilters} className={styles.resetButton}>
              Reset All Filters
            </Button>
          </div>
        </div>
        <div className={styles.mainContent}>
          <h1 className={styles.inventoryTitle}>Explore Our Premium Car Inventory</h1>
          <p className={styles.inventorySubtitle}>
            Carefully selected vehicles offering the perfect blend of quality, performance, and value — your next journey begins here.
          </p>
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
                if (!car.id) {
                  console.error('Car missing id:', car);
                  return null; // Skip rendering this car
                }
                return (
                  <div key={car.id} className={styles.inventoryCard}>
                    <Link href={`/cars/${car.id}`} className={styles.inventoryImageLink}>
                      <img
                        src={car.primary_image || car.images?.[0] || '/uploads/cars/default.jpg'}
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
                        Year: {car.year} | {car.condition ? car.condition.charAt(0).toUpperCase() + car.condition.slice(1) : 'N/A'} | Location: {car.location || 'N/A'}
                      </p>
                      <p className={styles.inventoryCardPrice}>${car.price.toLocaleString()}</p>
                      <p className={styles.inventoryCardDetails}>
                        Fuel: {car.fuelType || 'N/A'} | Trans: {car.transmission || 'N/A'}
                      </p>
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