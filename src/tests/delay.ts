export const delay = (amount = 1000) =>
    new Promise((resolve) => setTimeout(resolve, amount));
