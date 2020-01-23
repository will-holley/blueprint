# blueprint

Inspire yourself

## Development

### Installation

1. Install NPM Packages

`npm install`

2. Create a `.env` file from `sample.env`

3. Create the `dist` directory

`mkdir dist`

4. Create a build

`npm run build`

5. Create PostgreSQL users

```bash
psql
CREATE USER super;
ALTER USER super WITH SUPERUSER;
```
