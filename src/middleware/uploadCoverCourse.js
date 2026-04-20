import multer from 'multer';
import path from 'path';

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `course-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// middleware
export const uploadCourseImage = upload.single('imageCover');
