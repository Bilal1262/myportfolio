import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true
})

export const Education = mongoose.models.Education || mongoose.model('Education', educationSchema) 