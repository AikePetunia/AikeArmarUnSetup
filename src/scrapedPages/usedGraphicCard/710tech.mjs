import { chromium } from "playwright";

const browserOpen = await chromium.launch(
    {headless: true}
);

const page = await browserOpen.newPage();

const defaultLink710 = "https://www.710tech.com.ar/placas-de-video/";
const MAX_PAGES = 3; 
let current_page = 1;
export async function scrape710Tech() {
    let allProducts = [];

    try {
        while (current_page <= MAX_PAGES) {
            console.log(`Escaneando página ${current_page} de 710Tech de ${MAX_PAGES}`);
            await page.goto(defaultLink710 + 'usado/?page=' + current_page, {
                timeout: 30000,
                waitUntil: 'networkidle'
            });

            const products710Tech = await page.$$eval(
                "div.listado-.pull-left.prod-cat", // Selector corregido
                (divs) => divs.map((el) => {
                    const title = el
                        .querySelector('.card-title a')
                        ?.innerText;

                    // Primero intentamos obtener el precio visible
                    let price = el
                        .querySelector('.price')
                        ?.innerText;

                    // Si no hay precio visible, intentamos con otros selectores de precio
                    if (!price) {
                        price = el
                            .querySelector('.card-description')
                            ?.innerText;
                    }

                    const link = el
                        .querySelector('.card-title a')
                        ?.getAttribute('href');

                    const image = el
                        .querySelector('.view.overlay.px-20.imagen img')
                        ?.getAttribute('src');

                    if (!title) {
                        console.log("Falta título");
                        return null;
                    }
                    if (!price) {
                        console.log("Falta precio para:", title);
                        return null;
                    }
                    if (!link) {
                        console.log("Falta link para:", title);
                        return null;
                    }
                    if (!image) {
                        console.log("Falta imagen para:", title);
                        return null;
                    }

                    return { 
                        title: title.trim(), 
                        price: price.trim(), 
                        link,
                        image 
                    };
                }).filter(item => item !== null)
            );

            if (products710Tech.length === 0) {
                console.log("No se encontraron productos en la página", current_page);
                break;
            } else {
                console.log(`Se encontraron ${products710Tech.length} productos en la página ${current_page}`);
                allProducts = allProducts.concat(products710Tech);
            }

            current_page++;
            await page.waitForTimeout(1000);
        }

        console.log(`Total de productos encontrados: ${allProducts.length}`);
        return allProducts;

    } catch (error) {
        console.error("Error en 710Tech:", error);
        return allProducts;
    } finally {
        await browserOpen.close();
    }
}
