import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: ""}

  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export const getAll = async () => Event.find().lean();

export const findById = async (id) => Event.findById(id).lean();

export const create = async (data) => (await Event.create(data)).toObject();

export const updateById = async (id, data) =>
  Event.findByIdAndUpdate(id, data, { new: true }).lean();

export const removeById = async (id) => {
  Event.findByIdAndDelete(id).lean();
};
