const CHUNK_SIZE = 1024 * 1000 * 0.5; // 文件切割块大小为5MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4; // 使用四个线程进行文件切割

// 文件切割函数
export const cutFile = async (file) => {
  return new Promise((resolve) => {
    const result = []; // 存储切割后的文件块数据
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE); // 计算文件的切割块数量
    const workChunkCount = Math.ceil(chunkCount / THREAD_COUNT); // 每个线程处理的切割块数量
    let finishCount = 0; // 已经处理完成的线程数量

    for (let i = 0; i < THREAD_COUNT; i++) {
      // 创建一个新的 Web Worker 线程
      const worker = new Worker("./worker.js", {
        type: "module",
      });
      const startIndex = i * workChunkCount; // 当前线程开始处理的切割块索引
      let endIndex = startIndex + workChunkCount; // 当前线程结束处理的切割块索引

      // 如果结束索引超过了切割块总数，则将结束索引设置为切割块总数
      if (endIndex > chunkCount) {
        endIndex = chunkCount;
      }

      // 向 Worker 线程发送消息，传递需要处理的文件信息和切割块信息
      worker.postMessage({
        file,
        CHUNK_SIZE,
        startIndex,
        endIndex,
      });

      // 监听 Worker 线程的消息事件，处理返回的切割块数据
      worker.addEventListener("message", (e) => {
        for (let i = startIndex; i < endIndex; i++) {
          result[i] = e.data[i - startIndex];
        }
        worker.terminate(); // 终止 Worker 线程
        finishCount++; // 完成处理的线程数量加一
        if (finishCount === THREAD_COUNT) {
          resolve(result); // 当所有线程都完成处理时，返回切割后的文件块数据
        }
      });
    }
  });
};
