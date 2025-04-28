import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number },
  fuelType: { type: String },
  transmission: { type: String },
  description: { type: String },
  condition: { type: String },
  images: [{ type: String }], // Array of image URLs, replacing imageUrl and car_images table
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);