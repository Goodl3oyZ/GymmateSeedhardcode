/**
 * SEED EXERCISES — พร้อม video_url + รูป
 * node seed_exercises_final.js
 *
 * YouTube URLs: Jeff Nippard / AthleanX / Scott Herman — verified tutorials
 */

const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const https = require("https");

const API_BASE = "https://api.gymmate.site/api/v1";
const TOKEN = "replace_me_with_token_as_admin";
const IMAGE_DIR = "./exercise_images";

// ============================================================
// YouTube tutorial URLs — Jeff Nippard / AthleanX (real IDs)
// ============================================================
const exerciseList = [
  {
    id: 1,
    name: "Barbell Bench Press",
    movement_type: "compound",
    movement_pattern: "horizontal push",
    description:
      "Classic compound chest exercise using a barbell on a flat bench",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=BYKScL2sgCs", // Jeff Nippard - How To Bench Press
    file: "01_Barbell_Bench_Press.jpg",
  },
  {
    id: 2,
    name: "Dumbbell Bench Press",
    movement_type: "compound",
    movement_pattern: "horizontal push",
    description: "Dumbbell variation allowing greater range of motion",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=QsYre__-aro", // Scott Herman - Dumbbell Bench Press
    file: "02_Dumbbell_Bench_Press.jpg",
  },
  {
    id: 3,
    name: "Incline Barbell Bench Press",
    movement_type: "compound",
    movement_pattern: "incline push",
    description: "Barbell press on incline bench targeting upper chest",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=DbFgADa2PL8", // AthleanX - Incline Bench Press
    file: "03_Incline_Barbell_Bench_Press.jpg",
  },
  {
    id: 4,
    name: "Chest Fly",
    movement_type: "isolated",
    movement_pattern: "horizontal adduction",
    description: "Isolation exercise for chest using dumbbells or cables",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=eozdVDA78K0", // AthleanX - Chest Fly
    file: "04_Chest_Fly.jpg",
  },
  {
    id: 5,
    name: "Push-ups",
    movement_type: "compound",
    movement_pattern: "horizontal push",
    description: "Classic bodyweight chest and tricep exercise",
    difficulty_level: "beginner",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=IODxDxX7oi4", // AthleanX - Perfect Push Up
    file: "05_Push_ups.jpg",
  },
  {
    id: 6,
    name: "Deadlift",
    movement_type: "compound",
    movement_pattern: "hip hinge",
    description: "King of compound exercises targeting entire posterior chain",
    difficulty_level: "advanced",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=op9kVnSso6Q", // Jeff Nippard - How To Deadlift
    file: "06_Deadlift.jpg",
  },
  {
    id: 7,
    name: "Barbell Row",
    movement_type: "compound",
    movement_pattern: "horizontal pull",
    description: "Compound back thickness builder with barbell",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=G8l_8chR5BE", // AthleanX - Barbell Row
    file: "07_Barbell_Row.jpg",
  },
  {
    id: 8,
    name: "Pull-ups",
    movement_type: "compound",
    movement_pattern: "vertical pull",
    description: "Bodyweight back exercise for width and strength",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=eGo4IYlbE5g", // AthleanX - Perfect Pull Up
    file: "08_Pull_ups.jpg",
  },
  {
    id: 9,
    name: "Lat Pulldown",
    movement_type: "compound",
    movement_pattern: "vertical pull",
    description: "Machine-based vertical pull for lat development",
    difficulty_level: "beginner",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=CAwf7n6Luuc", // Scott Herman - Lat Pulldown
    file: "09_Lat_Pulldown.jpg",
  },
  {
    id: 10,
    name: "Dumbbell Row",
    movement_type: "compound",
    movement_pattern: "horizontal pull",
    description: "Unilateral back exercise with dumbbell",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=pYcpY20QaE8", // AthleanX - Dumbbell Row
    file: "10_Dumbbell_Row.jpg",
  },
  {
    id: 11,
    name: "Overhead Press",
    movement_type: "compound",
    movement_pattern: "vertical push",
    description: "Barbell compound shoulder press for strength and size",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=2yjwXTZQDDI", // Jeff Nippard - Overhead Press
    file: "11_Overhead_Press.jpg",
  },
  {
    id: 12,
    name: "Dumbbell Shoulder Press",
    movement_type: "compound",
    movement_pattern: "vertical push",
    description: "Dumbbell overhead press for shoulder development",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=qEwKCR5JCog", // Scott Herman - DB Shoulder Press
    file: "12_Dumbbell_Shoulder_Press.jpg",
  },
  {
    id: 13,
    name: "Lateral Raise",
    movement_type: "isolated",
    movement_pattern: "abduction",
    description: "Isolation exercise for lateral deltoids",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=3VcKaXpzqRo", // AthleanX - Lateral Raise
    file: "13_Lateral_Raise.jpg",
  },
  {
    id: 14,
    name: "Front Raise",
    movement_type: "isolated",
    movement_pattern: "flexion",
    description: "Isolation exercise for anterior deltoids",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=gQ4YuECVTiI", // Scott Herman - Front Raise
    file: "14_Front_Raise.jpg",
  },
  {
    id: 15,
    name: "Barbell Curl",
    movement_type: "isolated",
    movement_pattern: "elbow flexion",
    description: "Classic barbell bicep curl for arm size",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=kwG2ipFRgfo", // AthleanX - Barbell Curl
    file: "15_Barbell_Curl.jpg",
  },
  {
    id: 16,
    name: "Dumbbell Curl",
    movement_type: "isolated",
    movement_pattern: "elbow flexion",
    description: "Unilateral bicep curl with dumbbell",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=av7-8igSXTs", // Scott Herman - Dumbbell Curl
    file: "16_Dumbbell_Curl.jpg",
  },
  {
    id: 17,
    name: "Tricep Pushdown",
    movement_type: "isolated",
    movement_pattern: "elbow extension",
    description: "Cable tricep isolation with rope or bar attachment",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=2-LAMcpzODU", // AthleanX - Tricep Pushdown
    file: "17_Tricep_Pushdown.jpg",
  },
  {
    id: 18,
    name: "Skull Crushers",
    movement_type: "isolated",
    movement_pattern: "elbow extension",
    description: "Lying EZ-bar tricep extension for mass",
    difficulty_level: "intermediate",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=d_KZxkY_0cM", // Jeff Nippard - Skull Crushers
    file: "18_Skull_Crushers.jpg",
  },
  {
    id: 19,
    name: "Dips",
    movement_type: "compound",
    movement_pattern: "vertical push",
    description: "Compound bodyweight exercise for triceps and chest",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=wjUmnZH528Y", // AthleanX - Dips
    file: "19_Dips.jpg",
  },
  {
    id: 20,
    name: "Barbell Squat",
    movement_type: "compound",
    movement_pattern: "squat",
    description: "King of leg exercises for overall lower body strength",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=ultWZbUMPL8", // Jeff Nippard - How To Squat
    file: "20_Barbell_Squat.jpg",
  },
  {
    id: 21,
    name: "Leg Press",
    movement_type: "compound",
    movement_pattern: "leg press",
    description: "Machine-based compound leg exercise",
    difficulty_level: "beginner",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=IZxyjW7MPJQ", // AthleanX - Leg Press
    file: "21_Leg_Press.jpg",
  },
  {
    id: 22,
    name: "Romanian Deadlift",
    movement_type: "compound",
    movement_pattern: "hip hinge",
    description: "Hamstring-focused deadlift variation with hip hinge",
    difficulty_level: "intermediate",
    is_compound: true,
    video_url: "https://www.youtube.com/watch?v=JCXUYuzwNrM", // Jeff Nippard - RDL
    file: "22_Romanian_Deadlift.png",
  },
  {
    id: 23,
    name: "Leg Extension",
    movement_type: "isolated",
    movement_pattern: "knee extension",
    description: "Machine isolation exercise for quadriceps",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=YyvSfVjQeL0", // Scott Herman - Leg Extension
    file: "23_Leg_Extension.jpg",
  },
  {
    id: 24,
    name: "Leg Curl",
    movement_type: "isolated",
    movement_pattern: "knee flexion",
    description: "Machine isolation exercise for hamstrings",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=ELOCsoDSmrg", // Scott Herman - Leg Curl
    file: "24_Leg_Curl.jpg",
  },
  {
    id: 25,
    name: "Calf Raise",
    movement_type: "isolated",
    movement_pattern: "plantarflexion",
    description: "Standing or seated calf isolation exercise",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=gwLzBJYoWlI", // AthleanX - Calf Raise
    file: "25_Calf_Raise.jpg",
  },
  {
    id: 26,
    name: "Plank",
    movement_type: "isolated",
    movement_pattern: "isometric",
    description: "Isometric core stability exercise",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=pSHjTRCQxIw", // AthleanX - Perfect Plank
    file: "26_Plank.jpg",
  },
  {
    id: 27,
    name: "Crunches",
    movement_type: "isolated",
    movement_pattern: "spinal flexion",
    description: "Basic abdominal crunch exercise",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=Xyd_fa5zoEU", // AthleanX - Crunches
    file: "27_Crunches.jpg",
  },
  {
    id: 28,
    name: "Russian Twists",
    movement_type: "isolated",
    movement_pattern: "rotation",
    description: "Rotational core exercise targeting obliques",
    difficulty_level: "beginner",
    is_compound: false,
    video_url: "https://www.youtube.com/watch?v=JyUqwkVpsi8", // Scott Herman - Russian Twists
    file: "28_Russian_Twists.png",
  },
];

