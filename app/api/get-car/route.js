import { NextResponse } from 'next/server';
import dbConnect from '../../../src/lib/mongodb';
import Car from '../../../models/Car';

export async function GET(request) {
  console.log('Received GET request to /api/get-car');
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate id
    if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('Invalid or missing ID:', id);
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }

    console.log('Fetching car with ID:', id);
    const car = await Car.findById(id).lean();
    if (!car) {
      console.log('Car not found for ID:', id);
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    console.log('Car fetched from DB:', car);
    const responseCar = {
      id: car._id.toString(),
      make: car.make || '',
      model: car.model || '',
      year: car.year || 0,
      price: car.price || 0,
      mileage: car.mileage || 0,
      fuelType: car.fuelType || '',
      transmission: car.transmission || '',
      description: car.description || '',
      condition: car.condition || 'new',
      location: car.location || '',
      vin: car.vin || '',
      exteriorColor: car.exteriorColor || '',
      interiorColor: car.interiorColor || '',
      engineSize: car.engineSize || '',
      horsepower: car.horsepower || 0,
      driveType: car.driveType || '',
      features: car.features || [],
      sellerName: car.sellerName || '',
      sellerEmail: car.sellerEmail || '',
      status: car.status || 'Available',
      images: car.images || [],
    };

    console.log('Returning features:', responseCar.features, 'Length:', responseCar.features.length); // Debug log
    return NextResponse.json(responseCar);
  } catch (error) {
    console.error('Error in /api/get-car:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}