export const uploadToS3 = async (fileUrl: string, fileName: string, type: string) => {
  try {
    const fileBlob = await fetch(fileUrl).then(res => res.blob());

    const response = await fetch('https://fake-apigateway/prod/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fileName,
        type,
        content: await fileBlob.text(),
      }),
    });

    const result = await response.json();
    console.log('上传结果:', result);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
