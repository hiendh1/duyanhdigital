import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MarketingContent {
  customerInsight: string;
  facebookContent: string;
  imagePrompt: string;
  tiktokScript: string;
  youtubeScript: string;
  thumbnailPrompt: string;
}

export async function generateMarketingContent(topic: string): Promise<MarketingContent> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `TOPIC / DỊCH VỤ / SẢN PHẨM: ${topic}`,
    config: {
      systemInstruction: `Bạn là chuyên gia Marketing Psychology, Social Media, Copywriting và Customer Insight với 15 năm kinh nghiệm.
Thương hiệu: DUY ANH DIGITAL. Thị trường: Việt Nam. Ngôn ngữ: Tiếng Việt tự nhiên.

QUY TRÌNH:
1. Phân tích Customer Insight: Khách hàng là ai, nỗi đau, mong muốn, rào cản, trigger hành động.
2. Viết Content Facebook: NGẮN GỌN, SÚC TÍCH, BỐ CỤC RÕ RÀNG. Đánh mạnh vào tâm lý khách hàng. BẮT BUỘC bao gồm số điện thoại liên hệ: 0943304685. Sử dụng các gạch đầu dòng, khoảng trắng để dễ đọc. Tỷ lệ: 30% nỗi đau, 30% giá trị, 30% giải pháp, 10% CTA.
3. Tạo Image Prompt: Tiếng Anh. Yêu cầu ảnh CỰC ĐẸP, CHUYÊN NGHIỆP. Nếu có chèn chữ vào ảnh, hãy sử dụng các cụm từ TIẾNG VIỆT NGẮN GỌN (tối đa 3-5 từ). Mô tả rõ ràng vị trí và kiểu chữ (ví dụ: "Bold Vietnamese text saying 'DUY ANH DIGITAL' in the center"). Tập trung vào bố cục để chữ không bị đè lên chi tiết quan trọng.
4. Viết Lời thoại TikTok: CHỈ GỒM LỜI THOẠI (SPEECH ONLY). Không có tên nhân vật, không mô tả hành động, không số thứ tự cảnh. Văn bản thuần túy để copy vào AI Voice.
5. Viết Lời thoại YouTube: CHỈ GỒM LỜI THOẠI (SPEECH ONLY). Không có tên nhân vật, không mô tả hành động, không số thứ tự cảnh. Văn bản thuần túy để copy vào AI Voice.
6. Tạo Thumbnail Prompt: Tiếng Anh. Tối ưu CTR cực cao. Yêu cầu có TEXT OVERLAY TIẾNG VIỆT NGẮN GỌN, GÂY TÒ MÒ. Mô tả chủ thể có biểu cảm mạnh, màu sắc tương phản.

YÊU CẦU QUAN TRỌNG:
- Content Facebook phải luôn có SĐT 0943304685 ở phần CTA.
- Chữ trên ảnh phải là TIẾNG VIỆT, ưu tiên các từ đơn giản, không quá nhiều dấu phức tạp để AI vẽ chính xác hơn.
- Content Facebook phải cực kỳ scannable (dễ đọc lướt), không viết thành đoạn văn dài.
- Phần TikTok và YouTube Script TUYỆT ĐỐI không được có bất kỳ ghi chú nào. Chỉ có lời nói.
- Không sử dụng HTML trong kết quả.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          customerInsight: { type: Type.STRING },
          facebookContent: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          tiktokScript: { type: Type.STRING },
          youtubeScript: { type: Type.STRING },
          thumbnailPrompt: { type: Type.STRING },
        },
        required: ["customerInsight", "facebookContent", "imagePrompt", "tiktokScript", "youtubeScript", "thumbnailPrompt"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return null;
}
