"use server";

export default async function getImgBase64FromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const text = await blob.arrayBuffer();
    return Buffer.from(text).toString("base64");
}