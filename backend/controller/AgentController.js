import bcrypt from 'bcrypt';
import expess from 'express';
import AgentModel from '../Models/AgentModel.js';
import path from 'path';
import csvtojson from 'csvtojson';
import fs from 'fs';

export const AddAgent=async(req,res)=>{
try {
    const {name ,email,mobile,password}=req.body;
    if(!name || !email || !mobile || !password){
        return res.status(400).send({message:"Please provide all the fields",success:false});
    }

     // Country code validation
    const countryCodeRegex = /^\+\d{1,4}\s?\d{6,14}$/;
    if (!countryCodeRegex.test(mobile)) {
      return res.status(400).send({
        message: "Mobile must include country code (e.g. +91 9876543210)",
        success: false
      });
    }

    const existingAgent=await AgentModel.findOne({email});
    if(existingAgent){
        return res.status(400).send({message:"Agent already exists",success:false});
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const newAgent=new AgentModel({
        name,
        email,
        mobile,
        password:hashedPassword,
    });

    await newAgent.save();
    return res.status(201).send({message:"Agent added successfully",success:true,agent:newAgent});
} catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error adding agent", success: false, error } );
}
}

export const uploadAndDistribute=async(req,res)=>{
    try {
        const file=req.file;
         
      if(!file){
        return res.status(400).send({message:"Please upload a csv file",success:false});
      }
       
      // parse CSV file to JSON
       const records=await csvtojson().fromFile(req.file.path);
      // console.log("Parsed records:", records);
       
      // filter out invalid records and map to desired format
        const items=records.filter(r=>r.FirstName && r.Phone && r.Notes)
        .map((r)=>({
            FirstName: r.FirstName,
            Phone: r.Phone,
            Notes: r.Notes
        }));

        if(items.length===0){
            return res.status(400).send({message:"No valid records found in the file",success:false});
        }

        const agents=await AgentModel.find();
        if(agents.length===0){
            return res.status(400).send({message:"No agents available to assign tasks",success:false});
        }
       
        console.log("Valid tasks:", items.length);
        // distribute items among agents in round-robin fashion
        let i=0
        for(const item of items){
            agents[i].Items.push(item)
            i=(i+1)%agents.length;
        }

      const updatedAgents = await Promise.all(agents.map(a => a.save()));
       fs.unlinkSync(req.file.path); // remove the file after processing

       return res.status(200).send({message:"File processed successfully",success:true,agents:updatedAgents});


    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error processing file", success: false, error } );
    }
}


export const getAllAgents=async(req,res)=>{
    try {
        const agents=await AgentModel.find();
        return res.status(200).send({message:"Agents fetched successfully",success:true,agents});
    } catch (error) {
       return res.status(500).send({ message: "Error fetching agents", success: false, error } ); 
    }
}

export const getAgentById=async(req,res)=>{
    try {
        const agent=await AgentModel.findById(req.params.id);
        if(!agent){
            return res.status(404).send({message:"Agent not found",success:false});
        }
        return res.status(200).send({message:"Agent fetched successfully",success:true,agent});
    } catch (error) {
        return res.status(500).send({ message: "Error fetching agent", success: false, error } );
    }
}


export const deleteAgentById=async(req,res)=>{
    try {
        await AgentModel.findByIdAndDelete(req.params.id);
       return res.status(200).send({message:"Agent deleted successfully",success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error deleting agent", success: false, error } );
    }
}

export const editAgentById=async(req,res)=>{
    try {
        const {name,email,mobile}=req.body;

        const agent=await AgentModel.findById(req.params.id);
        if(!agent){
            return res.status(404).send({message:"Agent not found",success:false});
        }

       if(name) agent.name=name;
       if(email) agent.email=email;
       if(mobile) agent.mobile=mobile;

        await agent.save();
        return res.status(200).send({message:"Agent updated successfully",success:true,agent});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error updating agent", success: false, error } );
    }
}