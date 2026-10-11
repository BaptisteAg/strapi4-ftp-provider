# Strapi 4 FTP Provider

An upload provider that connects the **Strapi 4 Media Library** to an FTP server.
It implements upload, streamed upload and deletion using `basic-ftp`, and builds
the public media URL from a configured base URL.

## Project status and compatibility

This is a Strapi 4 project. The original documentation records testing with
**Strapi 4.8.2 and Node.js 18.14.1**. That is a historical test statement, not a
new validation on current releases. Strapi 5 compatibility is not established.

The current `npm test` script is a placeholder that exits with an error; the
repository does not contain an automated test suite. The implementation remains
unchanged in this documentation update.

## Installation

This plugin can be installed with the following command:

```bash
yarn add strapi4-ftp-provider
```
or
```bash
npm i strapi4-ftp-provider
```
## Configuration

### Provider Configuration

`./config/plugins.js` or `./config/plugins.ts` for TypeScript projects:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi4-ftp-provider",
      providerOptions: {
        host: env("FTP_HOST"),
        port: env("FTP_PORT",21),
        user: env("FTP_USER"),
        password: env("FTP_PASSWORD"),
        secure: env.bool("FTP_SECURE", false),
        path: env("FTP_BASE_PATH"),
        baseUrl: env("FTP_BASE_URL"),
      },
    },
  },
});
```

### Security Middleware Configuration

To display media served from your configured domain, review the Strapi 4
`contentSecurityPolicy` settings. The example below replaces the `strapi::security`
entry as described in the [Strapi 4 middleware configuration](https://docs-v4.strapi.io/dev-docs/configurations/middlewares#loading-order).

`./config/middlewares.js`

```js
module.exports = ({ env }) => [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            env('FTP_BASE_URL'),
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            env('FTP_BASE_URL'),
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```

### Environment variables

You will also need to create a .env file with the following information (replace the values with your own configuration):
```makefile
FTP_HOST=ftp.example.com
FTP_PORT=21
FTP_USER=username
FTP_PASSWORD=password
FTP_SECURE=false
FTP_BASE_URL=https://media.example.com/uploads/
FTP_BASE_PATH=/path/on/ftp/server/uploads/
```
Use local credentials in your application's `.env`; the values above are examples.
`FTP_BASE_PATH` is the destination directory on the FTP server. `FTP_BASE_URL`
is the corresponding HTTP(S) URL used by browsers to retrieve those files.
This provider uploads files but does not serve them over HTTP itself.

**Both paths must end with `/`.** The code concatenates each configured prefix
directly with the generated filename. It does not normalize or create the remote
directory. Configure an existing directory and verify that its HTTP(S) mapping
is correct.

`secure` is passed to `basic-ftp` for FTP/FTPS configuration. This provider does
not implement SFTP.


## Maximum file size

Please note that you may need to adjust the maximum file size that can be uploaded.
See the [Strapi 4 upload configuration](https://docs-v4.strapi.io/dev-docs/plugins/upload#max-file-size).

A reverse proxy can also impose a request-body limit. For NGINX, see the official
[`client_max_body_size` directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

## Implementation limits

The streamed upload entry point buffers the incoming stream before transfer;
it is not a constant-memory streaming implementation. Set upload limits that
fit your environment and account for thumbnail uploads.

The provider does not create remote directories, retry transfers or generate
private signed media URLs. Upload and deletion errors are propagated to the
caller. See [`index.js`](index.js) for the exact behavior.

## License
This plugin is released under the [MIT](https://choosealicense.com/licenses/mit/) License.
