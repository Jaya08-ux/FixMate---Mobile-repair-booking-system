import connectToMongo from "./mongodb";

export async function getBookingsCollection() {
  const client = await connectToMongo();
  const database = client.db(process.env.MONGODB_DB || "fixmate");
  return database.collection("bookings");
}
