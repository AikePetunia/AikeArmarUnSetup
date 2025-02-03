import { scrapeCompraGamer } from "./usualPages/compraGamer.mjs";
import { scrapeHardGamers } from "./usualPages/hardGamers.mjs";
import { scrape710Tech } from "./usedGraphicCard/710tech.mjs";

import fs from 'fs/promises';
import { exit } from "process";


async function main() {
    try {
        const hardGamersProducts = await scrapeHardGamers();
        const compraGamerProducts = await scrapeCompraGamer();
        const Tech710Products = await scrape710Tech();

        const allResults = {
            hardGamers: hardGamersProducts,
            compraGamer: compraGamerProducts,
            Tech710: Tech710Products,
        };

        await fs.writeFile(
            'products.json', 
            JSON.stringify(allResults, null, 2)
        );

        console.log("listoo")
        exit(0);
    } catch (error) {
        console.error('error durante el scraping:', error);
    }
}

main();



// add, escritorios. Placas de video (tambien usadas), , paginas que no figuren en hardgamers. 
// tambien estaria bueno amazon o cosas de mercado libre, pero es medio ya un monton.