import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, min: 1886, max: new Date().getFullYear() + 1 },
  price: { type: Number, min: 0 },
  mileage: { type: Number, min: 0 },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  description: String,
  condition: { type: String, enum: ['new', 'used'], default: 'new' },
  location: String,
  vin: String,
  exteriorColor: String,
  interiorColor: String,
  engineSize: String,
  horsepower: { type: Number, min: 0 },
  driveType: String,
  features: [String],
  sellerName: String,
  sellerEmail: String,
  status: { type: String, enum: ['Available', 'Sold', 'Pending'], default: 'Available' },
  images: [String],
}, { timestamps: true });

export default mongoose.models.Car || mongoose.model('Car', carSchema);