export const checkEnv = (variable: string): string => {
  const envVariable = process.env[variable]
  if (!envVariable) {
    throw new Error(`Couldn't find environment variable: ${variable}`)
  }
  return envVariable
}