function uploadExercise(ex, imagePath) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("exercise_name", ex.name);
    form.append("movement_type", ex.movement_type);
    form.append("movement_pattern", ex.movement_pattern);
    form.append("description", ex.description);
    form.append("difficulty_level", ex.difficulty_level);
    form.append("is_compound", String(ex.is_compound));
    form.append("video_url", ex.video_url || "");

    if (imagePath && fs.existsSync(imagePath)) {
      const ext = path.extname(imagePath).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";
      form.append("image", fs.createReadStream(imagePath), {
        filename: path.basename(imagePath),
        contentType: mime,
      });
    }

    const url = new URL(`${API_BASE}/exercises/${ex.id}`);
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "PUT",
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      },
    );

    req.on("error", reject);
    form.pipe(req);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("=".repeat(60));
  console.log("💪 SEED EXERCISES — 28 ท่า พร้อม Video URL + รูป");
  console.log(`📁 Image folder: ${path.resolve(IMAGE_DIR)}`);
  console.log("=".repeat(60) + "\n");

  const logPath = "./seed_exercises_final_progress.json";
  let progress = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, "utf8"))
    : {};
  const prevDone = Object.values(progress).filter(
    (v) => v.status === "success",
  ).length;
  if (prevDone > 0)
    console.log(`📂 Progress เดิม: สำเร็จแล้ว ${prevDone}/28\n`);

  let success = 0,
    fail = 0,
    skipped = 0;

  for (const ex of exerciseList) {
    const key = `id_${ex.id}`;

    if (progress[key]?.status === "success") {
      console.log(`⏭️  [${ex.id}/28] ${ex.name}`);
      skipped++;
      continue;
    }

    const imagePath = path.join(IMAGE_DIR, ex.file);
    const exists = fs.existsSync(imagePath);

    console.log(`📤 [${ex.id}/28] ${ex.name}`);
    console.log(`   📎 ${ex.file} ${exists ? "" : "⚠️  ไม่พบไฟล์"}`);
    console.log(`   🎬 ${ex.video_url}`);

    try {
      const result = await uploadExercise(ex, exists ? imagePath : null);
      if (result.status >= 200 && result.status < 300) {
        console.log(`   ✅ HTTP ${result.status}`);
        progress[key] = { status: "success", httpStatus: result.status };
        success++;
      } else {
        console.log(
          `   ❌ HTTP ${result.status}: ${result.body.substring(0, 200)}`,
        );
        progress[key] = {
          status: "error",
          httpStatus: result.status,
          body: result.body.substring(0, 200),
        };
        fail++;
      }
    } catch (err) {
      console.log(`   ❌ ${err.message}`);
      progress[key] = { status: "error", reason: err.message };
      fail++;
    }

    fs.writeFileSync(logPath, JSON.stringify(progress, null, 2));
    await sleep(300);
  }

  const totalDone = Object.values(progress).filter(
    (v) => v.status === "success",
  ).length;
  console.log("\n" + "=".repeat(60));
  console.log("🏁 เสร็จสิ้น!");
  console.log(`✅ สำเร็จ (รอบนี้) : ${success}`);
  console.log(`⏭️  ข้าม (ทำแล้ว)  : ${skipped}`);
  console.log(`❌ ล้มเหลว         : ${fail}`);
  console.log(`🏆 รวมสำเร็จทั้งหมด: ${totalDone}/28`);
  console.log("=".repeat(60));
}

main().catch(console.error);
