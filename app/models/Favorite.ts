import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  article: {
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    source: {
      id: String,
      name: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
