# Strapi 4 FTP Provider

Strapi 4 FTP Provider is a plugin that allows you to upload files to an FTP server.

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

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

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
FTP_BASE_URL=/uploads/
FTP_BASE_PATH=/path/to/strapi/installation/uploads
```
Note that `FTP_BASE_URL` is the URL where your files will be publicly accessible, and `FTP_BASE_PATH` is the absolute path to the directory where your files will be uploaded on the server. Replace `/path/to/strapi/installation` with the actual path to your Strapi installation.


## Maximum file size

Please note that you may need to adjust the maximum file size that can be uploaded. This can be done in the Strapi documentation: [plugins/upload#max-file-size
](https://docs.strapi.io/dev-docs/plugins/upload#max-file-size)

It is also possible that the file size limit is determined by the configuration of your Nginx server: [Increase-upload-limit-nginx](https://docs.bitnami.com/aws/infrastructure/ruby/administration/increase-upload-limit-nginx/)

## Testing
This plugin has been tested with Strapi v4.8.2 and Node.js v18.14.1.

## License
This plugin is released under the [MIT](https://choosealicense.com/licenses/mit/) License.
