import mongoose, { Document, Model } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  technologies: string[]
  image: string
  category: 'robotics' | 'ai' | 'web'
  demoLink?: string
  githubLink?: string
  createdAt: Date
}

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this project'],
    maxlength: [60, 'Title cannot be more than 60 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this project'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  technologies: {
    type: [String],
    required: [true, 'Please provide at least one technology']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  category: {
    type: String,
    required: [true, 'Please specify the category'],
    enum: ['robotics', 'ai', 'web']
  },
  demoLink: String,
  githubLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export default Project 