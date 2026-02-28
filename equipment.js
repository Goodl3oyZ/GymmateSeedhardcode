/**
 * GYM EQUIPMENT ICON - Google Images + Manual Confirm
 *
 * วิธีใช้:
 * 1. node save_session.js  (ถ้ายังไม่ได้ทำ)
 * 2. node gym_icon_google.js
 *
 * Flow:
 * - Script เปิด Google Images ค้นหาอุปกรณ์แต่ละชิ้น
 * - คุณดูรูป แล้วคลิกรูปที่ชอบ
 * - กด ENTER → save
 * - กด r → ค้นใหม่ด้วย keyword อื่น
 * - กด s → ข้าม
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const equipmentList = [
  { id: 1, name: "Barbell" },
  { id: 2, name: "Dumbbells" },
  { id: 3, name: "Kettlebell" },
  { id: 4, name: "EZ Curl Bar" },
  { id: 5, name: "Weight Bench" },
  { id: 6, name: "EZ Curl Bar Rack" },
  { id: 7, name: "Olympic Lifting Platform" },
  { id: 8, name: "Free Weight Area gym" },
  { id: 9, name: "Cable Machine gym" },
  { id: 10, name: "Cable Crossover Machine" },
  { id: 11, name: "Cable Chest Fly Machine" },
  { id: 12, name: "Chest Press Machine" },
  { id: 13, name: "Incline Chest Press Machine" },
  { id: 14, name: "Pec Fly Machine" },
  { id: 15, name: "Pec Deck Fly Machine" },
  { id: 16, name: "Incline Barbell Bench Press Station" },
  { id: 17, name: "Flat Barbell Bench Press Station" },
  { id: 18, name: "Lat Pulldown Machine" },
  { id: 19, name: "Rowing Machine gym" },
  { id: 20, name: "Seated Row Machine" },
  { id: 21, name: "Lat Pull Machine" },
  { id: 22, name: "Dual Lat Machine" },
  { id: 23, name: "Seated Cable Row Machine" },
  { id: 24, name: "Shoulder Press Machine" },
  { id: 25, name: "Lateral Raise Machine" },
  { id: 26, name: "Seated Shoulder Press Machine" },
  { id: 27, name: "Preacher Curl Machine" },
  { id: 28, name: "Tricep Extension Machine" },
  { id: 29, name: "Seated Triceps Press Machine" },
  { id: 30, name: "Leg Press Machine" },
  { id: 31, name: "Seated Leg Press Machine" },
  { id: 32, name: "V Squat Machine" },
  { id: 33, name: "Leg Extension Machine" },
  { id: 34, name: "Leg Curl Machine" },
  { id: 35, name: "Lying Leg Curl Machine" },
  { id: 36, name: "Seated Leg Curl Machine" },
  { id: 37, name: "Standing Leg Curl Machine" },
  { id: 38, name: "Hip Abductor Machine" },
  { id: 39, name: "Hip Adductor Machine" },
  { id: 40, name: "Seated Calf Press Machine" },
  { id: 41, name: "Smith Machine" },
  { id: 42, name: "Squat Rack" },
  { id: 43, name: "Abdominal Crunch Machine" },
  { id: 44, name: "Captain Chair Abs Station" },
  { id: 45, name: "Seated Crunch Machine" },
  { id: 46, name: "Roman Chair Hyperextension" },
  { id: 47, name: "Treadmill" },
  { id: 48, name: "Exercise Stationary Bike" },
  { id: 49, name: "Rowing Machine cardio" },
  { id: 50, name: "Curved Treadmill" },
  { id: 51, name: "Pull Up Bar" },
  { id: 52, name: "Dip Station" },
  { id: 53, name: "Assisted Pull Up Machine" },
  { id: 54, name: "Bodyweight Training Area" },
  { id: 55, name: "Aerobic Fitness Zone" },
  { id: 56, name: "Cardio Zone gym" },
  { id: 57, name: "Gym Reception Counter" },
  { id: 58, name: "Gym Vending Machine" },
  { id: 59, name: "Gym Locker Room" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function waitForKey(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function buildSearchUrl(query) {
  const encoded = encodeURIComponent(
    query + " gym equipment photo white background",
  );
  return `https://www.google.com/search?q=${encoded}&tbm=isch`; // filter transparent bg
}

async function main() {
  const outputDir = "./equipment_images";
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const logPath = path.join(outputDir, "progress.json");
  let progress = {};
  if (fs.existsSync(logPath)) {
    progress = JSON.parse(fs.readFileSync(logPath, "utf8"));
    const done = Object.values(progress).filter(
      (v) => v.status === "done",
    ).length;
    console.log(`📂 Progress: ทำแล้ว ${done}/59 ชิ้น\n`);
  }

  // ใช้ persistent session ถ้ามี ไม่งั้นเปิด browser ใหม่ปกติ
  let browser;
  if (fs.existsSync("./user_session")) {
    browser = await chromium.launchPersistentContext("./user_session", {
      headless: false,
      viewport: { width: 1400, height: 900 },
    });
  } else {
    browser = await chromium.launch({
      headless: false,
      viewport: { width: 1400, height: 900 },
    });
  }

  const page =
    typeof browser.newPage === "function"
      ? await browser.newPage()
      : browser.pages()[0] || (await browser.newPage());

  console.log("=".repeat(60));
  console.log("🔍 GYM ICON FINDER — Google Images + Manual Confirm");
  console.log("=".repeat(60));
  console.log("วิธีใช้:");
  console.log("  [ENTER]  = คลิกรูปที่ต้องการใน browser แล้วกด ENTER บันทึก");
  console.log("  [r]      = ค้นใหม่ด้วย keyword อื่น");
  console.log("  [s]      = ข้ามชิ้นนี้");
  console.log("=".repeat(60) + "\n");

  for (const eq of equipmentList) {
    const key = `id_${eq.id}`;

    if (progress[key]?.status === "done") {
      console.log(`⏭️  [${eq.id}/59] ${eq.name}`);
      continue;
    }

    let currentQuery = eq.name;
    let retry = true;

    while (retry) {
      retry = false;

      console.log(`\n${"─".repeat(60)}`);
      console.log(`🖼️  [${eq.id}/59] ${eq.name}`);
      console.log(
        `🔍 ค้นหา: "${currentQuery} icon flat vector transparent PNG"`,
      );
      console.log(`${"─".repeat(60)}`);

      const searchUrl = buildSearchUrl(currentQuery);
      await page.goto(searchUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await sleep(1500);

      // ปิด cookie popup ถ้ามี
      const acceptBtn = await page.$(
        'button:has-text("Accept all"), button:has-text("I agree")',
      );
      if (acceptBtn) await acceptBtn.click();

      console.log(
        "\n👆 ดูรูปใน browser แล้วคลิกรูปที่ต้องการ (จะเปิด panel ด้านขวา)",
      );
      console.log("   จากนั้นกลับมาที่ terminal:\n");

      const answer = await waitForKey(
        "  [ENTER]=บันทึก  [r]=ค้นใหม่  [s]=ข้าม  → ",
      );

      if (answer === "s") {
        console.log(`⏭️  ข้าม`);
        progress[key] = { status: "skipped" };
        fs.writeFileSync(logPath, JSON.stringify(progress, null, 2));
        break;
      }

      if (answer === "r") {
        const newQuery = await waitForKey("  🔍 พิมพ์ keyword ใหม่: ");
        currentQuery = newQuery || eq.name;
        retry = true;
        continue;
      }

      // ENTER → หา img ที่ใหญ่ที่สุดในหน้า (panel ด้านขวาของ Google Images)
      console.log("\n📷 กำลัง capture รูปที่คลิก...");

      const paddedId = String(eq.id).padStart(2, "0");
      const safeName = eq.name.replace(/[\s/]+/g, "_");

      // Google Images panel รูป preview จะอยู่ใน div ที่มี class เฉพาะ
      // หา img ที่ใหญ่ที่สุดและไม่ใช่ thumbnail
      const imgInfo = await page.evaluate(() => {
        let best = null;
        let bestArea = 0;

        document.querySelectorAll("img").forEach((img) => {
          const rect = img.getBoundingClientRect();
          const src = img.src || img.currentSrc || "";
          const area = rect.width * rect.height;

          // หลีกเลี่ยง Google logo, icons เล็กๆ
          if (
            area > bestArea &&
            rect.width > 150 &&
            rect.height > 150 &&
            src.startsWith("http") &&
            !src.includes("google.com/images/branding") &&
            !src.includes("gstatic.com/images/icons") &&
            !src.includes("data:image/gif") // placeholder
          ) {
            bestArea = area;
            best = {
              src,
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          }
        });
        return best;
      });

      let savedFile = null;

      if (imgInfo && imgInfo.src) {
        console.log(
          `  🔍 รูปที่เลือก: ${Math.round(imgInfo.width)}x${Math.round(imgInfo.height)}px`,
        );
        console.log(`  🔗 URL: ${imgInfo.src.substring(0, 80)}...`);

        // Download ผ่าน page.request (ใช้ session/cookies เดิม)
        try {
          const response = await page.request.get(imgInfo.src, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Referer: "https://www.google.com/",
            },
          });

          if (response.ok()) {
            const buffer = await response.body();
            // หา extension จาก content-type หรือ URL
            const contentType = response.headers()["content-type"] || "";
            let ext = "jpg";
            if (contentType.includes("png") || imgInfo.src.includes(".png"))
              ext = "png";
            else if (
              contentType.includes("webp") ||
              imgInfo.src.includes(".webp")
            )
              ext = "webp";
            else if (contentType.includes("gif")) ext = "gif";

            const fname = `${paddedId}_${safeName}.${ext}`;
            const fpath = path.join(outputDir, fname);
            fs.writeFileSync(fpath, buffer);
            savedFile = fname;
            console.log(
              `  ✅ บันทึก: ${fname} (${Math.round(buffer.length / 1024)} KB)`,
            );
          } else {
            console.log(`  ⚠️  HTTP ${response.status()} ใช้ screenshot แทน`);
          }
        } catch (e) {
          console.log(
            `  ⚠️  download error: ${e.message} — ใช้ screenshot แทน`,
          );
        }

        // Fallback: crop screenshot เฉพาะพื้นที่รูป
        if (!savedFile) {
          const fname = `${paddedId}_${safeName}.png`;
          const fpath = path.join(outputDir, fname);
          try {
            await page.screenshot({
              path: fpath,
              clip: {
                x: Math.max(0, imgInfo.x),
                y: Math.max(0, imgInfo.y),
                width: Math.min(imgInfo.width, 1400 - imgInfo.x),
                height: Math.min(imgInfo.height, 900 - imgInfo.y),
              },
            });
            savedFile = fname;
            console.log(`  ✅ crop screenshot: ${fname}`);
          } catch (e) {
            console.log(`  ⚠️  crop failed: ${e.message}`);
          }
        }
      }

      // Final fallback: screenshot ทั้งหน้า
      if (!savedFile) {
        const fname = `${paddedId}_${safeName}_fullpage.png`;
        const fpath = path.join(outputDir, fname);
        await page.screenshot({ path: fpath });
        savedFile = fname;
        console.log(`  ✅ fullpage screenshot: ${fname}`);
      }

      // ยืนยันกับ user
      const confirm = await waitForKey(
        `\n✅ บันทึก "${savedFile}" แล้ว  ถูกต้องไหม? [y=ใช่ / r=ลองใหม่]: `,
      );
      if (confirm === "r") {
        // ลบไฟล์ที่เพิ่งบันทึก
        if (savedFile) {
          fs.unlink(path.join(outputDir, savedFile), () => {});
        }
        retry = true;
        continue;
      }

      progress[key] = { status: "done", file: savedFile, query: currentQuery };
      fs.writeFileSync(logPath, JSON.stringify(progress, null, 2));
      console.log(`🎉 [${eq.id}/59] ${eq.name} — บันทึกสำเร็จ!\n`);
    }
  }

  // Summary
  const done = Object.values(progress).filter(
    (v) => v.status === "done",
  ).length;
  const skipped = Object.values(progress).filter(
    (v) => v.status === "skipped",
  ).length;
  console.log("\n" + "=".repeat(55));
  console.log(`✅ Done    : ${done}/59`);
  console.log(`⏭️  Skipped : ${skipped}`);
  console.log(`📁 Folder  : ${path.resolve(outputDir)}`);
  console.log("=".repeat(55));

  await browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
