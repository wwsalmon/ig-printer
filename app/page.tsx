"use client";

import ProxiedImage from "@/lib/ProxiedImage";
import { useEffect, useRef, useState } from "react";
import { getPostFromShortcode } from "./actions/getPostFromShortcode";
import { APIPostData, APIPostDataSlide } from "./types";
import classNames from "classnames";
import {FaComments, FaHeart, FaPlayCircle, FaVideo} from "react-icons/fa";

export default function Page() {
    const [shortcode, setShortcode] = useState("");
    const [postData, setPostData] = useState<APIPostData | null>(null);
    const [showBig, setShowBig] = useState(true);
    const [numSmallOnPage1, setNumSmallOnPage1] = useState(2);
    const [numColsOnPage1, setNumColsOnPage1] = useState(2);
    const [numColsOnPage2, setNumColsOnPage2] = useState(2);

    async function onSubmit() {
        if (!shortcode) return;
        try {
            // get postData using server function
            const json = await getPostFromShortcode(shortcode);
            const thisPostData = json.data.xdt_shortcode_media;
            console.log(thisPostData);
            if (!thisPostData) throw new Error("No post data in response");
            
            // set defaults for numSmallOnPage1 and numColsOnPage2
            onResetDisplayOptions(thisPostData);
            setPostData(thisPostData);
        } catch (e) {
            console.log(e);
        }
    }

    function onResetDisplayOptions(thisPostData: APIPostData | null) {
        if (!thisPostData) return;
        const numPosts = thisPostData.edge_sidecar_to_children?.edges.length;
        if (thisPostData.edge_sidecar_to_children && numPosts) {
            // if children, set defaults of num small and num cols
            if (numPosts <= 3 || (numPosts >= 5 && numPosts <= 12)) setShowBig(true);

            let thisNumSmallOnPage1 = 2;
            if (numPosts === 4) thisNumSmallOnPage1 = 4;
            if (numPosts >= 13) thisNumSmallOnPage1 = 6;
            setNumSmallOnPage1(thisNumSmallOnPage1);

            let thisNumColsOnPage2 = 2;
            if (numPosts >= 8) thisNumColsOnPage2 = 3;
            setNumColsOnPage2(thisNumColsOnPage2);
        } else {
            // otherwise just show big
            setShowBig(true);
        }
    }

    let slides2 = null;
    let slides3 = null;
    let bigSlide = null;

    const numPosts = postData?.edge_sidecar_to_children?.edges.length;

    if (postData?.edge_sidecar_to_children && numPosts) {
        if (showBig) bigSlide = postData.edge_sidecar_to_children.edges[0].node;
        const slides2Start = showBig ? 1 : 0; // starting index, inclusive
        slides2 = postData?.edge_sidecar_to_children.edges.filter((d, i) => (i >= slides2Start) && (i < slides2Start + numSmallOnPage1));
        slides3 = postData?.edge_sidecar_to_children.edges.filter((d, i) => i >= slides2Start + numSmallOnPage1);
    } else {
        bigSlide = postData;
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
                    <button className="p-2 bg-gray-900 text-white disabled:opacity-50 rounded hover:bg-gray-700" onClick={onSubmit}>Submit</button>
                </div>
                <p className="mt-8 mb-4"><b>Display options</b></p>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="showBigCheck" disabled={!postData} checked={showBig} onChange={e => setShowBig(e.target.checked)}/>
                    <label htmlFor="showBigCheck">Show big image on page 1</label>
                </div>
                <label className="block uppercase font-medium mb-2 mt-4 text-xs text-neutral-500">Number of small slides on page 1</label>
                <input type="number" value={numSmallOnPage1} className="border rounded p-2 disabled:opacity-50" onChange={e => setNumSmallOnPage1(+e.target.value)} placeholder="Number small on page 1" disabled={!postData} step={1} min={0} max={(numPosts === undefined) ? 0 : (numPosts - (+showBig))}/>
                <label className="block uppercase font-medium mb-2 mt-4 text-xs text-neutral-500">Number of columns on page 1</label>
                <input type="number" value={numColsOnPage1} className="border rounded p-2 disabled:opacity-50" onChange={e => setNumColsOnPage1(+e.target.value)} placeholder="Number columns on page 1" disabled={!postData} step={1} min={2} max={3}/>
                <label className="block uppercase font-medium mb-2 mt-4 text-xs text-neutral-500">Number of columns on page 2</label>
                <input type="number" value={numColsOnPage2} className="border rounded p-2 disabled:opacity-50" onChange={e => setNumColsOnPage2(+e.target.value)} placeholder="Number columns on page 2" disabled={!postData} step={1} min={2} max={3}/>
                <div className="mt-4">
                    <button className="p-2 bg-gray-900 text-white rounded disabled:opacity-50 hover:bg-gray-700" onClick={() => onResetDisplayOptions(postData)} disabled={!postData}>Reset to defaults</button>
                </div>
            </div>
            {postData && (
                <>
                    <div style={{ width: "8.5in", height: "11in", paddingLeft: "0.25in", paddingTop: "0.25in", paddingBottom: "0.25in", paddingRight: slides3?.length ? 0 : "0.25in" }}>
                        <div className={classNames("border-l border-t border-b border-neutral-300 flex w-full h-full", !slides3?.length && "border-r")}>
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
                                    <div className="text-[7pt] pt-4 mt-4 border-t border-t-neutral-300">
                                        {postData.edge_media_to_caption.edges[0].node.text.split("\n").map((paragraph, i) => (
                                            <p key={i} className="mb-[7pt]">{paragraph}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grow">
                                {(showBig && bigSlide) && (
                                    <Slide slide={bigSlide}/>
                                )}
                                {!!slides2?.length && (
                                    <div className={classNames("pr-[0.2in] mt-[0.15in] gap-[0.15in] grid", numColsOnPage1 === 2 && "grid-cols-2", numColsOnPage1 === 3 && "grid-cols-3")}>
                                        {slides2.map((slide) => (
                                            <Slide slide={slide.node} key={slide.node.id}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>  
                    {!!slides3?.length && (
                        <div style={{ width: "8.5in", height: "11in", paddingRight: "0.25in", paddingTop: "0.25in", paddingBottom: "0.25in" }}>
                            <div className="w-full h-full border-t border-r border-b border-neutral-300">
                                <div className={classNames("grid gap-[0.15in]", numColsOnPage2 === 2 && "grid-cols-2", numColsOnPage2 === 3 && "grid-cols-3")} style={{padding: "0.2in"}}>    
                                    {slides3.map((slide) => (
                                        <Slide slide={slide.node} key={slide.node.id}/>
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

function Slide({slide}: {slide: APIPostDataSlide}) {
    return slide.is_video ? (
        <div className="relative">
            <ProxiedImage url={slide.display_url}/>
            <div className="absolute top-2 right-2 text-white text-xs">
                <FaVideo/>
            </div>
        </div>
    ) : (
        <ProxiedImage url={slide.display_url}/>
    )
}