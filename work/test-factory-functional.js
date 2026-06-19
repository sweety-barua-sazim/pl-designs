const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 }, deviceScaleFactor: 1 });
  await page.goto("file:///" + path.resolve("outputs/factory-layout-redesign.html").replace(/\\/g, "/"));
  await page.screenshot({ path: "work/factory-functional-initial.png", fullPage: true });

  const detailInitiallyVisible = await page.locator(".details").isVisible();
  await page.locator("#openAddFloor").click();
  await page.locator("#addName").fill("Floor 3");
  await page.locator("#addModal .modal-save").click();
  const createdFloor = await page.getByText("Floor 3").count();
  const selectedAfterCreate = await page.locator("#detailName").textContent();

  await page.getByText("Unit A").click();
  await page.locator("#addChildFromDetail").click();
  const addType1 = await page.locator("#addType").inputValue();
  await page.locator("#addModal .modal-close").first().click();
  await page.locator("#addModal.open").waitFor({ state: "detached", timeout: 1000 }).catch(() => {});

  await page.locator("[data-id='unit-a'] > .unit-head .node-toggle").click();
  const unitAClass = await page.locator("[data-id='unit-a']").first().getAttribute("class");
  await page.locator("[data-id='line-a1'] .line-head").click({ force: true });
  await page.locator("#addChildFromDetail").click();
  const addType2 = await page.locator("#addType").inputValue();
  await page.locator("#addName").fill("SN-03");
  await page.locator("#addModal .modal-save").click();

  await page.locator("#openBulkAdd").click();
  await page.locator("#bulkModal .modal-save").click();
  const bulkLine = await page.getByText("Line A3").count();

  await page.getByText("Floor 3", { exact: true }).click();
  await page.locator("[data-edit='name']").first().fill("Floor 3 Renamed");
  await page.locator("#saveDetails").click();
  const renamed = await page.getByText("Floor 3 Renamed").count();
  await page.locator("#toggleStatusFromDetail").click();
  const inactive = await page.locator("[data-status='INACTIVE']").count();
  await page.locator("#toggleStatusFromDetail").click();
  await page.locator("#deleteFromDetail").click();
  const deletedGone = await page.getByText("Floor 3 Renamed").count();

  await page.keyboard.press("/");
  const focused = await page.evaluate(() => document.activeElement.id);
  await page.locator("#searchInput").fill("Line A1");
  const matches = await page.locator(".is-match").count();
  await page.locator("select[aria-label='Month']").selectOption({ label: "July 2026" });
  const toast = await page.locator("#toast").textContent();

  await browser.close();
  console.log(JSON.stringify({
    detailInitiallyVisible,
    createdFloor,
    selectedAfterCreate,
    addType1,
    addType2,
    unitAClass,
    bulkLine,
    renamed,
    inactive,
    deletedGone,
    focused,
    matches,
    toast
  }));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
