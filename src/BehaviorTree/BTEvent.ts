export type BTListener<T> = (data: T) => void;

export class BTEvent<T> {
    private listeners: BTListener<T>[] = [];

    subscribe(listener: BTListener<T>) {
        this.listeners.push(listener);
    }

    emit(data: T) {
        this.listeners.forEach((listener) => listener(data));
    }
}
