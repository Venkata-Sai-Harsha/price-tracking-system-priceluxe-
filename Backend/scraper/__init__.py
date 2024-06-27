import sys
import asyncio
import argparse
from main import main

def parse_arguments():
    parser = argparse.ArgumentParser(description="Run the scraper asynchronously.")
    parser.add_argument("url", type=str, help="The URL to scrape.")
    parser.add_argument("search_text", type=str, help="The search text to use.")
    parser.add_argument("endpoint", type=str, help="The endpoint to send the scraped data.")
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_arguments()

    try:
        asyncio.run(main(args.url, args.search_text, args.endpoint))
    except Exception as e:
        print(f"Error: {e}")
