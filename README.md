# 8 Hour Relay Offical Website Repo

This is an .

## Folder structures

### apps folder: apps for the 8 hour relay systems, including backend and front end

-- backend: Firebase backend functions
-- functions: Firebase functions webpack out folder
-- native: Expo mobile App (not being used)
-- web: nextjs webiste

### packages folder: shared libs for both front end and backend

## How to Deploy

This Turborepo includes the following packages/apps:

### Apps and Packages

- `native`: a [react-native](https://reactnative.dev/) app built with [expo](https://docs.expo.dev/)
- `web`: a [Next.js](https://nextjs.org/) app built with [react-native-web](https://necolas.github.io/react-native-web/)
- `ui`: a stub [react-native](https://reactnative.dev/) component library shared by both `web` and `native` applications
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Expo](https://docs.expo.dev/) for native development
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io) for code formatting
