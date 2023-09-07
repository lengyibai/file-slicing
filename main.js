import { cutFile } from "./cutFile.js";

const input_file = document.querySelector("input");

// 监听文件选择框的 change 事件
input_file.addEventListener("change", async (e) => {
  const file = e.target.files[0]; // 获取选择的文件
  const chunks = await cutFile(file); // 调用 cutFile 函数进行文件切割，并等待切割完成
  console.log(chunks); // 打印切割后的文件块数据

  // 将切割好的文件块上传到服务端
  chunks.forEach(async (chunk, index) => {
    const formData = new FormData();
    formData.append("file", chunk, `chunk_${index + 1}.dat`);

    // // 发起上传请求
    // try {
    //   const response = await fetch("http://example.com/upload", {
    //     method: "POST",
    //     body: formData,
    //   });

    //   if (response.ok) {
    //     console.log(`Chunk ${index + 1} uploaded successfully.`);
    //   } else {
    //     console.error(`Failed to upload chunk ${index + 1}.`);
    //   }
    // } catch (error) {
    //   console.error(`Error uploading chunk ${index + 1}:`, error);
    // }
  });
});
