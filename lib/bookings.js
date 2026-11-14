import { ObjectId } from "mongodb";
import { getBookingsCollection } from "./db";

export async function listBookings(user) {
  const collection = await getBookingsCollection();
  const filter = user.role === "admin" ? {} : { email: user.email };
  const bookings = await collection.find(filter).sort({ createdAt: -1 }).toArray();
  return bookings.map((booking) => ({ ...booking, _id: booking._id.toString() }));
}

export async function createBooking({ user, device, issue, date, time }) {
  const collection = await getBookingsCollection();
  const booking = { name: user.name, email: user.email, device: device.trim(), issue: issue.trim(), date, time: time || "Flexible", status: "Pending", createdAt: new Date() };
  const result = await collection.insertOne(booking);
  return { ...booking, _id: result.insertedId.toString() };
}

export async function changeBookingStatus(id, status) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getBookingsCollection();
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
  return result.matchedCount > 0;
}
