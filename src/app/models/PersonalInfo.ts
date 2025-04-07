import mongoose from 'mongoose'

const personalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  github: { type: String, required: true },
  linkedin: { type: String, required: true }
}, {
  timestamps: true
})

export const PersonalInfo = mongoose.models.PersonalInfo || mongoose.model('PersonalInfo', personalInfoSchema) 