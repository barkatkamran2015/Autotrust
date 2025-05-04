import { NextResponse } from 'next/server';
import dbConnect from '../../../src/lib/mongodb';
import Car from '../../../models/Car';

export async function GET(request) {
  console.log('Received GET request to /api/get-cars');
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      console.log('Fetching car with ID:', id);
      const car = await Car.findById(id).lean();
      if (!car) {
        console.log('Car not found for ID:', id);
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
      }
      console.log('Car fetched:', { ...car, images: car.images || [] });
      return NextResponse.json({
        id: car._id.toString(),
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        description: car.description,
        condition: car.condition,
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
      });
    } else {
      console.log('Fetching all cars');
      const cars = await Car.find({}).lean();
      console.log('Number of cars in database:', cars.length);
      const formattedCars = cars.map((car) => ({
        id: car._id.toString(),
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        description: car.description,
        condition: car.condition,
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
        primary_image: car.images && car.images.length > 0 ? car.images[0] : '/uploads/cars/default.jpg',
      }));
      console.log('Cars fetched:', formattedCars);
      return NextResponse.json(formattedCars);
    }
  } catch (error) {
    console.error('Error in /api/get-cars:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}