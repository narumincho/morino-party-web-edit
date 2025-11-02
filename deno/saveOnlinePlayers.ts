import { MongoClient } from "mongodb";

let client: MongoClient;

export const saveOnlinePlayers = async (mongodbUri: string): Promise<void> => {
  if (client === undefined) {
    client = new MongoClient(mongodbUri);
  }
  // await client.connect(mongodbUri);
  await client.db("moripa").collection("online-users").insertOne({
    time: new Date(),
    players: ["narumincho", "otherUser"],
  });

  console.log("ok");
};
