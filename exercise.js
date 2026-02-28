/**
 * EXERCISE IMAGE FINDER
 * Google Images + Manual Confirm + Real Photos
 *
 * วิธีใช้:
 * node exercise.js
 *
 * Flow:
 * - Script เปิด Google Images ค้นท่าออกกำลังกายแต่ละท่า
 * - คลิกรูปที่ชอบใน browser (panel ขวาจะขึ้น)
 * - กด ENTER → save
 * - กด r → ค้นใหม่ / พิมพ์ keyword เอง
 * - กด s → ข้าม
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ============================================================
// EXERCISE LIST (28 ท่า จาก API)
// ============================================================
const exerciseList = [
  { id: 1, name: "Barbell Bench Press" },
  { id: 2, name: "Dumbbell Bench Press" },
  { id: 3, name: "Incline Barbell Bench Press" },
  { id: 4, name: "Chest Fly" },
  { id: 5, name: "Push-ups" },
  { id: 6, name: "Deadlift" },
  { id: 7, name: "Barbell Row" },
  { id: 8, name: "Pull-ups" },
  { id: 9, name: "Lat Pulldown" },
  { id: 10, name: "Dumbbell Row" },
  { id: 11, name: "Overhead Press" },
  { id: 12, name: "Dumbbell Shoulder Press" },
  { id: 13, name: "Lateral Raise" },
  { id: 14, name: "Front Raise" },
  { id: 15, name: "Barbell Curl" },
  { id: 16, name: "Dumbbell Curl" },
  { id: 17, name: "Tricep Pushdown" },
  { id: 18, name: "Skull Crushers" },
  { id: 19, name: "Dips" },
  { id: 20, name: "Barbell Squat" },
  { id: 21, name: "Leg Press" },
  { id: 22, name: "Romanian Deadlift" },
  { id: 23, name: "Leg Extension" },
  { id: 24, name: "Leg Curl" },
  { id: 25, name: "Calf Raise" },
  { id: 26, name: "Plank" },
  { id: 27, name: "Crunches" },
  { id: 28, name: "Russian Twists" },
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
  const encoded = encodeURIComponent(query + " exercise proper form photo");
  return `https://www.google.com/search?q=${encoded}&tbm=isch`;
}

async function main() {
  const outputDir = "./exercise_images";
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const logPath = path.join(outputDir, "progress.json");
  let progress = {};
  if (fs.existsSync(logPath)) {
    progress = JSON.parse(fs.readFileSync(logPath, "utf8"));
    const done = Object.values(progress).filter(
      (v) => v.status === "done",
    ).length;
    console.log(`📂 Progress: ทำแล้ว ${done}/28 ท่า\n`);
  }

  // เปิด browser (ใช้ session เดิมถ้ามี)
  let browser;
  if (fs.existsSync("./user_session")) {
    browser = await chromium.launchPersistentContext("./user_session", {
      headless: false,
      viewport: { width: 1400, height: 900 },
    });
  } else {
    browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized"],
    });
  }

  const page =
    typeof browser.newPage === "function"
      ? await browser.newPage()
      : browser.pages()[0] || (await browser.newPage());

  console.log("=".repeat(60));
  console.log("💪 EXERCISE IMAGE FINDER — Google Images + Manual Confirm");
  console.log("=".repeat(60));
  console.log("วิธีใช้:");
  console.log("  [ENTER]  = คลิกรูปที่ต้องการใน browser แล้วกด ENTER บันทึก");
  console.log("  [r]      = ค้นใหม่ด้วย keyword อื่น");
  console.log("  [s]      = ข้ามท่านี้");
  console.log("=".repeat(60) + "\n");

  for (const ex of exerciseList) {
    const key = `id_${ex.id}`;

    if (progress[key]?.status === "done") {
      console.log(`⏭️  [${ex.id}/28] ${ex.name}`);
      continue;
    }

    let currentQuery = ex.name;
    let retry = true;

    while (retry) {
      retry = false;

      console.log(`\n${"─".repeat(60)}`);
      console.log(`💪 [${ex.id}/28] ${ex.name}`);
      console.log(`🔍 ค้นหา: "${currentQuery} exercise proper form photo"`);
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
        "\n👆 ดูรูปใน browser แล้วคลิกรูปที่ต้องการ (panel ขวาจะขึ้น)",
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
        currentQuery = newQuery || ex.name;
        retry = true;
        continue;
      }

      // ENTER → หา img ที่ใหญ่ที่สุด (panel preview ของ Google Images)
      console.log("\n📷 กำลัง capture รูปที่คลิก...");

      const paddedId = String(ex.id).padStart(2, "0");
      const safeName = ex.name.replace(/[\s/\-]+/g, "_");

      const imgInfo = await page.evaluate(() => {
        let best = null;
        let bestArea = 0;
        document.querySelectorAll("img").forEach((img) => {
          const rect = img.getBoundingClientRect();
          const src = img.src || img.currentSrc || "";
          const area = rect.width * rect.height;
          if (
            area > bestArea &&
            rect.width > 150 &&
            rect.height > 150 &&
            src.startsWith("http") &&
            !src.includes("google.com/images/branding") &&
            !src.includes("gstatic.com/images/icons") &&
            !src.includes("data:image/gif")
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
        console.log(`  🔍 รูปที่เลือก: ${imgInfo.width}x${imgInfo.height}px`);
        console.log(`  🔗 URL: ${imgInfo.src.substring(0, 80)}...`);

        // Download ผ่าน page.request
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
            const contentType = response.headers()["content-type"] || "";
            let ext = "jpg";
            if (contentType.includes("png") || imgInfo.src.includes(".png"))
              ext = "png";
            else if (contentType.includes("webp")) ext = "webp";

            const fname = `${paddedId}_${safeName}.${ext}`;
            const fpath = path.join(outputDir, fname);
            fs.writeFileSync(fpath, buffer);
            savedFile = fname;
            console.log(
              `  ✅ บันทึก: ${fname} (${Math.round(buffer.length / 1024)} KB)`,
            );
          } else {
            console.log(`  ⚠️  HTTP ${response.status()} — ใช้ screenshot แทน`);
          }
        } catch (e) {
          console.log(
            `  ⚠️  download error: ${e.message} — ใช้ screenshot แทน`,
          );
        }

        // Fallback: crop screenshot
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

      // Final fallback
      if (!savedFile) {
        const fname = `${paddedId}_${safeName}_fullpage.png`;
        await page.screenshot({ path: path.join(outputDir, fname) });
        savedFile = fname;
        console.log(`  ✅ fullpage screenshot: ${fname}`);
      }

      // ยืนยัน
      const confirm = await waitForKey(
        `\n✅ บันทึก "${savedFile}" แล้ว  ถูกต้องไหม? [y=ใช่ / r=ลองใหม่]: `,
      );
      if (confirm === "r") {
        if (savedFile) fs.unlink(path.join(outputDir, savedFile), () => {});
        retry = true;
        continue;
      }

      progress[key] = { status: "done", file: savedFile, query: currentQuery };
      fs.writeFileSync(logPath, JSON.stringify(progress, null, 2));
      console.log(`🎉 [${ex.id}/28] ${ex.name} — บันทึกสำเร็จ!\n`);
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
  console.log(`✅ Done    : ${done}/28`);
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
