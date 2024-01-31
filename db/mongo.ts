import mongoose from "mongoose";

export class MongoDB {
  private uri = `mongodb+srv://develoversit:${Deno.env.get("MONGO_DB_PASSWORD")}@med-app-repl.0phugaj.mongodb.net/?retryWrites=true&w=majority`;
  private clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

  public async connect() {
    try {
      // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
      await mongoose.connect(this.uri, this.clientOptions);
      await mongoose.connection.db.admin().command({ping: 1});
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
      console.error(e);
    }
  };
}