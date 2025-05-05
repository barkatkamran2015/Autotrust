'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '../../../../src/components/ui/Input';
import { Button } from '../../../../src/components/ui/Button';
import Link from 'next/link';
import styles from '../../../../src/styles/Add.module.css';

export default function EditCarPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 0,
    price: 0,
    mileage: 0,
    fuelType: '',
    transmission: '',
    description: '',
    condition: 'new',
    location: '',
    vin: '',
    exteriorColor: '',
    interiorColor: '',
    engineSize: '',
    horsepower: 0,
    driveType: '',
    features: '',
    sellerName: '',
    sellerEmail: '',
    status: 'Available',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeInputRef = useRef(null);

  // Validate id early
  useEffect(() => {
    if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('Invalid ID parameter detected:', id, 'Type:', typeof id);
      router.push('/admin'); // Redirect to admin page if id is invalid
    }
  }, [id, router]);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return; // Skip fetch if id is invalid (already handled above)

      try {
        console.log('Fetching car with id:', id);
        const response = await fetch(`/api/get-car?id=${id}`);
        if (!response.ok) {
          const text = await response.text();
          console.error('Fetch response (not OK):', text);
          throw new Error(`Failed to fetch car: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched car data:', data);
        if (!data) {
          throw new Error('No car data found');
        }
        setFormData({
          make: data.make || '',
          model: data.model || '',
          year: data.year || 0,
          price: data.price || 0,
          mileage: data.mileage || 0,
          fuelType: data.fuelType || '',
          transmission: data.transmission || '',
          description: data.description || '',
          condition: data.condition || 'new',
          location: data.location || '',
          vin: data.vin || '',
          exteriorColor: data.exteriorColor || '',
          interiorColor: data.interiorColor || '',
          engineSize: data.engineSize || '',
          horsepower: data.horsepower || 0,
          driveType: data.driveType || '',
          features: data.features ? data.features.join(', ') : '', // Join with space after comma
          sellerName: data.sellerName || '',
          sellerEmail: data.sellerEmail || '',
          status: data.status || 'Available',
        });
        setImagePreviews(data.images || []);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError(err.message || 'Failed to load car data');
        router.push('/admin'); // Redirect on fetch failure
      }
    };

    fetchCar();
  }, [id, router]);

  useEffect(() => {
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    return () => previews.forEach(preview => URL.revokeObjectURL(preview));
  }, [imageFiles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' || name === 'horsepower' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const validateForm = () => {
    if (!formData.make) return 'Car make is required';
    if (!formData.model) return 'Car model is required';
    if (formData.year <= 1885 || formData.year > new Date().getFullYear() + 1) {
      return `Year must be between 1886 and ${new Date().getFullYear() + 1}`;
    }
    if (formData.price <= 0) return 'Price must be greater than 0';
    if (formData.mileage < 0) return 'Mileage cannot be negative';
    if (!formData.fuelType) return 'Fuel type is required';
    if (!formData.transmission) return 'Transmission is required';
    if (formData.horsepower < 0) return 'Horsepower cannot be negative';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('id', id);
      data.append('make', formData.make);
      data.append('model', formData.model);
      data.append('year', formData.year.toString());
      data.append('price', formData.price.toString());
      data.append('mileage', formData.mileage.toString());
      data.append('fuelType', formData.fuelType);
      data.append('transmission', formData.transmission);
      data.append('description', formData.description);
      data.append('condition', formData.condition);
      data.append('location', formData.location);
      data.append('vin', formData.vin);
      data.append('exteriorColor', formData.exteriorColor);
      data.append('interiorColor', formData.interiorColor);
      data.append('engineSize', formData.engineSize);
      data.append('horsepower', formData.horsepower.toString());
      data.append('driveType', formData.driveType);
      data.append('features', formData.features); // Send the full string
      data.append('sellerName', formData.sellerName);
      data.append('sellerEmail', formData.sellerEmail);
      data.append('status', formData.status);
      imagePreviews.forEach(url => data.append('existingImages', url));
      imageFiles.forEach(file => data.append('images', file));

      console.log('Submitting features:', formData.features); // Debug log to verify the string

      const response = await fetch('/api/update-car', {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Update-car response (not OK):', text);
        throw new Error(`Failed to update car: ${response.statusText} - ${text}`);
      }

      const responseData = await response.json();
      console.log('Update-car response:', responseData);
      router.push('/admin');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to update car');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.addCarSection}>
      <div className="container">
        <div className={styles.addCarCard}>
          <h1 className={styles.addCarTitle}>Edit Car</h1>
          <form onSubmit={handleSubmit} className={styles.addCarForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Make</label>
              <Input
                ref={makeInputRef}
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Model</label>
              <Input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Year</label>
              <Input
                type="number"
                name="year"
                value={formData.year.toString()}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price ($)</label>
              <Input
                type="number"
                name="price"
                value={formData.price.toString()}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mileage (miles)</label>
              <Input
                type="number"
                name="mileage"
                value={formData.mileage.toString()}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fuel Type</label>
              <Input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Transmission</label>
              <Input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className={styles.addCarInput}
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location</label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>VIN</label>
              <Input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Exterior Color</label>
              <Input
                type="text"
                name="exteriorColor"
                value={formData.exteriorColor}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Interior Color</label>
              <Input
                type="text"
                name="interiorColor"
                value={formData.interiorColor}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Engine Size</label>
              <Input
                type="text"
                name="engineSize"
                value={formData.engineSize}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Horsepower</label>
              <Input
                type="number"
                name="horsepower"
                value={formData.horsepower.toString()}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Drive Type</label>
              <Input
                type="text"
                name="driveType"
                value={formData.driveType}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Features (comma-separated)</label>
              <Input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                className={styles.addCarInput}
                placeholder="e.g., Leather Seats, Sunroof, Backup Camera"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Seller Name</label>
              <Input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Seller Email</label>
              <Input
                type="email"
                name="sellerEmail"
                value={formData.sellerEmail}
                onChange={handleInputChange}
                className={styles.addCarInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={styles.addCarInput}
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.addCarTextarea}
                rows="4"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Upload Images (Multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className={styles.addCarFileInput}
              />
              {imagePreviews.length > 0 && (
                <div className={styles.imagePreview}>
                  {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{ width: '100px', margin: '5px' }} />
                  ))}
                </div>
              )}
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <Button
              type="submit"
              className={styles.addCarButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className={styles.loader}></span> : 'Update Car'}
            </Button>
            <Link href="/admin" className={styles.cancelLink}>
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}