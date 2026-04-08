export async function retryUntilTrue(
    callback: () => Promise<boolean> | boolean,
    interval: number = 50
): Promise<boolean> {
    while (true) {
        const result = await callback();
        if (result) return result;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}
