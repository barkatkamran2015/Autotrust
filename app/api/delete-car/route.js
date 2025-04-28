import { NextResponse } from 'next/server';
import dbConnect from '../../../src/lib/mongodb';
import Car from '../../../models/Car';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
  console.log('Received DELETE request to /api/delete-car');
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      console.log('No ID provided in DELETE request');
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    console.log('Deleting car with ID:', id);

    // Connect to MongoDB
    await dbConnect();

    // Find the car to get its images (for Cloudinary deletion)
    const car = await Car.findById(id);
    if (!car) {
      console.log('Car not found for ID:', id);
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Optionally delete images from Cloudinary
    const images = car.images || [];
    if (images.length > 0) {
      for (const imageUrl of images) {
        // Skip the default image
        if (imageUrl === '/uploads/cars/default.jpg') continue;

        try {
          // Extract the public_id from the Cloudinary URL
          const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0]; // e.g., "autotrust/cars/12345_uuid"
          console.log('Deleting image from Cloudinary, public_id:', publicId);
          await cloudinary.v2.uploader.destroy(publicId);
          console.log('Deleted image from Cloudinary:', publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting image from Cloudinary:', cloudinaryError);
          // Continue with deletion even if Cloudinary fails
        }
      }
    }

    // Delete the car from MongoDB
    const deleteResult = await Car.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
      console.log('Car not found for ID:', id);
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    console.log('Car deleted successfully from MongoDB with ID:', id);
    return NextResponse.json({ message: 'Car deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/delete-car:', error);
    return NextResponse.json({ error: 'Failed to delete car: ' + error.message }, { status: 500 });
  }
}