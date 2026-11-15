import { ObjectId } from "mongodb";
import { getBookingsCollection } from "./db";

export async function listBookings(user) {
  const collection = await getBookingsCollection();
  const filter = user.role === "admin" ? {} : { email: user.email };
  const bookings = await collection.find(filter).sort({ createdAt: -1 }).toArray();
  return bookings.map((booking) => ({ ...booking, _id: booking._id.toString() }));
}

export async function createBooking({ user, device, issue, date, time, repairType, estimatedAmount, paymentMethod, paymentStatus, razorpayOrderId, pickupLocation }) {
  const collection = await getBookingsCollection();
  const booking = { name: user.name, email: user.email, device: device.trim(), issue: issue.trim(), repairType: repairType || "other", estimatedAmount, currency: "INR", paymentMethod, paymentStatus, pickupLocation, ...(razorpayOrderId ? { razorpayOrderId } : {}), date, time: time || "Flexible", status: "Pending", createdAt: new Date() };
  const result = await collection.insertOne(booking);
  return { ...booking, _id: result.insertedId.toString() };
}

export async function updateBookingPayment(id, fields) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getBookingsCollection();
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...fields, updatedAt: new Date() } });
  return result.matchedCount > 0;
}

export async function changeBookingStatus(id, status) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getBookingsCollection();
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
  return result.matchedCount > 0;
}
