"use client";

import getImgBase64FromUrl from "@/app/actions/getImgBase64FromUrl";
import { useEffect, useState } from "react";

export default function ProxiedImage({url, className}: {url: string, className?: string}) {
    const [imgSrc, setImgSrc] = useState<string | null>();

    useEffect(() => {
        onload();

        async function onload() {
            const thisBase64 = await getImgBase64FromUrl(url);
            setImgSrc(`data:image/jpeg;base64, ${thisBase64}`);
        }
    }, [url]);

    return imgSrc ? (
        <img src={imgSrc} alt="" className={className}/>
    ) : null;
}