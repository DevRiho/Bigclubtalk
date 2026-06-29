import { connectDatabase } from "./config/db.js";
import { assertEnv } from "./config/env.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import mongoose from "mongoose";

async function seed() {
  try {
    assertEnv();
    await connectDatabase();

    // 1. Seed Admin User
    const adminEmail = "admin@bigclubtalk.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      existingAdmin.role = "admin";
      existingAdmin.isEmailVerified = true;
      existingAdmin.password = "AdminPass123!";
      await existingAdmin.save();
      console.log(`Admin user credentials updated. Email: ${adminEmail}, Password: AdminPass123!`);
    } else {
      await User.create({
        name: "BCT Admin",
        email: adminEmail,
        password: "AdminPass123!",
        role: "admin",
        isEmailVerified: true
      });
      console.log(`Admin user created. Email: ${adminEmail}, Password: AdminPass123!`);
    }

    // 2. Seed Default Categories
    const defaultCategories = [
      { name: "Tactics", slug: "tactics", color: "#E10600" },
      { name: "Transfers", slug: "transfers", color: "#FFB000" },
      { name: "Analysis", slug: "analysis", color: "#0057FF" },
      { name: "News", slug: "news", color: "#101820" }
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Category created: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seed();
