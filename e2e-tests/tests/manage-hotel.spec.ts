import {test, expect} from '@playwright/test';
import path from 'path';

const UI_URL = "http://localhost:5173/"

test.beforeEach(async({page})=>{
  await page.goto(UI_URL);
  await page.getByRole("link", {name: "Sign In"}).click();

  await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com")
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", {name:"Login"}).click();

  await expect(page.getByText("Sign in successfull!")).toBeVisible();
});

test("Should allow user to add a hotel", async({page})=>{
  await page.goto(`${UI_URL}add-hotel`)

  await page.locator('[name=name]').fill('Test Hotel');
  await page.locator('[name=city]').fill('Test City');
  await page.locator('[name=country]').fill('Test Country');
  await page.locator('[name=description]').fill('This is description for the test hotel');
  await page.locator('[name=pricePerNight]').fill('100');
  await page.selectOption('select[name="starRating"]', "5");
  await page.getByText("Luxury").click();
  await page.getByLabel("Free WiFi").check();
  await page.getByLabel("Parking").check();
  await page.locator('[name="adultCount"]').fill('4');
  await page.locator('[name="childCount"]').fill('4');

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "hotels-1.jpg"),
    path.join(__dirname, "files", "hotels-2.jpg"),
  ]);

  await page.getByRole('button', {name:"Save"}).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotel", async({page}) =>{
  await page.goto(`${UI_URL}my-hotels`);
  
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(page.getByText("Lorem ipsum dolor sit amet, consectetur")).toBeVisible();
  await expect(page.getByText('Dublin, Ireland')).toBeVisible();
  await expect(page.getByText('All Inclusive')).toBeVisible();
  await expect(page.getByText('$119')).toBeVisible();
  await expect(page.getByText('2 adults, 3 children')).toBeVisible();
  await expect(page.getByText('2 Star Rating')).toBeVisible();

  await expect(page.getByRole("link", {name:"View Details"}).first()).toBeVisible();
  await expect(page.getByRole("link", {name:"Add Hotels"})).toBeVisible();
});

test("should edit hotel", async({page}) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", {name: "View Details"}).first().click();

  await page.waitForSelector('[name="name"]', {state: 'attached'});
  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");
  await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
  await page.getByRole("button", {name: "Save"}).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways UPDATED");
  await page.locator('[name="name"]').fill("Dublin Getaways");
  await page.getByRole("button", {name: "Save"}).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});