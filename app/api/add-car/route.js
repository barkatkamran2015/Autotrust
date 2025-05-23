import { NextResponse } from 'next/server';
import dbConnect from '../../../src/lib/mongodb';
import Car from '../../../models/Car';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  console.log('Received POST request to /api/add-car');
  try {
    await dbConnect();
    const formData = await request.formData();
    console.log('FormData entries:', Array.from(formData.entries()));

    const featuresString = formData.get('features') || '';
    const features = featuresString.split(',').map(item => item.trim()).filter(item => item.length > 0);
    console.log('Processed features:', features, 'Length:', features.length);

    const rawPrice = formData.get('price'); // Raw value from form
    console.log('Raw price from formData:', rawPrice);
    const price = parseFloat(rawPrice) || 0;
    console.log('Parsed price:', price);

    const carData = {
      make: formData.get('make'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')) || 0,
      price: price,
      mileage: parseInt(formData.get('mileage')) || 0,
      fuelType: formData.get('fuelType'),
      transmission: formData.get('transmission'),
      description: formData.get('description'),
      condition: formData.get('condition'),
      location: formData.get('location'),
      vin: formData.get('vin'),
      exteriorColor: formData.get('exteriorColor'),
      interiorColor: formData.get('interiorColor'),
      engineSize: formData.get('engineSize'),
      horsepower: parseInt(formData.get('horsepower')) || 0,
      driveType: formData.get('driveType'),
      features: features,
      sellerName: formData.get('sellerName'),
      sellerEmail: formData.get('sellerEmail'),
      status: formData.get('status') || 'Available',
      dateAdded: new Date(),
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

    // Handle multiple image uploads to Cloudinary
    const imageFiles = formData.getAll('images');
    const imageUrls = [];
    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      for (const imageFile of imageFiles) {
        console.log('Uploading image to Cloudinary:', imageFile.name);
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
              folder: 'autotrust/cars',
              public_id: `${Date.now()}_${uuidv4()}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        imageUrls.push(result.secure_url);
        console.log('Image uploaded to Cloudinary, URL:', result.secure_url);
      }
    } else {
      console.log('No images provided, using default image');
      imageUrls.push('/uploads/cars/default.jpg');
    }

    // Insert car into MongoDB
    console.log('Inserting car into MongoDB:', carData);
    const newCar = await Car.create({
      ...carData,
      images: imageUrls,
    });

    console.log('Car inserted with ID:', newCar._id);
    return NextResponse.json({ id: newCar._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('Error in /api/add-car:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}