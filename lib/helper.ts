//* Interfaces and Types
interface ScanPayload {
  percentage: number;
  resultArr: any[];
  result: string | number;
  imgUrl: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
}

//* API Endpoints
// const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API;
const apiBaseUrl = "/api";
const osmBaseUrl = "https://nominatim.openstreetmap.org/reverse";
const hfBaseUrl =
  "https://api-inference.huggingface.co/models/google/vit-base-patch16-224";

//* Helper Functions
export async function getReverseGeocode(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `${osmBaseUrl}?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "Bananacare/1.0", // Recommended by Nominatim
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // contains address info, display_name, etc.
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}

// Cloudinary API - Image Upload + Image Public Url
export async function getImageUrl(formData: FormData) {
  try {
    const res = await fetch(`${apiBaseUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Image upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.publicUrl as string;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

export async function sendScanResult(payload: ScanPayload) {
  try {
    const response = await fetch(`${apiBaseUrl}/scan"`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to save scan data: ${response.statusText}`);
    }

    return await response.json(); // optional: return server response
  } catch (error) {
    console.error("Save scan error:", error);
    return null;
  }
}

export async function getIsBanana(file: File) {
  try {
    if (!file) throw new Error("No file provided");

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Call Hugging Face API
    const response = await fetch(`${hfBaseUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `data:image/jpeg;base64,${base64Image}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Check if banana is detected
    const isBanana = result.some(
      (p: { label: string; score: number }) =>
        p.label.toLowerCase() === "banana",
    );

    return { isBanana, predictions: result };
  } catch (error) {
    console.error("Error checking banana:", error);
    return { isBanana: false, predictions: [] };
  }
}
