const azureStorage = require("azure-storage");
exports.uploadImage = async (fileName, fileType, base64, path) => {
  return new Promise((resolve, reject) => {
    const blobName = `${path}${fileName}.${fileType}`;
    const type = fileType;
    const containerName = "devvetting";
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobService = azureStorage.createBlobService(connectionString);
    const stream = base64;
    const matches = stream.split(",");
    const buffer = Buffer.from(matches[1], "base64");
    blobService.createBlockBlobFromText(
      containerName,
      blobName,
      buffer,
      { contentSettings: { contentType: type } },
      (err, result, response) => {
        if (err) {
          reject(null, err.message);
        } else {
          resolve({ result: result, message: "File uploaded" });
        }
      }
    );
  });
};

exports.getImageUrl = async (blobName) => {
  return new Promise((resolve, reject) => {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobService = azureStorage.createBlobService(connectionString);
    const containerName = "devvetting";
    try {
      const startDate = new Date();
      const expiryDate = new Date(startDate);
      expiryDate.setMinutes(startDate.getMinutes() + 10000);
      startDate.setMinutes(startDate.getMinutes() - 1000);

      const sharedAccessPolicy = {
        AccessPolicy: {
          Permissions: azureStorage.BlobUtilities.SharedAccessPermissions.READ,
          Start: startDate,
          Expiry: expiryDate,
        },
      };

      const token = blobService.generateSharedAccessSignature(
        containerName,
        blobName,
        sharedAccessPolicy
      );
      const sasUrl = blobService.getUrl(containerName, blobName, token);
      resolve(sasUrl, null);
    } catch (err) {
      reject(null, err);
    }
  });
};
