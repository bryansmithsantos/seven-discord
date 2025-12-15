export class LRUCache<K, V> extends Map<K, V> {
    private maxSize: number;

    constructor(maxSize: number) {
        super();
        this.maxSize = maxSize;
    }

    public set(key: K, value: V): this {
        if (this.size >= this.maxSize) {
            // Remove oldest (first item in Map iterator)
            const firstKey = this.keys().next().value;
            if (firstKey) this.delete(firstKey);
        }
        super.set(key, value);
        return this;
    }
}
