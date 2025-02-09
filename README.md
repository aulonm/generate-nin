# Personal site for generating norwegian and swedish national identity numbers

Mostly made this for my selv since I've been using a whole lot of norwegian/swedish national identity numbers at work and switching between two different sites for this was cumbersome. The second reason was the that first site I used for Norwegian NINs used real NINs so they could possibly be linked to a real person. This one uses nav-faker that only creates synthetic numbers.


## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

## Credits

- nav-faker: forked the nav-faker repo and made i esm-ready and upgraded all the dependencies. Published to private github package registry.
- [Tedeh.net](https://tedeh.net/tools/generator-for-swedish-personnummer/) for the swedish generator. Most of the code is the same as his, but tweaked it a little for typescript support and a little more robust. 

## License

[MIT](./LICENSE)
