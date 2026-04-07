import mongoose from 'mongoose';
import Category from '../models/categoryModel.js';
export class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  async filter() {
    console.log(this.queryString);
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // === خاص بـ category ===
    if (queryObj.category && !mongoose.Types.ObjectId.isValid(queryObj.category)) {
      // يعني المستخدم بعت اسم التصنيف (مثل "Programming")
      const category = await Category.findOne({ name: queryObj.category });

      if (category) {
        queryObj.category = category._id; // نحوله للـ ID
      } else {
        // لو التصنيف مش موجود، نرجع نتيجة فاضية
        this.query = this.query.find({ _id: null });
        return this;
      }
    }

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(',').join(' ');
      console.log(sortedBy);
      this.query = this.query.sort(sortedBy);
    } else {
      const sortedBy = '-createdAt';
      this.query = this.query.sort(sortedBy);
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
