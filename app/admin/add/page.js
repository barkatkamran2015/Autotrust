'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import Link from 'next/link';
import styles from '../../../src/styles/Add.module.css';

export default function AddCarPage() {
  const router = useRouter();
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
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeInputRef = useRef(null);

  useEffect(() => {
    if (makeInputRef.current) {
      makeInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    return () => previews.forEach(preview => URL.revokeObjectURL(preview));
  }, [imageFiles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? parseInt(value) || 0 : value,
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
      data.append('make', formData.make);
      data.append('model', formData.model);
      data.append('year', formData.year.toString());
      data.append('price', formData.price.toString());
      data.append('mileage', formData.mileage.toString());
      data.append('fuelType', formData.fuelType);
      data.append('transmission', formData.transmission);
      data.append('description', formData.description);
      data.append('condition', formData.condition);
      imageFiles.forEach(file => data.append('images', file)); // Send image files directly

      const response = await fetch('/api/add-car', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add car');
      }

      router.push('/admin');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to add car: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.addCarSection}>
      <div className="container">
        <div className={styles.addCarCard}>
          <h1 className={styles.addCarTitle}>Add New Car</h1>
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
              {isSubmitting ? <span className={styles.loader}></span> : 'Add Car'}
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