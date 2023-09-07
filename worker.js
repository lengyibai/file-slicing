import { createChunk } from "./createChunk.js";

// 监听消息事件
onmessage = async (e) => {
  const proms = []; // 存储每个切割块的 Promise 对象
  const { file, CHUNK_SIZE, startIndex, endIndex } = e.data; // 获取传递过来的文件信息和切割块信息

  // 循环创建切割块的 Promise 对象
  for (let i = startIndex; i < endIndex; i++) {
    proms.push(createChunk(file, i, CHUNK_SIZE));
  }

  // 等待所有切割块的 Promise 对象都完成
  const chunks = await Promise.all(proms);

  // 将切割块数据发送回主线程
  postMessage(chunks);
};
