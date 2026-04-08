import mongoose from 'mongoose';

const lessonShema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A lesson must have a title'],
    unique: true,
    trim: true,
    maxlength: [20, 'A lesson name must have less or equal then 50 characters'],
    minlength: [3, 'A lesson name must have more or equal then 10 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  videoURL: {
    type: String,
    required: [true, 'A lesson must have a videoURL'],
    trim: true,
  },

  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Lesson must belong to a course'],
  },
});

const Lesson = mongoose.model('Lesson', lessonShema);
export default Lesson;
