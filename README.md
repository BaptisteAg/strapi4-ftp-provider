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
## Usage

After installing the plugin, you need to create a plugins.js file in the config directory if it doesn't already exist. This file should contain the following information:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi4-ftp-provider",
      providerOptions: {
        host: env("FTP_HOST"),
        port: env("FTP_PORT"),
        user: env("FTP_USER"),
        password: env("FTP_PASSWORD"),
        secure: env.bool("FTP_SECURE", false),
        path: env("FTP_BASE_PATH", "/uploads"),
        baseUrl: env("FTP_BASE_URL", "https://example.com/uploads"),
      },
    },
  },
});
```

You will also need to create a .env file with the following information (replace the values with your own FTP credentials):
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
