export class CircularBuffer {
    constructor(size) {
        this.buffer = new Array(size);
        this.size = size;
        this.index = 0;
        this.length = 0;
    }

    push(value) {
        this.buffer[this.index] = value;
        this.index = (this.index + 1) % this.size;
        if (this.length < this.size) this.length++;
    }

    get(i) {
        if (i < 0 || i >= this.length) throw new RangeError("Index out of bounds");
        const actualIndex = (this.index - this.length + i + this.size) % this.size;
        return this.buffer[actualIndex];
    }

    set(i, value) {
        if (i < 0 || i >= this.length) throw new RangeError("Index out of bounds");
        const actualIndex = (this.index - this.length + i + this.size) % this.size;
        this.buffer[actualIndex] = value;
    }

    toArray() {
        return Array.from({ length: this.length }, (_, i) => this.get(i));
    }
}

export function createCircularBufferProxy(size) {
    const buffer = new CircularBuffer(size);

    return new Proxy(buffer, {
        get(target, prop, receiver) {
            if (prop in target) return Reflect.get(target, prop, receiver);

            const index = Number(prop);
            if (!Number.isNaN(index)) {
                return target.get(index);
            }

            return undefined;
        },
        set(target, prop, value, receiver) {
            const index = Number(prop);
            if (!Number.isNaN(index)) {
                target.set(index, value);
                return true;
            }

            return Reflect.set(target, prop, value, receiver);
        }
    });
}
