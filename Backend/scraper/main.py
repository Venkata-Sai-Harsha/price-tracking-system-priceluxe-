# src/scraper.py

import asyncio
import json
import os
from playwright.async_api import async_playwright
from amazon import get_product as get_amazon_product  # Assuming this is a custom module
from requests import post

AMAZON = "https://amazon.in"

URLS = {
    AMAZON: {
        "search_field_query": 'input[name="field-keywords"]',
        "search_button_query": 'input[value="Go"]',
        "product_selector": "div.s-card-container"
    }
}

available_urls = URLS.keys()

def load_auth():
    FILE = os.path.join(os.path.dirname(__file__), "auth.json")
    if not os.path.exists(FILE):
        raise FileNotFoundError(f"No such file or directory: '{FILE}'")
    
    with open(FILE, "r") as f:
        return json.load(f)

try:
    cred = load_auth()
    auth = f'{cred["username"]}:{cred["password"]}'
    browser_url = f'wss://{auth}@{cred["host"]}'
except FileNotFoundError as e:
    print(e)
    exit(1)
except KeyError as e:
    print(f"Missing required key in auth.json: {e}")
    exit(1)

async def search(metadata, page, search_text):
    print(f"Searching for {search_text} on {page.url}")
    search_field_query = metadata.get("search_field_query")
    search_button_query = metadata.get("search_button_query")

    if search_field_query and search_button_query:
        print("Filling input field")
        search_box = await page.wait_for_selector(search_field_query, timeout=60000)
        await search_box.type(search_text)
        print("Pressing search button")
        button = await page.wait_for_selector(search_button_query, timeout=109000)
        await button.click()
    else:
        raise Exception("Could not search.")

    await page.wait_for_load_state()
    return page

async def get_products(page, search_text, selector, get_product):
    print("Retrieving products.")
    product_divs = await page.query_selector_all(selector)
    valid_products = []
    words = search_text.split(" ")

    async def task(p_div):
        product = await get_product(p_div)

        if not product["price"] or not product["url"]:
            return

        for word in words:
            if not product["name"] or word.lower() not in product["name"].lower():
                break
        else:
            valid_products.append(product)

    tasks = [task(div) for div in product_divs]
    await asyncio.gather(*tasks)

    return valid_products

def save_results(results):
    data = {"results": results}
    FILE = os.path.join(os.path.dirname(__file__), "results.json")
    print(f"Saving results to {FILE}")
    with open(FILE, "w") as f:
        json.dump(data, f)
    print("Results saved successfully")

def post_results(results, endpoint, search_text, source):
    headers = {
        "Content-Type": "application/json"
    }
    data = {"data": results, "search_text": search_text, "source": source}

    print("Sending request to", endpoint)
    response = post("http://localhost:5000" + endpoint, headers=headers, json=data)
    print("Status code:", response.status_code)

async def main(url, search_text, response_route):
    metadata = URLS.get(url)
    if not metadata:
        print("Invalid URL.")
        return

    async with async_playwright() as pw:
        print('Connecting to browser.')
        try:
            browser = await pw.chromium.connect_over_cdp(browser_url, timeout=60000)  # Increased timeout to 60 seconds
            page = await browser.new_page()
            print("Connected.")
            await page.goto(url, timeout=120000)
            print("Loaded initial page.")
            search_page = await search(metadata, page, search_text)

            def func(x): return None
            if url == AMAZON:
                func = get_amazon_product
            else:
                raise Exception('Invalid URL')

            results = await get_products(search_page, search_text, metadata["product_selector"], func)
            print(f"Retrieved {len(results)} products")
            print("Saving results.")
            save_results(results)  # Save results to JSON file
            post_results(results, response_route, search_text, url)  # Post results to API endpoint

            await browser.close()
        except Exception as e:
            print(f"An error occurred: {e}")
            # Take a screenshot for debugging
            await page.screenshot(path="error_screenshot.png")
            # Print page content for debugging
            content = await page.content()
            with open("error_page.html", "w") as f:
                f.write(content)

if __name__ == "__main__":
    # test script
    asyncio.run(main(AMAZON, "apple", "/api/results"))
