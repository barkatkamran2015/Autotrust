import { NextResponse } from 'next/server';
import dbConnect from '../../../src/lib/mongodb';
import Car from '../../../models/Car';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';
import { Buffer } from 'buffer';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
  console.log('Received PUT request to /api/update-car');
  try {
    await dbConnect();
    const formData = await request.formData();
    console.log('FormData entries:', Array.from(formData.entries()));

    const id = formData.get('id');
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('Invalid or missing ID:', id);
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }

    const featuresString = formData.get('features') || '';
    const features = featuresString.split(',').map(item => item.trim()).filter(item => item.length > 0);
    console.log('Processed features:', features, 'Length:', features.length); // Detailed logging

    const carData = {
      make: formData.get('make') || '',
      model: formData.get('model') || '',
      year: parseInt(formData.get('year')) || 0,
      price: parseFloat(formData.get('price')) || 0,
      mileage: parseInt(formData.get('mileage')) || 0,
      fuelType: formData.get('fuelType') || '',
      transmission: formData.get('transmission') || '',
      description: formData.get('description') || '',
      condition: formData.get('condition') || 'new',
      location: formData.get('location') || '',
      vin: formData.get('vin') || '',
      exteriorColor: formData.get('exteriorColor') || '',
      interiorColor: formData.get('interiorColor') || '',
      engineSize: formData.get('engineSize') || '',
      horsepower: parseInt(formData.get('horsepower')) || 0,
      driveType: formData.get('driveType') || '',
      features: features, // Use the processed array
      sellerName: formData.get('sellerName') || '',
      sellerEmail: formData.get('sellerEmail') || '',
      status: formData.get('status') || 'Available',
    };

    // Validate inputs
    if (!carData.make) throw new Error('Car make is required');
    if (!carData.model) throw new Error('Car model is required');
    if (carData.year <= 1885 || carData.year > new Date().getFullYear() + 1) {
      throw new Error(`Year must be between 1886 and ${new Date().getFullYear() + 1}`);
    }
    if (carData.price <= 0) throw new Error('Price must be greater than 0');
    if (carData.mileage < 0) throw new Error('Mileage cannot be negative');
    if (!carData.fuelType) throw new Error('Fuel type is required');
    if (!carData.transmission) throw new Error('Transmission is required');
    if (carData.horsepower < 0) throw new Error('Horsepower cannot be negative');

    console.log('Processed carData before update:', carData);

    // Handle existing images
    const existingImages = formData.getAll('existingImages') || [];

    // Handle new image uploads to Cloudinary
    const imageFiles = formData.getAll('images').filter(file => file.size > 0); // Ignore empty files
    const newImageUrls = [];
    if (imageFiles.length > 0) {
      console.log(`Uploading ${imageFiles.length} new images to Cloudinary`);
      for (const imageFile of imageFiles) {
        console.log('Uploading new image to Cloudinary:', imageFile.name);
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: 'autotrust/cars', public_id: `${Date.now()}_${uuidv4()}` },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          uploadStream.end(buffer);
        });
        newImageUrls.push(result.secure_url);
        console.log('New image uploaded to Cloudinary, URL:', result.secure_url);
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls].filter(url => url);
    if (allImages.length === 0) {
      console.log('No images provided, using default image');
      allImages.push('/uploads/cars/default.jpg');
    }

    // Update car in MongoDB
    console.log('Updating car in MongoDB with ID:', id, 'Data:', carData);
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      {
        ...carData,
        images: allImages,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    console.log('Car updated with ID:', updatedCar._id, 'Full data:', updatedCar);
    return NextResponse.json({ id: updatedCar._id.toString(), message: 'Car updated successfully', car: updatedCar }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/update-car:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}