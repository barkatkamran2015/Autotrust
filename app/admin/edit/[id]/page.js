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
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeInputRef = useRef(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-cars?id=${id}`;
        console.log('Fetching car from:', url);
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch car');
        }
        const car = await response.json();
        setFormData({
          make: car.make || '',
          model: car.model || '',
          year: car.year || 0,
          price: car.price || 0,
          mileage: car.mileage || 0,
          fuelType: car.fuelType || '',
          transmission: car.transmission || '',
          description: car.description || '',
          condition: car.condition || 'new',
        });
        setExistingImages(car.images || []);
        setImagePreviews(car.images || []);
      } catch (err) {
        console.error('Fetch car error:', err);
        setError('Failed to load car data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCar();
  }, [id]);

  useEffect(() => {
    if (makeInputRef.current) {
      makeInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...existingImages, ...newPreviews]);
    return () => newPreviews.forEach(preview => URL.revokeObjectURL(preview));
  }, [imageFiles, existingImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    } else {
      setImageFiles([]);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.make) return 'Please enter the car make.';
    if (!formData.model) return 'Please enter the car model.';
    if (formData.year <= 1885 || formData.year > new Date().getFullYear() + 1) {
      return `Please enter a valid year (1886–${new Date().getFullYear() + 1}).`;
    }
    if (formData.price <= 0) return 'Please enter a valid price greater than 0.';
    if (formData.mileage < 0) return 'Mileage cannot be negative.';
    if (!formData.fuelType) return 'Please enter the fuel type.';
    if (!formData.transmission) return 'Please enter the transmission type.';
    return '';
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
      imageFiles.forEach(file => data.append('images', file));
      existingImages.forEach(url => data.append('existingImages', url));

      const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/update-car`;
      console.log('Sending PUT request to:', url, 'with FormData:', Array.from(data.entries()));
      const response = await fetch(url, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Response status:', response.status, 'Response text:', text.slice(0, 200));
        try {
          const errorData = JSON.parse(text);
          if (response.status === 404 && errorData.error === 'Car not found') {
            setError('Car not found. It may have been deleted.');
          } else {
            throw new Error(errorData.error || `Failed to update car (status: ${response.status})`);
          }
        } catch (jsonError) {
          console.error('Non-JSON response:', text.slice(0, 100));
          throw new Error(`Failed to update car: Server returned status ${response.status} with response: ${text.slice(0, 100)}`);
        }
      }

      console.log('Car updated successfully');
      router.push('/admin');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="loading-section">Loading car data...</div>;
  if (error) return <div className="error-section">{error}</div>;

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
              <label className={styles.formLabel}>Upload New Images (Multiple, Optional)</label>
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
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100px', margin: '5px' }}
                        onError={(e) => { e.target.src = '/uploads/cars/default.jpg'; }}
                      />
                      {index < existingImages.length && (
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                          X
                        </button>
                      )}
                    </div>
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