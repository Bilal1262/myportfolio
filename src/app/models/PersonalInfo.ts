import mongoose, { Document, Model } from 'mongoose'

export interface IPersonalInfo extends Document {
  name: string
  title: string
  bio: string
  email: string
  location: string
  github: string
  linkedin: string
  createdAt: Date
  updatedAt: Date
}

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

const PersonalInfo: Model<IPersonalInfo> = mongoose.models.PersonalInfo || mongoose.model<IPersonalInfo>('PersonalInfo', personalInfoSchema)

export { PersonalInfo } 