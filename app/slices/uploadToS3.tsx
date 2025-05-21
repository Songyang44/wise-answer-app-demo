export const uploadToS3 = async (fileUrl: string, fileName: string, type: string) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(",")[1]; 

      const uploadResponse = await fetch("https://fake-apigateway/prod/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          type,
          content: base64data,
        }),
      });

      const result = await uploadResponse.json();
      console.log("Upload Result:", result);
    };

    reader.onerror = (error) => {
      console.error("FileReader Error:", error);
    };

    reader.readAsDataURL(blob); 
  } catch (error) {
    console.error("Upload Failure:", error);
  }
};
