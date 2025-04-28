// src/lib/api.js
import db from './db';

export async function addCar(carData, imageFile) {
  console.log('Starting addCar process...');
  try {
    console.log('Uploading image via API route:', imageFile.name);
    const formData = new FormData();
    formData.append('image', imageFile);
    const uploadResponse = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text();
      console.error('Upload failed. Status:', uploadResponse.status, 'Response:', responseText);
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${responseText}`);
      }
      throw new Error(errorData.error || `Upload failed with status ${uploadResponse.status}`);
    }
    const { imageUrl } = await uploadResponse.json();
    console.log('Download URL obtained:', imageUrl);
    console.log('Adding car to SQLite...');
    const stmt = db.prepare(`
      INSERT INTO cars (make, model, year, price, mileage, fuelType, transmission, description, condition, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      carData.make,
      carData.model,
      carData.year,
      carData.price,
      carData.mileage,
      carData.fuelType,
      carData.transmission,
      carData.description,
      carData.condition,
      imageUrl
    );
    console.log('Car added to SQLite with ID:', result.lastInsertRowid);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
}