import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  Phone:     { type: String, required: true },
  Notes:     { type: String }
});

const agentSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  mobile: { type: String, required: true,
     // Must start with +, 1–4 digits country code, optional space, then 6–14 digits
     match: [/^\+\d{1,4}\s?\d{6,14}$/]
   }, 
  password: { type: String, required: true }, // hashed password
  Items: [itemSchema]                          // <-- array of items
});

const AgentModel = mongoose.model("AgentModel", agentSchema);
export default AgentModel;