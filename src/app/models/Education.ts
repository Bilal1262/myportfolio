import mongoose, { Document, Model } from 'mongoose'

export interface IEducation extends Document {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
  createdAt: Date
  updatedAt: Date
}

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

const Education: Model<IEducation> = mongoose.models.Education || mongoose.model<IEducation>('Education', educationSchema)

export { Education } 