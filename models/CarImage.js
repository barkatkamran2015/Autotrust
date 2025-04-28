import mongoose from 'mongoose';

const CarImageSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  image_url: { type: String, required: true },
});

export default mongoose.models.CarImage || mongoose.model('CarImage', CarImageSchema);