"use client";

import ProxiedImage from "@/lib/ProxiedImage";
import { useState } from "react";
import { getPostFromShortcode } from "./actions/getPostFromShortcode";
import { APIPostData } from "./types";
import classNames from "classnames";
import {FaComments, FaHeart} from "react-icons/fa";

export default function Page() {
    const [shortcode, setShortcode] = useState("");
    const [postData, setPostData] = useState<APIPostData | null>(null);

    async function onSubmit() {
        try {
            const json = await getPostFromShortcode(shortcode);
            console.log(json);
            setPostData(json.data.xdt_shortcode_media);
        } catch (e) {
            console.log(e);
        }
    }

    let slides2 = null;
    let slides3 = null;
    let bigUrl = null;
    let numCols = 2;

    const numPosts = postData?.edge_sidecar_to_children?.edges.length;

    if (postData?.edge_sidecar_to_children && numPosts) {
        if (numPosts <= 3 || (numPosts >= 5 && numPosts <= 12)) {
            bigUrl = postData.edge_sidecar_to_children.edges[0].node.display_url;
        }

        const slides2Start = bigUrl ? 1 : 0; // starting index, inclusive

        let slides2Length = 2;
        if (numPosts === 4) slides2Length = 4;
        if (numPosts >= 13) slides2Length = 6;

        slides2 = postData?.edge_sidecar_to_children.edges.filter((d, i) => (i >= slides2Start) && (i < slides2Start + slides2Length));

        if (numPosts >= 8) numCols = 3;

        slides3 = postData?.edge_sidecar_to_children.edges.filter((d, i) => i >= slides2Start + slides2Length);
    } else {
        bigUrl = postData?.display_url;
    }
    
    return (
        <>
            <div className="max-w-2xl mx-auto px-4 py-8 print:hidden">
                <h1 className="font-bold text-2xl mb-4">IG Printer</h1>
                <div className="prose mt-4 mb-8 max-w-full">
                    <p>This is a utility to turn a single Instagram post into a printable page or spread of two 8.5 x 11 pages for archival purposes.</p>
                    <p><b>How to use:</b></p>
                    <ol>
                        <li>Enter the post shortcode (for example: <b>DDfGct6ybBc</b> in the url "https://www.instagram.com/p/<b>DDfGct6ybBc</b>/") in the field below and hit "Submit"</li>
                        <li>Wait for the page to fully load</li>
                        <li>Use your browser to Print the page. Save as a PDF if desired.</li>
                    </ol>
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" value={shortcode} onChange={e => setShortcode(e.target.value)} className="border p-2 w-full rounded" placeholder="Post shortcode" />
                    <button className="p-2 bg-gray-900 text-white disabled:opacity-50 rounded" onClick={onSubmit} disabled={!shortcode}>Submit</button>
                </div>
            </div>
            {postData && (
                <>
                    <div style={{ width: "8.5in", height: "11in", paddingLeft: "0.25in", paddingTop: "0.25in", paddingBottom: "0.25in" }}>
                        <div className="border-l border-t border-b border-neutral-300 flex w-full h-full">
                            <div className="w-1/3 shrink-0" style={{ padding: "0.2in" }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <ProxiedImage className="w-6 h-6 rounded-full" url={postData.owner.profile_pic_url}/>
                                    <div><span className="text-[10pt] font-bold">{postData.owner.username}</span></div>
                                </div>
                                {!!postData.coauthor_producers.length && (
                                    <>
                                        <div><span className="uppercase text-semibold text-neutral-500 text-[6pt] tracking-[0.5pt]">Coposted with</span></div>
                                        {postData.coauthor_producers.map(coauthor => (
                                            <div className="items-center flex gap-2 mb-1" key={coauthor.id}>
                                                <ProxiedImage url={coauthor.profile_pic_url} className="w-[0.15in] h-[0.15in] rounded-full"></ProxiedImage>
                                                <span className="text-[8pt] leading-normal font-medium">{coauthor.username}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                <div className="my-4 flex items-center gap-2 text-neutral-500 text-[8pt]">
                                    <span>{(new Date(postData.taken_at_timestamp * 1000)).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}</span>
                                    <div className="flex items-center gap-1 ml-auto">
                                        <FaHeart/>
                                        <span>{postData.edge_media_preview_like.count.toLocaleString("en-US")}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaComments/>
                                        <span>{postData.edge_media_preview_comment.count.toLocaleString("en-US")}</span>
                                    </div>
                                </div>
                                {postData.edge_media_to_caption.edges.length && (
                                    <div className="text-[8.5pt] pt-4 mt-4 border-t border-t-neutral-300">
                                        {postData.edge_media_to_caption.edges[0].node.text.split("\n").map((paragraph, i) => (
                                            <p key={i} className="mb-[8.5pt]">{paragraph}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grow">
                                {bigUrl && (
                                    <ProxiedImage url={bigUrl} className="w-full"/>
                                )}
                                {slides2?.length && (
                                    <div className="flex gap-[0.2in] mt-[0.2in] pr-[0.2in]">
                                        {slides2.map((slide) => (
                                            <ProxiedImage url={slide.node.display_url} className="w-1/2" key={slide.node.id}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>  
                    {slides3?.length && (
                        <div style={{ width: "8.5in", height: "11in", paddingRight: "0.25in", paddingTop: "0.25in", paddingBottom: "0.25in" }}>
                            <div className="w-full h-full border-t border-r border-b border-neutral-300">
                                <div className={classNames("grid gap-[0.2in]", numCols === 2 && "grid-cols-2", numCols === 3 && "grid-cols-3")} style={{padding: "0.2in"}}>    
                                    {slides3.map((slide, i) => (
                                        <ProxiedImage url={slide.node.display_url} key={slide.node.id}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}