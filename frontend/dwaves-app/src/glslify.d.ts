declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "glslify" {
  function glslify(source: string, options?: object): string;
  export = glslify;
}
