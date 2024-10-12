import { BTNode } from "../BTNode";

// eslint-disable-next-line @typescript-eslint/ban-types
const isESClass = (fn: Function): fn is new (...args: any[]) => any =>
    typeof fn === "function" &&
    Object.getOwnPropertyDescriptor(fn, "prototype")?.writable === false;

export function btJsx(
    tag: FunctionComponent | ClassComponent,
    props: Record<string, unknown>,
    ...children: BTNode[]
): btJsx.JSX.Element {
    const fullProps = { ...props, children };

    if (tag instanceof BTNode) {
        return tag;
    }

    if (isESClass(tag)) {
        const ClassTag = tag as new (props_: Record<string, unknown>) => btJsx.JSX.Element;
        return new ClassTag(fullProps);
    }

    return tag(fullProps);
}

type FunctionComponent = (props: Record<string, unknown>) => BTNode;

type ClassComponent = new (props: Record<string, unknown>) => BTNode;

// declare global {
export namespace btJsx.JSX {
    export interface IntrinsicElements {}

    // Declare the shape of JSX rendering result
    // This is required so the return types of components can be inferred
    export type Element = BTNode;

    // Declare the shape of JSX components
    export type ElementClass = BTNode;

    // Tell TS what happens to children
    interface ElementChildrenAttribute {
        children: BTNode;
    }
}
// }
