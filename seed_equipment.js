/**
 * SEED EQUIPMENT — ครบ 59 ชิ้น
 * node seed_equipment_final.js
 */

const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const https = require("https");

const API_BASE = "https://api.gymmate.site/api/v1";
const TOKEN = "replace_me_with_token_as_admin";
const IMAGE_DIR = "./equipment_images"; // ← แก้ตรงนี้ถ้า folder ต่างกัน

// ชื่อไฟล์จริงจาก directory listing + type ที่ API รับได้
// API รับ: free_weight | machine | cable | bodyweight | area | facility
const equipmentList = [
  {
    id: 1,
    name: "Barbell",
    type: "free_weight",
    description: "Standard Olympic barbell for compound lifts",
    file: "01_Barbell.jpg",
  },
  {
    id: 2,
    name: "Dumbbells",
    type: "free_weight",
    description: "Adjustable or fixed dumbbells for various exercises",
    file: "02_Dumbbells.png",
  },
  {
    id: 3,
    name: "Kettlebell",
    type: "free_weight",
    description: "Cast iron kettlebell for dynamic movements",
    file: "03_Kettlebell.jpg",
  },
  {
    id: 4,
    name: "EZ Curl Bar",
    type: "free_weight",
    description: "Angled barbell designed for bicep and tricep exercises",
    file: "04_EZ_Curl_Bar.jpg",
  },
  {
    id: 5,
    name: "Bench",
    type: "free_weight",
    description: "Flat/incline/decline bench for pressing exercises",
    file: "05_Weight_Bench.jpg",
  },
  {
    id: 6,
    name: "EZ Curl Bar Rack",
    type: "free_weight",
    description: "Storage rack for EZ curl bars",
    file: "06_EZ_Curl_Bar_Rack.jpg",
  },
  {
    id: 7,
    name: "Olympic Lifting Platform",
    type: "free_weight",
    description: "Dedicated platform for Olympic lifts",
    file: "07_Olympic_Lifting_Platform.jpg",
  },
  {
    id: 8,
    name: "Free Weight Area",
    type: "area",
    description: "Designated area for free weight training",
    file: "08_Free_Weight_Area_gym.jpg",
  },
  {
    id: 9,
    name: "Cable Machine",
    type: "cable",
    description: "Adjustable cable pulley machine for various exercises",
    file: "09_Cable_Machine_gym.jpg",
  },
  {
    id: 10,
    name: "Cable Crossover Machine",
    type: "cable",
    description: "Dual cable machine for chest fly and crossover movements",
    file: "10_Cable_Crossover_Machine.jpg",
  },
  {
    id: 11,
    name: "Cable Chest Fly",
    type: "cable",
    description: "Cable station configured for chest fly exercises",
    file: "11_Cable_Chest_Fly_Machine.jpg",
  },
  {
    id: 12,
    name: "Chest Press Machine",
    type: "machine",
    description: "Plate-loaded or selectorized chest press machine",
    file: "12_Chest_Press_Machine.jpg",
  },
  {
    id: 13,
    name: "Incline Chest Press Machine",
    type: "machine",
    description: "Machine for incline chest press targeting upper chest",
    file: "13_Incline_Chest_Press_Machine.jpg",
  },
  {
    id: 14,
    name: "Pec Fly Machine",
    type: "machine",
    description: "Machine for pectoral fly movements",
    file: "14_Pec_Fly_Machine.jpg",
  },
  {
    id: 15,
    name: "Pec Deck Fly",
    type: "machine",
    description: "Pec deck machine for chest isolation",
    file: "15_Pec_Deck_Fly_Machine.jpg",
  },
  {
    id: 16,
    name: "Incline Barbell Bench Press Station",
    type: "machine",
    description: "Incline bench press setup",
    file: "16_Incline_Barbell_Bench_Press_Station.jpg",
  },
  {
    id: 17,
    name: "Flat Barbell Bench Press Station",
    type: "machine",
    description: "Flat bench press setup",
    file: "17_Flat_Barbell_Bench_Press_Station.jpg",
  },
  {
    id: 18,
    name: "Lat Pulldown Machine",
    type: "machine",
    description: "Cable machine for lat pulldown exercises",
    file: "18_Lat_Pulldown_Machine.jpg",
  },
  {
    id: 19,
    name: "Row Machine",
    type: "machine",
    description: "Machine for rowing movements targeting back muscles",
    file: "19_Rowing_Machine_gym.jpg",
  },
  {
    id: 20,
    name: "Seated Row Machine",
    type: "machine",
    description: "Seated cable row machine for back thickness",
    file: "20_Seated_Row_Machine.jpg",
  },
  {
    id: 21,
    name: "Lat Pull",
    type: "machine",
    description: "Lat pull machine for vertical pulling movements",
    file: "21_Lat_Pull_Machine.jpg",
  },
  {
    id: 22,
    name: "Dual Lat Machine",
    type: "machine",
    description: "Dual independent lat pulldown machine",
    file: "22_Dual_Lat_Machine.jpg",
  },
  {
    id: 23,
    name: "Seated Cable Row",
    type: "cable",
    description: "Cable row station for horizontal pulling",
    file: "23_Seated_Cable_Row_Machine.jpg",
  },
  {
    id: 24,
    name: "Shoulder Press Machine",
    type: "machine",
    description: "Machine for overhead shoulder press",
    file: "24_Shoulder_Press_Machine.jpg",
  },
  {
    id: 25,
    name: "Lateral Raise Machine",
    type: "machine",
    description: "Machine for lateral shoulder raise isolation",
    file: "25_Lateral_Raise_Machine.jpg",
  },
  {
    id: 26,
    name: "Seated Shoulder Press",
    type: "machine",
    description: "Seated shoulder press station",
    file: "26_Seated_Shoulder_Press_Machine.jpg",
  },
  {
    id: 27,
    name: "Preacher Curl Machine",
    type: "machine",
    description: "Machine for preacher curl bicep exercise",
    file: "27_Preacher_Curl_Machine.jpg",
  },
  {
    id: 28,
    name: "Tricep Extension Machine",
    type: "machine",
    description: "Machine for tricep extension isolation",
    file: "28_Tricep_Extension_Machine.jpg",
  },
  {
    id: 29,
    name: "Seated Triceps Press",
    type: "machine",
    description: "Seated machine for triceps pressing movement",
    file: "29_Seated_Triceps_Press_Machine.jpg",
  },
  {
    id: 30,
    name: "Leg Press Machine",
    type: "machine",
    description: "45-degree or horizontal leg press machine",
    file: "30_Leg_Press_Machine.jpg",
  },
  {
    id: 31,
    name: "Seated Leg Press Machine",
    type: "machine",
    description: "Horizontal seated leg press machine",
    file: "31_Seated_Leg_Press_Machine.jpg",
  },
  {
    id: 32,
    name: "V Squat Machine",
    type: "machine",
    description: "V-squat machine for quad-focused leg training",
    file: "32_V_Squat_Machine.jpg",
  },
  {
    id: 33,
    name: "Leg Extension Machine",
    type: "machine",
    description: "Machine for quadriceps isolation",
    file: "33_Leg_Extension_Machine.jpg",
  },
  {
    id: 34,
    name: "Leg Curl Machine",
    type: "machine",
    description: "Machine for hamstring curl isolation",
    file: "34_Leg_Curl_Machine.jpg",
  },
  {
    id: 35,
    name: "Lying Leg Curl Machine",
    type: "machine",
    description: "Prone position leg curl machine",
    file: "35_Lying_Leg_Curl_Machine.jpg",
  },
  {
    id: 36,
    name: "Seated Leg Curl Machine",
    type: "machine",
    description: "Seated leg curl machine for hamstrings",
    file: "36_Seated_Leg_Curl_Machine.jpg",
  },
  {
    id: 37,
    name: "Standing Leg Curl Machine",
    type: "machine",
    description: "Standing single-leg curl machine",
    file: "37_Standing_Leg_Curl_Machine.jpg",
  },
  {
    id: 38,
    name: "Hip Abductor Machine",
    type: "machine",
    description: "Machine for hip abductor muscle isolation",
    file: "38_Hip_Abductor_Machine.jpg",
  },
  {
    id: 39,
    name: "Hip Adductor Machine",
    type: "machine",
    description: "Machine for hip adductor muscle isolation",
    file: "39_Hip_Adductor_Machine.jpg",
  },
  {
    id: 40,
    name: "Seated Calf Press Machine",
    type: "machine",
    description: "Seated machine for calf raise exercise",
    file: "40_Seated_Calf_Press_Machine.jpg",
  },
  {
    id: 41,
    name: "Smith Machine",
    type: "machine",
    description: "Fixed barbell path machine for guided movements",
    file: "41_Smith_Machine.jpg",
  },
  {
    id: 42,
    name: "Squat Rack",
    type: "machine",
    description: "Power rack for squats and pressing",
    file: "42_Squat_Rack.jpg",
  },
  {
    id: 43,
    name: "Abdominal Machine",
    type: "machine",
    description: "Machine for abdominal crunch movements",
    file: "43_Abdominal_Crunch_Machine.jpg",
  },
  {
    id: 44,
    name: "Captain Chair Abs Station",
    type: "bodyweight",
    description: "Captain chair for hanging leg raise and knee tuck",
    file: "44_Captain_Chair_Abs_Station.jpg",
  },
  {
    id: 45,
    name: "Seated Crunch Machine",
    type: "machine",
    description: "Seated machine for abdominal crunch isolation",
    file: "45_Seated_Crunch_Machine.jpg",
  },
  {
    id: 46,
    name: "Roman Chair",
    type: "bodyweight",
    description: "Roman chair for back extension and core exercises",
    file: "46_Roman_Chair_Hyperextension.jpg",
  },
  {
    id: 47,
    name: "Treadmill",
    type: "machine",
    description: "Motorized treadmill for running and walking",
    file: "47_Treadmill.jpg",
  },
  {
    id: 48,
    name: "Exercise Bike",
    type: "machine",
    description: "Stationary bike for cardio",
    file: "48_Exercise_Stationary_Bike.jpg",
  },
  {
    id: 49,
    name: "Rowing Machine",
    type: "machine",
    description: "Indoor rowing machine for cardio",
    file: "49_Rowing_Machine_cardio.jpg",
  },
  {
    id: 50,
    name: "Curve Treadmill",
    type: "machine",
    description: "Curved manual treadmill",
    file: "50_Curved_Treadmill.jpg",
  },
  {
    id: 51,
    name: "Pull up Bar",
    type: "bodyweight",
    description: "Fixed bar for pull-up and chin-up exercises",
    file: "51_Pull_Up_Bar.jpg",
  },
  {
    id: 52,
    name: "Dip Station",
    type: "bodyweight",
    description: "Parallel bars for dip exercises",
    file: "52_Dip_Station.png",
  },
  {
    id: 53,
    name: "Assisted Pull Up Machine",
    type: "machine",
    description: "Counter-weighted machine for assisted pull-ups and dips",
    file: "53_Assisted_Pull_Up_Machine.jpg",
  },
  {
    id: 54,
    name: "Bodyweight training no equipment icon",
    type: "bodyweight",
    description: "Bodyweight training zone requiring no equipment",
    file: "54_Bodyweight_Training_Area.jpg",
  },
  {
    id: 55,
    name: "Aerobic fitness area gym",
    type: "area",
    description: "Open floor area for aerobic and group fitness",
    file: "55_Aerobic_Fitness_Zone.jpg",
  },
  {
    id: 56,
    name: "Cardio zone gym",
    type: "area",
    description: "Dedicated zone for cardiovascular equipment",
    file: "56_Cardio_Zone_gym.jpg",
  },
  {
    id: 57,
    name: "Gym reception counter",
    type: "facility",
    description: "Front desk reception area of the gym",
    file: "57_Gym_Reception_Counter.jpg",
  },
  {
    id: 58,
    name: "Gym vending machine",
    type: "facility",
    description: "Vending machine for snacks and supplements",
    file: "58_Gym_Vending_Machine.jpg",
  },
  {
    id: 59,
    name: "Gym locker",
    type: "facility",
    description: "Locker room storage for member belongings",
    file: "59_Gym_Locker_Room.jpg",
  },
];

