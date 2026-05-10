export class ProductsPage{
    //selectors
    pageTitle='.title';
    inventoryList ='.inventory_list';
    inventoryItem='.inventory_item';
    itemName ='.inventory_item_name';
    itemPrice ='.inventory_item_price';
    sortDropdown= '[data-test="product-sort-container"]';
    cartBadge ='.shopping_cart_badge';
    cartLink ='.shopping_cart_link';






    //ACTIONS

    assertOnProductsPage(){
        cy.url().should('include', '/inventory.html');
        cy.get(this.pageTitle).should('have.text', 'Products');
    }

    getProducts() {
        return cy.get(this.inventoryItem);
    }

    getProductCount() {
        return cy.get(this.inventoryItem).its('length');
    }

    addToCart(productDataTestId: string) {
        cy.get(`[data-test="add-to-cart-${productDataTestId}"]`).click();
    }

    removeFromCart(productDataTestId: string) {
        cy.get(`[data-test="remove-${productDataTestId}"]`).click();
    }

    sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
        cy.get(this.sortDropdown).select(value);
    }

    getCartBadgeCount() {
        return cy.get(this.cartBadge);
    }

    goToCart() {
        cy.get(this.cartLink).click();
    }

    //ASSERTIONS
    assertCartBadge(count: string) {
        cy.get(this.cartBadge).should('have.text', count);
    }

    assertCartEmpty() {
        cy.get(this.cartBadge).should('not.exist');
    }

    assertPricesSortedAscending() {
        const prices: number[] = [];
        cy.get(this.itemPrice).each(($el) => {
        prices.push(parseFloat($el.text().replace('$', '')));
        }).then(()=> {
        for (let i=0; i<prices.length - 1; i++) {
            expect(prices[1]).to.be.at.most(prices[i + 1]);
        }});
    }
}