import { connectDatabase } from "./config/db.js";
import { assertEnv } from "./config/env.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import { Post } from "./models/Post.js";
import mongoose from "mongoose";
import slugify from "slugify";

const stories = [
  {
    title: "The Evolution of the Inverted Fullback in Modern Tactics",
    excerpt: "How Pep Guardiola, Mikel Arteta, and other elite managers redefined positional play by migrating fullbacks into central midfield.",
    categoryName: "Tactics",
    tags: ["tactics", "guardiola", "arteta", "premier league"],
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>In modern football, the fullback position has undergone the most radical evolution of any role on the pitch. No longer just tasked with hugging the touchline, overlapping, and delivering crosses, contemporary fullbacks are now orchestrating games from central midfield.</p>
      <p>Pep Guardiola famously introduced this concept at Bayern Munich with Philipp Lahm and David Alaba, and perfected it at Manchester City. By moving the fullback inside when in possession, the team creates a box midfield (typically a 3-2-4-1 or 3-2-2-3 shape), giving them numerical superiority in central zones and better rest defense to stop counterattacks.</p>
      <p>Mikel Arteta has deployed similar systems at Arsenal with Oleksandr Zinchenko and Jurrien Timber. This tactical tweak allows technical players to overload the half-spaces and control transitions, making the inverted fullback one of the most critical structural concepts of this decade.</p>
    `
  },
  {
    title: "Inside the Data Revolution: How Algorithmic Scouting Replaced the Traditional Eye Test",
    excerpt: "An in-depth look at how top European football clubs utilize advanced metrics, machine learning, and tracking data to scout under-the-radar talent.",
    categoryName: "Transfers",
    tags: ["transfers", "data", "scouting", "analytics"],
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>The days of scouts relying solely on a notepad and their gut feeling are disappearing. Today, the world's most successful clubs—pioneered by the likes of Brentford and Brighton—rely heavily on algorithmic scouting systems to discover hidden gems across global markets.</p>
      <p>Advanced metrics such as expected threat (xT), packing rate, and defensive coverage intensity allow analysts to filter thousands of players instantly. Machine learning algorithms can compare a target player's statistical profile with an outgoing star, highlighting direct replacements at a fraction of the cost.</p>
      <p>While the traditional eye test remains crucial for evaluating a player's temperament and adaptability, data-driven recruitment has dramatically reduced the margin of error in multimillion-pound transfer windows.</p>
    `
  },
  {
    title: "Why Midfield Structural Balance is the Key to Unlocking Bukayo Saka",
    excerpt: "Analyzing how Arsenal's midfield structure—specifically Declan Rice's defensive coverage—allows Bukayo Saka to play with maximum attacking freedom.",
    categoryName: "Analysis",
    tags: ["analysis", "arsenal", "saka", "tactics"],
    featured: false,
    coverUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>Bukayo Saka's output for Arsenal has been nothing short of world-class, but his attacking efficiency is deeply tied to the structural balance of the players behind him. In this analysis, we look at how the spacing and positioning of Arsenal's midfield trio create the perfect environment for him to excel.</p>
      <p>Declan Rice’s elite recovery pace and defensive coverage on the left and central channels allow Arsenal to push their right-sided midfielder higher up the pitch. This draws opposing defenders away from Saka, isolating him in 1v1 situations where he is deadliest.</p>
      <p>Additionally, the overlapping runs of Ben White or the underlapping movements of Martin Ødegaard create constant dilemmas for left-backs. With structural protection behind them, Arsenal can consistently isolate Saka against isolated fullbacks.</p>
    `
  },
  {
    title: "The Multi-Club Ownership Dilemma: What It Means for Mid-Tier European Clubs",
    excerpt: "As holding companies acquire multiple football clubs across different countries, we examine the sporting integrity risks and potential benefits for smaller teams.",
    categoryName: "News",
    tags: ["news", "ownership", "uefa", "governance"],
    featured: false,
    coverUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>Multi-club ownership (MCO) is rapidly becoming the dominant model in football governance. From City Football Group to Red Bull, massive conglomerates are buying stakes in clubs across different leagues to build networks for talent development, scouting sharing, and financial hedging.</p>
      <p>For mid-tier and smaller clubs, entering an MCO network can bring vital financial stability, access to elite loan players, and modern coaching methods. However, it often turns these historic clubs into mere feeder teams, eroding their sporting ambition and fan identity.</p>
      <p>UEFA is facing mounting pressure to regulate these networks as multi-club ownership threatens sporting integrity, especially when sister clubs qualify for the same European competitions.</p>
    `
  },
  {
    title: "The Soul of the Club: Why Fan-Led Protests Over Rising Ticket Prices Matter",
    excerpt: "With ticket prices soaring across top leagues, match-going fans are fighting back to preserve the community identity of their local clubs.",
    categoryName: "Fan Opinions",
    tags: ["opinions", "fans", "ticket prices", "community"],
    featured: true,
    coverUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>Football was built as a working-class sport, a weekly escape for local communities. Today, however, the skyrocketing cost of matchday tickets is pricing out the very people who created the culture of these historic clubs.</p>
      <p>Across Europe, fan coalitions are staging walkouts, displaying banners, and lobbying governments to cap ticket prices. They argue that clubs are treating stadiums as tourist attractions rather than community assets.</p>
      <p>Atmosphere is what makes football commercializable on television; without the vocal, passionate, local support in the stands, the sport loses its unique magic. Supporting these fan protests is not just about saving money—it's about saving the soul of the game.</p>
    `
  },
  {
    title: "Is the Traditional Number 9 Striker Dead or Just Evolving?",
    excerpt: "From Erling Haaland to Harry Kane, we analyze how modern central forwards are adapting to compact defensive blocks and low blocks.",
    categoryName: "Tactics",
    tags: ["tactics", "haaland", "kane", "strikers"],
    featured: false,
    coverUrl: "https://images.unsplash.com/photo-1431324155629-1a6edd1d1315?auto=format&fit=crop&w=800&q=80",
    content: `
      <p>For a period, the traditional target man seemed to be facing extinction. The rise of fluid front threes and false nines suggested that teams preferred mobility and midfield-overloading over static physical presence.</p>
      <p>However, the explosive success of Erling Haaland and the complete playmaking striker model of Harry Kane have proved that the number 9 is alive and well—it has just adapted. Modern strikers must now press aggressively, participate in build-up play, and create space for inside forwards while maintaining elite box movement.</p>
    `
  }
];

async function seedStories() {
  try {
    assertEnv();
    await connectDatabase();

    // 1. Get Admin Author
    const author = await User.findOne({ role: "admin" });
    if (!author) {
      console.log("No admin user found. Please run npm run seed first.");
      process.exit(1);
    }

    console.log(`Using admin author: ${author.name} (${author._id})`);

    // 2. Map and seed categories
    const categoriesMap = {};
    const uniqueCategoryNames = [...new Set(stories.map(s => s.categoryName))];

    for (const name of uniqueCategoryNames) {
      const slug = slugify(name, { lower: true, strict: true });
      let category = await Category.findOne({ slug });
      
      if (!category) {
        // Create matching colors
        let color = "#101820";
        if (name === "Tactics") color = "#E10600";
        if (name === "Transfers") color = "#FFB000";
        if (name === "Analysis") color = "#0057FF";
        if (name === "Fan Opinions") color = "#00875A";

        category = await Category.create({ name, slug, color });
        console.log(`Created Category: ${name}`);
      } else {
        console.log(`Found existing Category: ${name}`);
      }
      categoriesMap[name] = category._id;
    }

    // 3. Clear existing posts to prevent duplicate slugs
    const deleteResult = await Post.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing posts.`);

    // 4. Create new posts
    for (const story of stories) {
      const slug = slugify(story.title, { lower: true, strict: true });
      
      const words = story.content.trim().split(/\s+/).length;
      const readingTime = Math.max(Math.ceil(words / 220), 1);

      await Post.create({
        title: story.title,
        slug,
        content: story.content,
        excerpt: story.excerpt,
        coverImage: {
          url: story.coverUrl,
          alt: story.title
        },
        category: categoriesMap[story.categoryName],
        tags: story.tags,
        readingTime,
        author: author._id,
        status: "published",
        featured: story.featured,
        views: Math.floor(Math.random() * 500) + 50,
        publishedAt: new Date()
      });
      console.log(`Seeded post: ${story.title}`);
    }

    console.log("Database seeded with football stories successfully!");
  } catch (error) {
    console.error("Failed to seed stories:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seedStories();
