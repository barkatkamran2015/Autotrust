import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  description: String,
  condition: { type: String, enum: ['new', 'used'], default: 'new' },
  location: String,
  vin: String,
  exteriorColor: String,
  interiorColor: String,
  engineSize: String,
  horsepower: Number,
  driveType: String,
  features: [String], // Array of strings, no limit specified
  sellerName: String,
  sellerEmail: String,
  status: { type: String, enum: ['Available', 'Sold', 'Pending'], default: 'Available' },
  images: [String],
  dateAdded: { type: Date, default: Date.now },
});

export default mongoose.models.Car || mongoose.model('Car', carSchema);