import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob"

function blobServiceClient() {
  const accountName = process.env.VIDEOS_ACCOUNT_NAME
  const accountKey = process.env.VIDEOS_ACCOUNT_KEY
  if (!accountName || !accountKey) {
    throw new Error("VIDEOS_ACCOUNT_NAME / VIDEOS_ACCOUNT_KEY are not configured")
  }
  const credential = new StorageSharedKeyCredential(accountName, accountKey)
  return new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential)
}

export function videosContainerClient() {
  const containerName = process.env.VIDEOS_CONTAINER ?? "videos"
  return blobServiceClient().getContainerClient(containerName)
}
