export interface APIResponse {
    data: {
        xdt_shortcode_media: APIPostData
    }
}

export interface APIPostData {
    id: string,
    coauthor_producers: {
        id: string,
        profile_pic_url: string,
        username: string,
    }[],
    dimensions: { height: number, width: number },
    display_url: string,
    edge_sidecar_to_children?: {
        edges: {node: APIPostDataSlide}[],
    },
    owner: {
        full_name: string,
        profile_pic_url: string,
        username: string,
    },
    edge_media_preview_comment: {
        count: number,
    },
    edge_media_preview_like: {
        count: number,
    },
    edge_media_to_caption: {
        edges: {
            node: {
                text: string,
            }
        }[]
    },
    is_video: boolean,
    taken_at_timestamp: number,
}

export interface APIPostDataSlide {
    id: string,
    display_url: string,
    is_video: boolean,
}