import "./spark-md5.js";

// 创建文件切割块函数
export const createChunk = (file, index, chunkSize) => {
  return new Promise((resolve) => {
    const start = index * chunkSize; // 计算切割块的起始位置
    const end = start + chunkSize; // 计算切割块的结束位置
    const spark = new SparkMD5.ArrayBuffer(); // 创建 SparkMD5 实例，用于计算文件块的哈希值
    const fileReader = new FileReader(); // 创建 FileReader 实例，用于读取文件块的内容
    fileReader.readAsArrayBuffer(file.slice(start, end)); // 读取指定位置的文件块内容
    fileReader.addEventListener("load", (e) => {
      spark.append(e.target.result); // 将文件块内容添加到 SparkMD5 实例中
      resolve({
        start,
        end,
        index,
        hash: spark.end(), // 获取文件块的哈希值
      });
    });
  });
};
