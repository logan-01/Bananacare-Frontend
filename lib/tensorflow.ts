import * as tf from "@tensorflow/tfjs";
import { BananaDiseaseType, bananaDiseases } from "@/lib/constant";

//* Register the L2 Regularizer
class L2 {
  static className = "L2";
  constructor(config: any) {
    return tf.regularizers.l1l2(config);
  }
}
tf.serialization.registerClass(L2 as any);

// Load TensorFlow Model
export const loadModel = async (modelPath: string): Promise<tf.LayersModel> => {
  return await tf.loadLayersModel(modelPath);
};

// Preprocess Image for TensorFlow
export const preprocessImage = async (file: File): Promise<tf.Tensor> => {
  const image = await loadImage(file);
  return tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(tf.scalar(255))
    .expandDims();
};

// Load Image as HTMLImageElement
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
};

// Make Predictions
export const makePrediction = async (
  model: tf.LayersModel,
  tensor: tf.Tensor,
): Promise<BananaDiseaseType[]> => {
  const prediction = model.predict(tensor) as tf.Tensor;
  const predictionArray = Array.from(await prediction.data());

  return (
    bananaDiseases
      .map((disease, index) => ({
        ...disease,
        percentage: parseFloat((predictionArray[index] * 100).toFixed(2)),
      }))
      // .filter((disease) => disease.id !== "healthy") // Exclude unwanted
      .sort((a, b) => b.percentage - a.percentage)
  ); // Sort descending
};

// [0.85, 0.10, 0.03, 0.02,0.32, 0.10, 0.21, 0.22] - predictionArray

// ["black-sigatoka", "bmv", "cordana" , "healthy","moko","panama","not-banana", "weevil" ]