function uploadEquipment(eq, imagePath) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("equipment_name", eq.name);
    form.append("equipment_type", eq.type);
    form.append("description", eq.description);
    form.append("status", "ACTIVE");

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

    const url = new URL(`${API_BASE}/equipment/${eq.id}`);
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
  console.log("🏋️  SEED EQUIPMENT — 59 ชิ้น");
  console.log(`📁 Image folder: ${path.resolve(IMAGE_DIR)}`);
  console.log("=".repeat(60) + "\n");

  const logPath = "./seed_equipment_final_progress.json";
  let progress = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, "utf8"))
    : {};
  const prevDone = Object.values(progress).filter(
    (v) => v.status === "success",
  ).length;
  if (prevDone > 0)
    console.log(`📂 Progress เดิม: สำเร็จแล้ว ${prevDone}/59\n`);

  let success = 0,
    fail = 0,
    skipped = 0;

  for (const eq of equipmentList) {
    const key = `id_${eq.id}`;

    if (progress[key]?.status === "success") {
      console.log(`⏭️  [${eq.id}/59] ${eq.name}`);
      skipped++;
      continue;
    }

    const imagePath = path.join(IMAGE_DIR, eq.file);
    const exists = fs.existsSync(imagePath);

    console.log(`📤 [${eq.id}/59] ${eq.name}`);
    console.log(`   📎 ${eq.file} ${exists ? "" : "⚠️  ไม่พบไฟล์!"}`);

    try {
      const result = await uploadEquipment(eq, exists ? imagePath : null);
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
  console.log(`🏆 รวมสำเร็จทั้งหมด: ${totalDone}/59`);
  console.log("=".repeat(60));
}

main().catch(console.error);
