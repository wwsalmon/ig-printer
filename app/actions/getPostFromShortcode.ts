"use server";

import { APIResponse } from "../types";

export async function getPostFromShortcode(shortcode: string): Promise<APIResponse> {
    const thisVariables = {shortcode};
    const thisVariablesString = encodeURIComponent(JSON.stringify(thisVariables));
    const thisUrl = `https://www.instagram.com/graphql/query?variables=${thisVariablesString}&doc_id=8845758582119845&server_timestamps=true`;
    const response = await fetch(thisUrl);
    const json = await response.json();
    return json;
}