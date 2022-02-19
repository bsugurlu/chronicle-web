// flow-typed signature: 03c3d1e59cd24501483659fc74b08495
// flow-typed version: a8ca0d04f1/js-cookie_v2.x.x/flow_>=v0.104.x

declare module 'js-cookie' {
    declare type CookieOptions = {
        expires?: number | Date,
        path?: string,
        domain?: string,
        secure?: boolean,
        ...
    }
    declare type ConverterFunc = (value: string, name: string) => string;
    declare type ConverterObj = {
        read: ConverterFunc,
        write: ConverterFunc,
        ...
    };
    declare class Cookie {
        defaults: CookieOptions;
        set(name: string, value: mixed, options?: CookieOptions): void;
        get(): { [key: string]: string, ... };
        get(name: string, options?: CookieOptions): string | void;
        remove(name: string, options?: CookieOptions): void;
        getJSON(name: string): Object;
        withConverter(converter: ConverterFunc | ConverterObj): this;
        noConflict(): this;
    }

    declare module.exports: Cookie;
}
