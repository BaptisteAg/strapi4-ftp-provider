const Readable = require('stream').Readable;
const ftpClient = require("basic-ftp");

module.exports = {
    init(config) {
        const getConnection = async () => {
            const client = new ftpClient.Client();
            await client.access({
                host: config.host,
                user: config.user,
                port:config.port,
                password: config.password,
                secure: config.secure,
            });
            return client;
        };

        const uploadStream = async (file) => {
            const path = `${config.path}/${file.hash}${file.ext}`;
            const client = await getConnection();

            try {
                const source = new Readable();
                source._read = () => {}; // _read is required but you can noop it
                source.push(file.buffer);
                source.push(null);
                await client.uploadFrom(source, path);

            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        };

        const deleteFile = async (file) => {
            const path = `${config.path}/${file.hash}${file.ext}`;
            const client = await getConnection();

            try {
                await client.remove(path);
            } catch (error) {
                throw error;
            } finally {
                await client.close();
            }
        };

        return {
            async upload(file) {
                await uploadStream(file);
                file.url = `/uploads/${file.hash}${file.ext}`;
            },


            delete(file) {
                return new Promise((resolve, reject) => {
                    deleteFile(file)
                        .then(() => {
                               resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            },
        };
    },
};
